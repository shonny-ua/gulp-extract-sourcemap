(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var h = require('./hello');
var w = require('./world');

function output() {
    var result = h.call() + ', ' + w.call() + '!';
    console.log(result);
    return result;
}

module.exports = output();
},{"./hello":2,"./world":3}],2:[function(require,module,exports){
'use strict';

var str = 'Hello'
module.exports = function hello(){
    return str;
}
},{}],3:[function(require,module,exports){
'use strict';

var str = 'World'
module.exports = function world(){
    return str;
}
},{}]},{},[1])