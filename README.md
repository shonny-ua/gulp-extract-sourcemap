# [gulp](https://github.com/wearefractal/gulp)-extract-sourcemap 

> Gulp Task to strips an inline source into its own file and updates the original file to reference the new external source map

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

#### fakeFix

Type : `Boolean`

[gulp-browserify](https://github.com/deepak1556/gulp-browserify) outputs bundled JavaScript code and inline source map containt refs to fake script filename like fake_1d87bebe.js. It causes some problems with correct source maps working in browsers. Also, if we use a bundled assets checksum version control, we have a problem. Same unchanged code after bundling have other checksum. The cause for this is random 8 symbols in said fake script filename.

You set a flag, fakeFix, which will fix it. The fake script filename wil changed to streemed source file name.

#### sourceMappingFileName

Type : `String`

As defult gulp-extract-sourcemap plugin cteate an external source map named as a streemed source file name with '.map' suffix. To specify different source map filename use this param.

### Works with gulp-extract-sourcemap

- [gulp-browserify](https://github.com/deepak1556/gulp-browserify)
- [gulp-rev](https://github.com/sindresorhus/gulp-rev)

## License

[MIT](http://opensource.org/licenses/MIT) © [Oleksandr Ovcharenko](mailto:shonny.ua@gmail.com)