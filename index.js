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
 * Import/Require statement for querystring
 * 
 * @since 1.0.0
 * 
 * @type {any}
 */
// const querystring = require('querystring');
import querystring from 'querystring';

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
const supportedRequestMethods = ['GET', 'POST', 'PUT'/* , 'DELETE' */];

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
    '/packages',
    '/settings',
    '/backup-frequencies',
    '/countries',
    '/monitor_durations',
    '/monitor_targets',

    // Server : Server Add, upgrade or delete
    // '/server',
    // '/server/cloneServer',
    '/server/stop',
    '/server/start',
    '/server/restart',
    // '/server/scaleServer',
    // '/server/scaleVolume',
    '/server/[0-9]+/diskUsage',
    '/server/[0-9]+',
    '/server/manage/getMaintenanceWinSettings',
    '/server/manage/postMaintenanceWinSettings',
    // '/server/attachStorage',
    // '/server/scaleStorage',

    // Server Management : Backup, Settings and Master Credentials
    '/server/manage/backup',
    '/server/manage/snapshotFrequency',
    '/server/manage/backupSettings',
    '/server/manage/remove_local_backup',
    // '/server/manage/package',
    '/server/manage/settings',
    // '/server/manage/masterUsername',
    // '/server/manage/masterPassword',
    '/server/disk',
    '/server/disk/[0-9]+',
    '/server/disk/cleanup',

    // Service : Manage different services of your stack
    '/service',
    '/service/state',
    '/service/varnish',
    '/service/appVarnish',

    // Application : Add, clone and delete applications
    // '/app',
    '/app/[0-9]+',
    // '/app/clone',
    // '/app/cloneToOtherServer',
    // '/staging/app/cloneApp',
    // '/staging/app/cloneToOtherServer',
    '/app/malcare',
    '/app/malcare/traffic',
    '/app/malcare/traffic/summary',
    '/app/malcare/logins',
    '/app/malcare/logins/summary',
    '/app/malcare/bots/bad',
    '/app/malcare/whitelisted_ips',
    '/app/malcare/whitelisted_bots',
    '/app/malcare/enable',
    '/app/malcare/disable',
    '/app/malcare/whitelist_ip',
    '/app/malcare/whitelist_bot',

    // Authentication : API Authentication related calls
    // '/oauth/access_token', // Disable it

    // Projects : Manage your projects
    // '/project',
    '/project/[0-9]+',

    // Git : Manage Git Deployment
    '/git/generateKey',
    '/git/key',
    '/git/branchNames',
    '/git/clone',
    '/git/pull',
    '/git/history',

    // CloudwaysBot : Manage Server and App alerts
    '/alerts/',
    '/alerts/[0-9]+',
    '/alert/markAsRead/[0-9]+',
    '/alert/markAllRead/',
    // '/integrations',
    // '/integrations/create',
    // '/integrations/[0-9]+',

    // App Management : Manage your application
    '/app/manage/cname',
    '/app/manage/restore',
    '/app/manage/rollback',
    '/app/manage/takeBackup',
    '/app/manage/backup',
    '/app/manage/aliases',
    '/app/manage/cronList',
    // '/app/manage/dbPassword',
    // '/app/manage/symlink',
    // '/app/manage/webroot',
    '/app/cors_header',
    '/app/manage/webP',
    '/app/manage/enforce_https',
    '/app/manage/reset_permissions',
    '/app/manage/fpm_setting',
    '/app/manage/varnish_setting',
    // '/app/creds',
    // '/app/creds/[0-9]+',
    // '/app/getAppSshPerms',
    // '/app/updateAppSshPerms',
    // '/app/getApplicationAccess',
    '/app/get_settings_value',
    '/app/state',
    '/app/manage/geo_ip_header',
    '/app/manage/xmlrpc',
    '/app/manage/device/detection',
    '/app/manage/ignore/query_string',
    '/app/manage/php_direct_execution',
    '/app/manage/cron_setting',
    // '/app/creds/changeAdminCredentials',
    '/app/cache/purge',

    // Security : Manage Security settings
    // '/security/ownSSL',
    // '/security/removeCustomSSL',
    '/security/lets_encrypt_install',
    '/security/createDNS',
    '/security/verifyDNS',
    '/security/lets_encrypt_manual_renew',
    '/security/lets_encrypt_auto',
    // '/security/lets_encrypt_revoke',
    '/security/whitelistedIpsMysql',
    '/security/whitelisted',
    '/security/isBlacklisted',
    // '/security/siab',
    // '/security/adminer',

    // Operation : Status of the operations running in background
    '/operation/[0-9]+',

    // SSH Keys Management : Manage your server & application ssh keys
    // '/ssh_key',
    // '/ssh_key/[0-9]+',

    // ADD-ONS Management : Manage your Add-ons
    '/addon',
    '/addon/activate',
    '/addon/deactivate',
    '/addon/upgrade',
    '/addon/activateOnServer',
    '/addon/deactivateOnServer',
    '/addon/request',
    // '/addon/elastic/domains',
    // '/addon/elastic/verify_domain',
    // '/addon/elastic/domain',

    // Transfer Server : Transfer server to other cloudways account
    // '/server_transfer/request',
    // '/server_transfer/status',
    // '/server_transfer/cancel',

    // Supervisor : Manage Supervisor Queues
    '/app/supervisor',
    '/app/supervisor/[0-9]+',
    '/supervisor/queue/status',
    '/supervisor/queue/restart',

    // Cloudflare : Enterprise
    // '/app/cloudflareCdn',
    // '/app/cloudflareCdn/fetchTXT',
    // '/app/cloudflareCdn/delete',
    // '/app/cloudflareCdn/transferDomain',
    '/app/cloudflareCdn/purgeDomain',
    // '/app/cloudflareCdn/getDnsQuery',
    // '/app/cloudflareCdn/verifyTxtRecords',
    // '/app/cloudflareCdn/checkFPCStatus',
    // '/app/cloudflareCdn/deployFPC',
    // '/app/cloudflareCdn/appSetting',
    '/app/cloudflare/[0-9]+/analytics',
    '/app/cloudflare/[0-9]+/security',

    // SafeUpdate : automatically detects updates
    '/app/safeupdates',
    '/app/safeupdates/[0-9]+',
    '/app/safeupdates/[0-9]+/status',
    '/app/safeupdates/status',
    '/app/safeupdates/list',
    '/app/safeupdates/[0-9]+/settings',
    '/app/safeupdates/settings',
    '/app/safeupdates/[0-9]+/schedule',
    '/app/safeupdates/[0-9]+/history',

    // Staging Management : Manage Staging Applications
    '/staging/app/tables',
    '/sync/app',
    '/staging/auth/status',
    '/staging/htaccessUpdate',
    '/staging/app/logs',
    // '/staging/app/deleteBackup',

    // Monitoring/Analytics
    '/server/monitor/summary',
    '/server/analytics/serverUsage',
    '/server/monitor/detail',
    '/app/monitor/detail',
    '/app/monitor/summary',
    '/app/analytics/traffic',
    '/app/analytics/trafficDetails',
    '/app/analytics/php',
    '/app/analytics/mysql',
    '/app/analytics/cron',

    // Team Member
    // '/member',
    // '/member/[0-9]+',

    // Application Vulnerability
    '/app/vulnerabilities/[0-9]+',
    '/app/vulnerabilities/[0-9]+/refresh',

    // DNS Made Easy
    // '/dme/domains',
    '/dme/domains/[a-zA-Z0-9-]+/status',
    // '/dme/domains/[a-zA-Z0-9-]+/records',
    // '/dme/domains/[a-zA-Z0-9-]+/records/[a-zA-Z0-9-]+',
    '/dme/domains/[a-zA-Z0-9-]+/usage'
];

