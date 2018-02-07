const key = 'defed456!@#@#ewaa45h4r1238132&AU';
const iv = '45de#d@#$!#asgfd';
var CryptoJS = require('crypto-js');

function aesEncrypt(text) {
    let key2 = CryptoJS.enc.Utf8.parse(key);
    let iv2 = CryptoJS.enc.Utf8.parse(iv);
    var ciphertext = CryptoJS.AES.encrypt(text, key2, {
        iv: iv2,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return ciphertext.toString();
}

function aesDecrypt(text) {
    let key2 = CryptoJS.enc.Utf8.parse(key);
    let iv2 = CryptoJS.enc.Utf8.parse(iv);
    var bytes = CryptoJS.AES.decrypt(text.toString(), key2, {
        iv: iv2,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    // var plaintext = bytes;
    return plaintext;
}

module.exports = {
    aesEncrypt,
    aesDecrypt
}