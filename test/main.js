'use strict';

var _               = require('underscore');
var assert          = require('assert');
var extractor       = require('../index');
var path            = require('path');
var gutil           = require('gulp-util');
var fs              = require('fs');


var fixturesDir     = __dirname + '/fixtures';
var sMapFileName    = fixturesDir + '/bundle.js.map';

var mapedBundleSrc = fs.readFileSync( path.join(fixturesDir, 'bundle.js') );
var unmapedBundleSrc = fs.readFileSync( path.join(fixturesDir, 'bundle.womap.js') );

var defaultSources = [ '../node_modules/gulp-browserify/node_modules/browserify/node_modules/browser-pack/_prelude.js',
  'fake_507e40f3.js',
  'hello.js',
  'world.js',
  '../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/index.js',
  '../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js',
  '../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js',
  '../node_modules/gulp-browserify/node_modules/browserify/node_modules/process/browser.js' ];

var basedirSources = [ 'node_modules/gulp-browserify/node_modules/browserify/node_modules/browser-pack/_prelude.js',
  'hw/bundle.js',
  'hw/hello.js',
  'hw/world.js',
  'node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/index.js',
  'node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js',
  'node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js',
  'node_modules/gulp-browserify/node_modules/browserify/node_modules/process/browser.js' ];

var misingMapEvent;
var mapFileInStream;
var sourceMap;
var sourceMapData;

it('should javascript correct processed without any params', function (cb) {
    misingMapEvent  =  false;
    mapFileInStream = false;
    sourceMap = undefined;
    sourceMap = undefined;
    var stream =initStream(mapedBundleSrc);

    stream.on('data', function(file){
        commonDataCB(file);
        if (path.extname(file.path) === '.js') {
            var src = file.contents.toString('utf8');
            assert(/fake_507e40f3\.js/.test(src), 'javascript source must constaint fake require');
            assert(/\/\/# sourceMappingURL=bundle\.js\.map/.test(src), 'javascript source must constaint correct source map link');
        } else {
            assert.equal(file.path, 'src/bundle.js.map', 'correct source map filename');
        }
    });

    stream.on('end', function(){
        assert.equal(misingMapEvent, false, 'misingMapEvent must be equal boolean false');
        assert.equal(mapFileInStream, true, 'mapFileInStream must be equal boolean true');
        assert.equal(typeof(sourceMap), 'object', 'typeof sourceMap must be oject');
        assert(_.isEqual(sourceMap, sourceMapData), 'sourceMap and sourceMapData must be equal');
        assert(_.isEqual(_.difference(sourceMap.sources, defaultSources), []), 'sourceMap.sources and defaultSources must be equal');
        assert(sourceMap.sourcesContent instanceof Array, 'sourceMap.sourcesContent must be instanceof Array');
        cb();
    });

    stream.end();
});

it('should javascript correct processed with params', function (cb) {
    misingMapEvent  =  false;
    mapFileInStream = false;
    sourceMap = undefined;
    sourceMap = undefined;
    var stream =initStream(mapedBundleSrc, {
        basedir: '/test',
        removeSourcesContent: true,
        fakeFix: true,
        sourceMappingFileName: 'http://static.exsample.com/js/souceMap.js.map'
    });

    stream.on('data', function(file){
        commonDataCB(file);
        if (path.extname(file.path) === '.js') {
            var src = file.contents.toString('utf8');
            assert(!/fake_507e40f3\.js/.test(src), 'javascript source musn\'t constaint fake require');
            assert(/\/\/# sourceMappingURL=http:\/\/static\.exsample\.com\/js\/souceMap\.js\.map/.test(src), 'javascript source must constaint correct source map link');
        } else {
            assert.equal(file.path, 'src/souceMap.js.map', 'correct source map filename');
        }
    });

    stream.on('end', function(){
        assert.equal(misingMapEvent, false, 'misingMapEvent must be equal boolean false');
        assert.equal(mapFileInStream, true, 'mapFileInStream must be equal boolean true');
        assert.equal(typeof(sourceMap), 'object', 'typeof sourceMap must be oject');
        assert(_.isEqual(sourceMap, sourceMapData), 'sourceMap and sourceMapData must be equal');
        assert(_.isEqual(_.difference(sourceMap.sources, basedirSources), []), 'sourceMap.sources and basedirSources must be equal');
        assert.equal(typeof(sourceMap.sourcesContent), 'undefined', 'sourceMap.sourcesContent must be undefined');
        cb();
    });

    stream.end();
});

it('should missing-map event emit and postextract event provides empty string', function (cb) {
    misingMapEvent  =  false;
    mapFileInStream = false;
    sourceMap = undefined;
    var stream =initStream(unmapedBundleSrc);

    stream.on('data', commonDataCB);

    stream.on('end', function(){
        assert.equal(misingMapEvent, true, 'misingMapEvent must be equal boolean true');
        assert.equal(mapFileInStream, false, 'mapFileInStream must be equal boolean false');
        assert.equal(sourceMap, '', 'sourceMap must be equal empty string');
        cb();
    });

    stream.end();
});

function initStream(source, opts) {
    var stream = extractor(opts);

    stream.on('missing-map', function(){
        misingMapEvent = true;
    });

    stream.on('postextract', function(sourceObj){
        sourceMap = sourceObj;
    });

    stream.write(new gutil.File({
        path: 'src/bundle.js',
        cwd: '/test/hw',
        base: 'src',
        contents: new Buffer(source)
    }));

    return stream;
}

function commonDataCB(file) {
    if (path.extname(file.path) === '.map') {
        mapFileInStream = true;
        sourceMapData = JSON.parse(file.contents.toString('utf8'));
    }
}