/**
 * API JSON response allowed length.
 * 
 * @since 1.0.0
 *
 * @type {Number}
 */
const responseLength = 1001;

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
 * Get request method.
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
 * Check the API is allowed to execute.
 * 
 * @since 1.0.0
 * 
 * @param {String} path The API request path
 * @returns {Boolean}
 */
function isValidPath(path) {
    return !!supportedApis.find(supportedApi => (new RegExp('^' + supportedApi + '$')).test(path));
}

/**
 * Deep merge two objects.
 * 
 * @since 1.0.0
 * 
 * @param {{}} sourceObject The source object or array
 * @param {{}} newObject The new object or array
 * @param {Boolean} strict Object deep merge mode
 * @returns {{}}
 */
function objectDeepMerge(sourceObject, newObject, strict = true) {
    const mergedObject = Array.isArray(sourceObject) ? [...sourceObject] : { ...sourceObject };

    for (let objectKey in newObject) {
        if (sourceObject.hasOwnProperty(objectKey) || !strict) {
            if (newObject[objectKey] instanceof Object && sourceObject[objectKey] instanceof Object) {
                mergedObject[objectKey] = objectDeepMerge(sourceObject[objectKey], newObject[objectKey]);
            } else {
                mergedObject[objectKey] = newObject[objectKey];
            }
        }
    }

    return mergedObject;
}

/**
 * Parse input payload body.
 * 
 * @since 1.0.0
 * 
 * @param {Array<String>} inputPayload Action input payload
 * @returns {{}}
 */
