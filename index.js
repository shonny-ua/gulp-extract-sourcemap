var through     = require('through2');
var gutil       = require('gulp-util');
var File        = gutil.File;
var PluginError = gutil.PluginError;
var path        = require('path');
var convSM      = require('convert-source-map');

var PLUGIN_NAME = 'gulp-extract-sourcemap';

function extract(jsFileName, opts){
    if (!opts) {
        opts = {};
    }

    return through.obj(function (file, enc, cb) {
        if (!file.isNull()) {
            if (!jsFileName) {
                jsFileName = path.basename(file.path);
            }

            var src = file.contents.toString('utf8');
            var sMap = '';
            var sMapFileName = jsFileName + '.map';

            try {
                sMap = convSM.fromComment(src).toJSON();
            } catch (x) {
                this.emit('error', new PluginError(PLUGIN_NAME,  x));
                sMap = '';
            }
                
            if (sMap) {
                var pos = src.indexOf('//# sourceMappingURL=data:application/json;base64,');
                if (!~pos) {
                    pos = src.indexOf('//@ sourceMappingURL=data:application/json;base64,');
                }

                if (~pos) {
                    src = src.substr(0, pos) + '//# sourceMappingURL=' + sMapFileName;
                }

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
                        var newSource = path.relative( basedir, sMap.sources[i] );
                        
                        if (opts.fakeFix && /\/fake_[0-9a-f]{8}\.js$/.test(newSource)) {
                            var fNameRX = new RegExp(path.basename(newSource), 'g');
                            src = src.replace(fNameRX, path.basename(file.path));
                            
                            newSource = newSource.replace(fNameRX, path.basename(file.path));
                        }

                        sMap.sources[i] = newSource;
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
            }

            file.contents = new Buffer(src);
            file.path = path.join(file.base, jsFileName);
        }
        this.push(file);
        cb();
    });
}

module.exports = extract;