'use strict';

var _               = require('underscore');
var assert          = require('assert');
var extractor       = require('../index');
var path            = require('path');
var gutil           = require('gulp-util');
var fs              = require('fs');


var fixturesDir     = __dirname + '/fixtures';
// var sMapFileName    = fixturesDir + '/bundle.js.map';

var mapedBundleSrc = fs.readFileSync( path.join(fixturesDir, 'bundle.js') );
var unmapedBundleSrc = fs.readFileSync( path.join(fixturesDir, 'bundle.womap.js') );

var mapedCssSrc = fs.readFileSync( path.join(fixturesDir, 'icons.css') );

var defaultSources = [ '../node_modules/browserify/node_modules/browser-pack/_prelude.js',
  'app.js',
  'hello.js',
  'world.js' ];

var cssSources = ['icons.css'];

var basedirSources = [ 'node_modules/browserify/node_modules/browser-pack/_prelude.js',
  'hw/app.js',
  'hw/hello.js',
  'hw/world.js' ];

var mapFileInStream;
var sourceMap;
var sourceMapData;

it('should javascript correct processed without any params', function (cb) {
    mapFileInStream = false;
    sourceMap = undefined;
    sourceMapData = undefined;
    var stream =initStream(mapedBundleSrc);

    stream.on('data', function(file){
        commonDataCB(file);
        if (path.extname(file.path) === '.js') {
            var src = file.contents.toString('utf8');
            assert(/\/\/# sourceMappingURL=bundle\.js\.map/.test(src), 'javascript source must constaint correct source map link');
        } else {
            assert.equal(file.path, 'src/bundle.js.map', 'correct source map filename');
        }
    });

    stream.on('end', function(){
        assert.equal(mapFileInStream, true, 'mapFileInStream must be equal boolean true');
        assert.equal(typeof(sourceMap), 'object', 'typeof sourceMap must be object');
        assert(_.isEqual(sourceMap, sourceMapData), 'sourceMap and sourceMapData must be equal');
        assert(_.isEqual(_.difference(sourceMap.sources, defaultSources), []), 'sourceMap.sources and defaultSources must be equal');
        assert(sourceMap.sourcesContent instanceof Array, 'sourceMap.sourcesContent must be instanceof Array');
        cb();
    });

    stream.end();
});

it('should css correct processed without any params', function (cb) {
    mapFileInStream = false;
    sourceMap = undefined;
    sourceMapData = undefined;

    var stream = extractor();

    stream.on('postextract', function(sourceObj){
        sourceMap = sourceObj;
    });

    stream.write(new gutil.File({
        path: 'css/icons.css',
        cwd: './',
        base: 'css',
        contents: new Buffer(mapedCssSrc)
    }));

    stream.on('data', function(file){
        commonDataCB(file);
        if (path.extname(file.path) === '.css') {
            var src = file.contents.toString('utf8');
            assert(/\/\*# sourceMappingURL=icons\.css\.map \*\//.test(src), 'css source must constaint correct source map link');
        } else {
            assert.equal(file.path, 'css/icons.css.map', 'correct source map filename');
        }
    });

    stream.on('end', function(){
        assert.equal(mapFileInStream, true, 'mapFileInStream must be equal boolean true');
        assert.equal(typeof(sourceMap), 'object', 'typeof sourceMap must be object');
        assert(_.isEqual(sourceMap, sourceMapData), 'sourceMap and sourceMapData must be equal');
        assert(_.isEqual(_.difference(sourceMap.sources, cssSources), []), 'sourceMap.sources and cssSources must be equal');
        assert(sourceMap.sourcesContent instanceof Array, 'sourceMap.sourcesContent must be instanceof Array');
        cb();
    });

    stream.end();
});

it('should javascript correct processed with params', function (cb) {
    mapFileInStream = false;
    sourceMap = undefined;
    sourceMapData = undefined;
    var stream =initStream(mapedBundleSrc, {
        basedir: '/test',
        removeSourcesContent: true,
        sourceMappingFileName: 'http://static.exsample.com/js/souceMap.js.map'
    });

    stream.on('data', function(file){
        commonDataCB(file);
        if (path.extname(file.path) === '.js') {
            var src = file.contents.toString('utf8');
            assert(/\/\/# sourceMappingURL=http:\/\/static\.exsample\.com\/js\/souceMap\.js\.map/.test(src), 'javascript source must constaint correct source map link');
        } else {
            assert.equal(file.path, 'src/souceMap.js.map', 'correct source map filename');
        }
    });

    stream.on('end', function(){
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
    mapFileInStream = false;
    sourceMap = undefined;
    var stream =initStream(unmapedBundleSrc);

    stream.on('data', commonDataCB);

    stream.on('end', function(){
        assert.equal(mapFileInStream, false, 'mapFileInStream must be equal boolean false');
        assert.equal(sourceMap, '', 'sourceMap must be equal empty string');
        cb();
    });

    stream.end();
});

function initStream(source, opts) {
    var stream = extractor(opts);

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