function parsePayload(inputPayload) {
    const parsedPayload = {};

    for (let inputParam of inputPayload) {
        if (!inputParam) {
            continue;
        }

        inputParam = inputParam.split(':');
        if (inputParam.length > 1) {
            const paramKeys = inputParam[0].split('.');
            const extractObject = {};
            let currentObject = extractObject;

            paramKeys.forEach((paramKey, keyIndex) => {
                if (keyIndex === paramKeys.length - 1) {
                    try {
                        inputParam[1] = inputParam[1].replace(/^"|"$/g, '');
                        currentObject[paramKey] = JSON.parse(inputParam[1]);
                    } catch {
                        currentObject[paramKey] = inputParam[1];
                    }

                } else {
                    currentObject[paramKey] = isNaN(paramKeys[keyIndex + 1]) ? {} : [];
                    currentObject = currentObject[paramKey];
                }
            });
            if(typeof parsedPayload[paramKeys[0]] != "undefined") {
                parsedPayload[paramKeys[0]] = objectDeepMerge(parsedPayload[paramKeys[0]], extractObject[paramKeys[0]]);
            } else {
                parsedPayload[paramKeys[0]] = extractObject[paramKeys[0]];
            }
        } else if(typeof parsedPayload[inputParam[0]] == "undefined") {
            parsedPayload[inputParam[0]] = '';
        }
    }

    return parsedPayload;
}

/**
 * Get API request send payload.
 * 
 * @since 1.0.0
 * 
 * @returns {{}}
 */
function getRequestPayload() {
    return parsePayload(core.getMultilineInput('request-body'));
}

/**
 * Get API response store payload.
 * 
 * @since 1.0.0
 * 
 * @returns {{}}
 */
function getResponsePayload() {
    const responsePayload = core.getMultilineInput('request-response');

    return {payload: responsePayload, data: parsePayload(responsePayload)};
}

/**
 * Get request options.
 * 
 * @since 1.0.0
 * 
 * @returns {{method: String, body: String, headers: {*}}}}
 */
async function getRequestOptions() {
    const options = {
        method: getRequestMethod(),
        body: null,
        queryString: null,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const requestPayload = getRequestPayload();

    if (options.method == 'GET') {
        options.queryString = querystring.stringify(requestPayload);
    } else {
        options.body = JSON.stringify(requestPayload);
    }

    const accessTokenRequired = core.getBooleanInput('token-required');
    if (accessTokenRequired) {
        let accessToken = await getOauthToken();
        options.headers['Authorization'] = `Bearer ${ accessToken }`;
    }

	if (core.isDebug()) {
		core.debug(`The Cloudways API Request Payload: ${ JSON.stringify(options) }`);
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
 * @returns {Promise<{ok: String, code: Number, body: {*}}>}
 */
async function requestApi() {
    const apiPath = core.getInput('api-path');
    if (!isValidPath(apiPath)) {
        throw new Error(`The request API "${ apiPath }" not allowed`);
    }

    const options = await getRequestOptions();
    const apiUrl = options.queryString ? `${ getApiUri() }${ apiPath }?${ options.queryString }` : `${ getApiUri() }${ apiPath }`;

    return await fetch(apiUrl, options).then(response => {
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
 * Set reusable response variables.
 *
 * @since 1.0.0
 * 
 * @param {*} responseBody The response body
 * @returns {void}
 */
function setReusableResponse(responseBody) {
    const actionPrefix = core.getInput('prefix');
    const reusableResponse = getResponsePayload();

    if (!reusableResponse.payload.length) {
        return;
    }

    const mergedReusableResponse = objectDeepMerge(reusableResponse.data, responseBody);

    for (let responseKey of reusableResponse.payload) {
        if (!responseKey) {
            continue;
        }

        responseKey = responseKey.split(':')[0];
        const responseKeyParts = responseKey.split('.');
        let currentValue = mergedReusableResponse;

        for (let responseKeyPart of responseKeyParts) {
            if (typeof currentValue[responseKeyPart] == "undefined") {
                break;
            }
            currentValue = currentValue[responseKeyPart];
        }

        responseKey = responseKey.replaceAll('.', '_')
        const currentValueJson = JSON.stringify(currentValue);
        if (currentValueJson.length < responseLength) {
            core.exportVariable(actionPrefix + responseKey, currentValue);
        } else {
            let errorObject = {
                ok: true,
                json_error: true,
                description: "The response JSON is too long to export value"
            };
            core.exportVariable(actionPrefix + responseKey, errorObject);
        }

        core.info('Saved export variable name is "' + actionPrefix + responseKey + '"');
    }
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
        const responseJson = JSON.stringify(response.body);

		if (!response.ok) {
			throw new Error(`The Cloudways API Request Failed: ${ responseJson }`);
		}

        if (core.isDebug()) {
            core.info(`The Cloudways API Request Success: ${ responseJson }`);
        } else {
            core.info('The Cloudways API Request Successfully executed');
        }

        setReusableResponse(response.body);
        core.setOutput('response', responseJson);
    } catch (error) {
        if (core.isDebug()) {
            core.setFailed(error.message + '. ' + (error.stack || ''));
        } else {
            core.setFailed(error.message + '.');
        }
    }
}

run();
