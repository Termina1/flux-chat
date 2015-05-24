var flo = require('fb-flo');
var fs = require('fs');

function resolver(filepath, callback) {
  // gutil.log('Reloading \'' + gutil.colors.cyan(filepath) + '\' with flo...');
  callback({
    resourceURL: filepath,
    contents: fs.readFileSync('./build/' + filepath).toString(),
    reload: filepath.match(/\.(js)$/),
  });
}

var server = flo( './build', {
  port: 8888,
  host: 'localhost',
  verbose: false,
  glob: [ '*.js', '*.css' ]
}, resolver);
