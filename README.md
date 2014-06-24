[![Build Status](https://travis-ci.org/shonny-ua/gulp-extract-sourcemap.svg)](https://travis-ci.org/shonny-ua/gulp-extract-sourcemap)
[![Dependencies](https://david-dm.org/shonny-ua/gulp-extract-sourcemap.svg)](https://david-dm.org/shonny-ua/gulp-extract-sourcemap)
[![devDependencies](https://david-dm.org/shonny-ua/gulp-extract-sourcemap/dev-status.svg)](https://david-dm.org/shonny-ua/gulp-extract-sourcemap#info=devDependencies&view=table)
[![NPM version](https://badge.fury.io/js/gulp-extract-sourcemap.svg)](http://badge.fury.io/js/gulp-extract-sourcemap)

# [gulp](https://github.com/wearefractal/gulp)-extract-sourcemap

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

```js
var gulp         = require('gulp');
var browserify   = require('gulp-browserify');
var extractor    = require('gulp-extract-sourcemap');
var path         = require('path');

gulp.task('bundle', function() {
    return gulp.src( ['src/js/app.js'])
        .pipe( browserify({
            basedir:        'src/js/',
            commondir:      false,
            insertGlobals:  true,
            debug:          true
        }) )
        .pipe( extractor({
            basedir:                path.join(__dirname, 'dist'),
            removeSourcesContent:   true,
            fakeFix:                true
        }) )
        .on('postextract', function(sourceMap){
            console.log(sourceMap);
        })
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

#### sourceMappingFileName

Type : `String`

As defult gulp-extract-sourcemap plugin cteate an external source map named as a streemed source file name with '.map' suffix. To specify different source map filename use this param.

### Events

Other than standard Node.js stream events, gulp-extract-sourcemap emits its own events.

#### missing-map

```javascript
.on('missing-map', function(){})
```
emitted if no map was found in the stream (the src still is piped through in this case, but no map file is piped)

#### postextract

```javascript
.on('postextract', function(sourceMapJson){})
```

Event triggered after the source map extracting process is over and provides the source map data json object as an argument to the callback.


### Works with gulp-extract-sourcemap

- [gulp-browserify](https://github.com/deepak1556/gulp-browserify)
- [gulp-rev](https://github.com/sindresorhus/gulp-rev)

## License

[MIT](http://opensource.org/licenses/MIT) © [Oleksandr Ovcharenko](mailto:shonny.ua@gmail.com)
