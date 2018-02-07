var config = require('../config/default');
var cryptoJS = require('./crypto');

const rp = require('request-promise-native');
let token;
let expire;

async function get(url) {
    let t = await getToken();
    var options = {
        uri: url,
        headers: {
            'Content-Type': 'application/json',
            'access_token': t
        },
        json: true // Automatically parses the JSON string in the response
    };
    return rp(options);
}

async function post(url, body) {
    let t = await getToken();
    var options = {
        method: 'POST',
        uri: url,
        headers: {
            'Content-Type': 'application/json',
            'access_token': t
        },
        body: body,
        json: true
    };
    return rp(options);
}

async function postWithoutToken(url, body) {
    var options = {
        method: 'POST',
        uri: url,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
        json: true
    };
    return rp(options);
}

async function mdelete(url) {
    let t = await getToken();
    var options = {
        uri: url,
        headers: {
            'Content-Type': 'application/json',
            'access_token': t
        },
        method: 'DELETE',
    };
    return rp(options);
}

async function put(url, body) {
    let t = await getToken();
    var options = {
        uri: url,
        body: body,
        headers: {
            'Content-Type': 'application/json',
            'access_token': t
        },
        method: 'PUT',
        json: true
    };
    return rp(options);
}

function isTokenExpired() {
    let tokenExpired = expire || 0;
    let nowTime = new Date().getTime();
    if (tokenExpired > nowTime) {
        return false;
    } else {
        return true;
    }
}

async function getToken() {
    if (isTokenExpired(expire)) {
        let u = cryptoJS.aesEncrypt(config.secretName);
        let p = cryptoJS.aesEncrypt(config.secretPassword);
        let res = await postWithoutToken(config.url + 'Global/GetToken', {
            username: u,
            password: p
        });
        token = res.Token;
        expire = res.Expires;
        return token;
    } else {
        return token;
    }
}

module.exports = {
    get: get,
    post: post,
    delete: mdelete,
    put: put,
    getToken: getToken
}