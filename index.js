/**
 * Import/Require statement for @actions/core
 * 
 * @since 1.0.0
 * 
 * @type {any}
 */
// const core = require('@actions/core');
import * as core from '@actions/core';

/**
 * Import/Require statement for node-fetch
 * 
 * @since 1.0.0
 * 
 * @type {any}
 */
// const fetch = require('node-fetch');
import fetch from "node-fetch";

/**
 * The Cloudways API URI.
 *
 * @since 1.0.0
 *
 * @type {String}
 */
var apiUri = '';

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
 * Supported API endpoints.
 *
 * @since 1.0.0
 *
 * @type {Array<String>}
 */
const supportedApis = [
    // Lists : Get Possible Values for certain call parameters
    '/providers',
    '/regions',
    '/server_sizes',
    '/apps',
    '/backup-frequencies',
    '/countries',
    '/monitor_durations',
    '/monitor_targets',

    // Server : Server Add, upgrade or delete
    '/server',
];

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
        throw new Error('The API version does not exist');
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
        throw new Error(`The API request method [${ requestMethod }] not allowed`);
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
        email: core.getInput('email'),
        api_key: core.getInput('api-key')
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
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
        throw new Error('The access token does not exist');
    }

    core.info('Successfully authenticated with Cloudways API');

    return response.access_token;
}

/**
 * Check the API is allowed to execute
 * 
 * @since 1.0.0
 * 
 * @param {String} path The API request path
 * @returns {Boolean}
 */
function isValidPath(path) {
    return supportedApis.includes(path);
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

    if (options.method == 'GET') {
        delete options.body;
    }

    const accessTokenRequred = core.getBooleanInput('token-required');
    if (accessTokenRequred) {
        let accessToken = await getOauthToken();
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
    if (!isValidPath(apiPath)) {
        throw new Error(`The request API "${ apiPath }" not allowed`);
    }

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
		if (!response.ok) {
			throw new Error(`The Cloudways API Request Failed: ${ responseJson }`);
		}
        // const responseJson = JSON.stringify(response.body);
        const responseJson = '{"ok":true,"code":200,"body":{"status":true,"servers":[{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"},{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"},{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"},{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"},{"ok":true,"code":200,"body":{"status":true,"servers":[{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"},{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"},{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"},{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"}]}},{"ok":true,"code":200,"body":{"status":true,"servers":[{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"},{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"}';

        if (core.isDebug()) {
            core.info(`The Cloudways API Request Success: ${ responseJson }`);
        } else {
            core.info('The Cloudways API Request Successfully executed');
        }

        if (responseJson.length < 1010) {
            core.exportVariable('cwResponse', responseJson);
        } else {
            core.exportVariable('cwResponse', '{"ok":true,"json_error":true,"description":"The response JSON is too long to export value"}');
        }
        core.setOutput('response', responseJson);
    } catch (error) {
        core.exportVariable('cwResponse', '{"ok":false,"json_error":false,"description":"The Cloudways API Request Failed"}');

        if (core.isDebug()) {
            core.setFailed(error.message + '. ' + (error.stack || ''));
        } else {
            core.setFailed(error.message + '.');
        }
    }
}

run();
