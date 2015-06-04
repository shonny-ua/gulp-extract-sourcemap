var through     = require('through2');
var gutil       = require('gulp-util');
var File        = gutil.File;
var PluginError = gutil.PluginError;
var path        = require('path');
var convSM      = require('convert-source-map');

var PLUGIN_NAME = 'gulp-extract-sourcemap';

function extract(opts){
    if (!opts) {
        opts = {};
    }

    return through.obj(function (file, enc, cb) {
        var sMap = '';
        if (!file.isNull()) {
            var src = file.contents.toString('utf8');
            var sMapFileName = opts.sourceMappingFileName ? path.basename(opts.sourceMappingFileName) : ( path.basename(file.path) + '.map' );

            var pos = src.search(/\/[\/\*][#@]\s+sourceMappingURL=data:application\/json;(?:charset:utf-8;)?base64,/i)

            if (~pos) {
                try {
                    sMap = convSM.fromComment(src).toJSON();
                } catch (x) {
                    this.emit('error', new PluginError(PLUGIN_NAME,  x));
                    sMap = '';
                }

                src = src.substr(0, pos);
            }

            if (sMap) {
                try {
                    sMap = JSON.parse(sMap);
                } catch (x) {
                    this.emit('error', new PluginError(PLUGIN_NAME,  x));
                    sMap = '';
                }

                if (sMap && opts.removeSourcesContent && sMap.sourcesContent) {
                    delete sMap.sourcesContent;
                }
                if (sMap && sMap.sources) {
                    var basedir = opts.basedir || file.cwd || process.cwd();

                    for (var i = sMap.sources.length; i--;) {
                        sMap.sources[i] = path.relative( basedir, sMap.sources[i] );
                    }
                }
            }

            if (sMap) {
                this.push(new File({
                    cwd: file.cwd,
                    base: file.base,
                    path: path.join(file.base, sMapFileName),
                    contents: new Buffer( JSON.stringify( sMap ) )
                }));

                switch(path.extname(file.path)) {
                    case '.css':
                        src += '/*# sourceMappingURL=' + (opts.sourceMappingFileName || sMapFileName) + ' */';
                        break;

                    default:
                        src += '//# sourceMappingURL=' + (opts.sourceMappingFileName || sMapFileName);
                }

            }

            file.contents = new Buffer(src);
        }
        this.push(file);
        this.emit('postextract', sMap);
        cb();
    });
}

module.exports = extract;
