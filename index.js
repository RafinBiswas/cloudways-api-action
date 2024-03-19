/**
 * Import/Require statement for @actions/core
 * 
 * @since 1.0.0
 * 
 * @type {any}
 */
const core = require('@actions/core');

/**
 * Import/Require statement for node-fetch
 * 
 * @since 1.0.0
 * 
 * @type {any}
 */
const fetch = require('node-fetch');

/**
 * The Cloudways API URI.
 *
 * @since 1.0.0
 *
 * @type {String}
 */
const apiUri = '';

/**
 * API supported versions.
 *
 * @since 1.0.0
 *
 * @type {Array<String>}
 */
const supportedApiVersions = ['v1'];

/**
 * API supported request methods.
 *
 * @since 1.0.0
 *
 * @type {Array<String>}
 */
const supportedRequestMethods = ['GET', 'POST', 'PUT', 'DELETE'];

/**
 * Get Cloudways API URI.
 * 
 * @since 1.0.0
 * 
 * @returns {String}
 */
function getApiUri() {
	if (apiUri) {
		return apiUri;
	}

    const apiVersion = core.getInput('api-version').toLowerCase();
    if (!supportedApiVersions.includes(apiVersion)) {
        throw new Error('The API version does not exist.');
    }

    return apiUri = 'https://api.cloudways.com/api/' + apiVersion;
}

/**
 * Get request method
 * 
 * @since 1.0.0
 * 
 * @returns {String}
 */
function getRequestMethod() {
    const requestMethod = core.getInput('request-method').toUpperCase();
    if (!supportedRequestMethods.includes(requestMethod)) {
        throw new Error(`The API request method [${ requestMethod }] not allowed.`);
    }

    return requestMethod;
}

/**
 * Get access token.
 *
 * We need the Cloudways API Key and the email address of the account.
 * The access token will be used to authenticate the request.
 *
 * @link https://developers.cloudways.com/docs/#!/AuthenticationApi#getOAuthAccessToken
 *
 * @since 1.0.0
 *
 * @returns {String}
 */
async function getOauthToken() {
    const body = {
        api_key: core.getInput('api-key'),
        email: core.getInput('email'),
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    /**
     * The API response.
     *
     * If the request is successful, the response will contain the access token.
     * Otherwise, it'll contain the error message.
     *
     * @since 1.0.0
     *
     * @type {{
     *    error: Boolean,
     *    error_description: String,
     *    access_token: String,
     *    expires_in: Number,
     *    token_type: String
     * }}
     */
    const response = await fetch(`${ getApiUri() }/oauth/access_token`, options).then(res => res.json());

    if (response.error) {
        throw new Error(response.error_description);
    }

    if (!response.access_token || response.access_token === '') {
        throw new Error('The access token does not exist.');
    }

    core.info('Successfully authenticated with Cloudways API');

    return response.access_token;
}

/**
 * Get request options
 * 
 * @since 1.0.0
 * 
 * @param {{}} params The request body params
 * @returns {{method: String, body: String, headers: {}}}}
 */
async function getRequestOptions(params) {
    const options = {
        method: getRequestMethod(),
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const accessTokenRequred = core.getBooleanInput('token-required');
    if (accessTokenRequred) {
        let accessToken = await getOauthToken();
		core.setSecret('accessToken');

        options.headers['Authorization'] = `Bearer ${ accessToken }`;
    }

	if (core.isDebug()) {
		core.debug(`The Cloudways API Request Playload: ${ JSON.stringify(options) }`);
	}

    return options;
}

/**
 * Create API request.
 *
 * @link https://developers.cloudways.com/docs/
 *
 * @since 1.0.0
 *
 * @param {string} token The access token.
 * @returns {Promise<{ok: String, code: Number, body: any}>}
 */
async function requestApi() {
    const apiPath = core.getInput('api-path');
    const requestBody = core.getMultilineInput('request-body');
    const bodyParams = {};

    for (let bodyParam of requestBody) {
        bodyParam = bodyParam.split(':');
        if (bodyParam.length > 1) {
            bodyParams[bodyParam[0]] = bodyParam[1];
        } else {
            bodyParams[bodyParam[0]] = '';
        }
    }
    const options = await getRequestOptions(bodyParams);

    return await fetch(`${ getApiUri() }${ apiPath }`, options).then(response => {
        return response.json().then(data => {
            return {
                ok: response.ok,
                code: response.status,
                body: data
            }
        });
    });
}

/**
 * Run the action.
 * It'll execute Cloudways API request.
 *
 * @since 1.0.0
 *
 * @returns {Promise<void>}
 */
async function run() {
    try {
        const response = await requestApi();
        responseJson = JSON.stringify(response);
		if (!response.ok) {
			throw new Error(`The Cloudways API Request Failed: ${ responseJson }`);
		}

        core.exportVariable('cwResponse', responseJson);
        core.setOutput('response', responseJson);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
