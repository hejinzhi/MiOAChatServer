(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var fs = require('fs');
var rOption={
    flags:"r",
    encoding:'base64',
    mode:0666
}

var wOption = {
  flags: 'a',
  encoding: 'base64',
  mode: 0666
}
var fileReadStream=fs.createReadStream('D:/111.jpg',rOption);
var fileWriteStream = fs.createWriteStream('D:/github/shunda/public/254.jpg',wOption);

fileReadStream.on('data',function(data){
    fileWriteStream.write(data);
});

fileReadStream.on('end',function(){
    console.log("readStream end");
    fileWriteStream.end();
});

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1]);
