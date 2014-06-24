[![Build Status](https://travis-ci.org/shonny-ua/gulp-extract-sourcemap.svg)](https://travis-ci.org/shonny-ua/gulp-extract-sourcemap)
[![Dependencies](https://david-dm.org/shonny-ua/gulp-extract-sourcemap.svg)](https://david-dm.org/shonny-ua/gulp-extract-sourcemap)
[![devDependencies](https://david-dm.org/shonny-ua/gulp-extract-sourcemap/dev-status.svg)](https://david-dm.org/shonny-ua/gulp-extract-sourcemap#info=devDependencies&view=table)
[![NPM version](https://badge.fury.io/js/gulp-extract-sourcemap.svg)](http://badge.fury.io/js/gulp-extract-sourcemap)

# [gulp](https://github.com/wearefractal/gulp)-extract-sourcemap

[![NPM](https://nodei.co/npm/gulp-extract-sourcemap.png?downloads=true&stars=true)](https://nodei.co/npm/gulp-extract-sourcemap/)

<table>
<tr> 
<td>Package</td><td>gulp-extract-sourcemap</td>
</tr>
<tr>
<td>Description</td>
<td>Gulp Task to strips an inline source into its own file and updates the original file to reference the new external source map</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.8</td>
</tr>
<tr>
<td>Gulp Version</td>
<td>3.x</td>

</tr>
</table>

## Install

```sh
$ npm install --save-dev gulp-extract-sourcemap
```

## Usage

~~var browserify   = require('gulp-browserify');~~
Gulp added [~~gulp-browserify~~](https://github.com/deepak1556/gulp-browserify) to their [blacklist](https://github.com/gulpjs/plugins/issues/47)!
```js
var gulp         = require('gulp');
var browserify   = require('browserify');
var vinylSource  = require('vinyl-source-stream');
var vinylBuffer  = require('vinyl-buffer');
var extractor    = require('gulp-extract-sourcemap');
var uglify       = require('gulp-uglifyjs');
var filter       = require('gulp-filter');
var path         = require('path');

gulp.task('bundle', function() {
    var exchange = {
        source_map: {
            file: 'bundle.min.js.map',
            root: '/',
            orig: ''
        }
    };

    return browserify( ['./app.js'], {
            basedir:        'src/js/',
            commondir:      false,
            insertGlobals:  true
        }) )
        .bundle({
            debug: true //it's necessary to a source map generate
        })
        .pipe( vinylSource( 'bundle.js' ) )
        .pipe( vinylBuffer() )
        .pipe( extractor({
            basedir:                path.join(__dirname, 'dist'),
            removeSourcesContent:   true
        }) )
        .on('postextract', function(sourceMap){
            console.log(sourceMap);
            exchange.source_map.orig = sourceMap;
        })
        .pipe( filter('**/*.js') )
        .pipe( uglify( 'bundle.min.js', {
            outSourceMap: true,
            basePath: './dist/',
            output: {
                source_map: exchange.source_map // it's necessary 
                            // to correct generate of a final source map
                            // of an uglified javascript bundle
            }
        }) )
        .pipe( gulp.dest( 'dist' ) );
});
```

### Options

#### basedir

Type : `String`

Specifies base directory for sources paths transformation from absolute paths to relative ones. Sources in browserify generated source maps contain absolute files paths. For correct mapping in browser we need transform them to relative paths.

If option don't specified, all paths will transform relative to streemed source file cwd. If it isn't defined, paths will transform relative to process.cwd().

#### removeSourcesContent

Type : `Boolean`

You set a flag, removeSourcesContent, which will remove the sourcesContent field from the extracted source map.

#### ~~fakeFix~~

~~Type : `Boolean`~~

[~~gulp-browserify~~](https://github.com/deepak1556/gulp-browserify) ~~outputs bundled JavaScript code and inline source map containt refs to fake script filename like fake_1d87bebe.js. It causes some problems with correct source maps working in browsers. Also, if we use a bundled assets checksum version control, we have a problem. Same unchanged code after bundling have other checksum. The cause for this is random 8 symbols in said fake script filename.~~

~~You set a flag, fakeFix, which will fix it. The fake script filename wil changed to streemed source file name.~~

Gulp added [~~gulp-browserify~~](https://github.com/deepak1556/gulp-browserify) to their [blacklist](https://github.com/gulpjs/plugins/issues/47)!
Option fakeFix deprecated. Use 0.0.7 version, if You need it.

#### sourceMappingFileName

Type : `String`

As defult gulp-extract-sourcemap plugin cteate an external source map named as a streemed source file name with '.map' suffix. To specify different source map filename use this param.

### Events

Other than standard Node.js stream events, gulp-extract-sourcemap emits its own events.

#### ~~missing-map~~

```javascript
.on('missing-map', function(){})
```
~~emitted if no map was found in the stream (the src still is piped through in this case, but no map file is piped)~~
Event don't emit from version 0.1.0. You can use `postextract` event for the same goal. If `sourceMapJson` equivalent to empty string, then 
no map was found in the stream.

#### postextract

```javascript
.on('postextract', function(sourceMapJson){})
```

Event triggered after the source map extracting process is over and provides the source map data json object as an argument to the callback.

It's necessary to correct generate of a final source map of an uglified javascript bundle without writing and reading intermediary files to disk.

See [Usage](#usage) exsample.


### Works with gulp-extract-sourcemap

- [browserify](https://github.com/substack/node-browserify)
- [vinyl-source-stream](https://github.com/hughsk/vinyl-source-stream)
- [gulp-uglifyjs](https://github.com/craigjennings11/gulp-uglifyjs)

## License

[MIT](http://opensource.org/licenses/MIT) © [Oleksandr Ovcharenko](mailto:shonny.ua@gmail.com)
