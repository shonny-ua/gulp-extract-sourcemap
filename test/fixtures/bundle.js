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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdGVzdC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL3Rlc3QvaHcvYXBwLmpzIiwiL3Rlc3QvaHcvaGVsbG8uanMiLCIvdGVzdC9ody93b3JsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBoID0gcmVxdWlyZSgnLi9oZWxsbycpO1xudmFyIHcgPSByZXF1aXJlKCcuL3dvcmxkJyk7XG5cbmZ1bmN0aW9uIG91dHB1dCgpIHtcbiAgICB2YXIgcmVzdWx0ID0gaC5jYWxsKCkgKyAnLCAnICsgdy5jYWxsKCkgKyAnISc7XG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG91dHB1dCgpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN0ciA9ICdIZWxsbydcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGVsbG8oKXtcbiAgICByZXR1cm4gc3RyO1xufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN0ciA9ICdXb3JsZCdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd29ybGQoKXtcbiAgICByZXR1cm4gc3RyO1xufSJdfQ==
