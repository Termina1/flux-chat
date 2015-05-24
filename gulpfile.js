var gulp = require('gulp');
var webpack = require('gulp-webpack');
var scss = require('gulp-sass');
var concat = require('gulp-concat');
var child = require('child_process');
var plumber = require('gulp-plumber');
var webserver = require('gulp-webserver');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var template = require('gulp-template');
var fs = require('fs');
var rev = require('gulp-rev');
var gulpif = require('gulp-if');
var assign = require('object-assign');
var runSeq = require('run-sequence');
var rename = require('gulp-rename');
var csso = require('gulp-csso');

var env = process.env.NODE_ENV || "development";

function onlyprod(stream) {
  return gulpif(env === 'production', stream());
}

function onlydev(stream) {
  return gulpif(env === 'development', stream());
}

var buildDest = './build';
var jsSrc = './js/**/*';
var cssSrc = './scss/**/*';
var index = './index.html';

gulp.task('js', function() {
    var config = require('./webpack.config.js');
    return gulp.src('./js/main.js')
        .pipe(webpack(config))
        .pipe(onlydev(rename.bind(global, 'main.js')))
        .pipe(gulp.dest(buildDest));
});

gulp.task('scss', function() {
    return gulp.src([
            './node_modules/normalize.css/normalize.css',
            './scss/style.scss'
        ]).pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(scss())
        .pipe(postcss([autoprefixer()]))
        .pipe(concat('style.css'))
        .pipe(onlyprod(csso))
        .pipe(onlyprod(rev))
        .pipe(gulp.dest(buildDest))
        .pipe(onlyprod(rev.manifest.bind(rev, 'scss-manifest.json')))
        .pipe(gulp.dest(buildDest));
});

gulp.task('images', function() {
  return gulp.src('./img/**')
      .pipe(gulp.dest(buildDest))
})

gulp.task('index', function() {
    var man;
    if(env !== 'development') {
      man = ['scss-manifest', 'manifest'].reduce(function(acc, el) {
        var res = JSON.parse(fs.readFileSync(buildDest + '/' + el + '.json').toString());
        return assign(acc, res);
      }, {});
    } else {
      man = {
        'style.css': 'style.css',
        'main.js': 'main.js'
      }
    }
    var data = { domain: 'localhost:3000' };
    data.manifest = man;
    return gulp.src('./index.html')
        .pipe(template(data))
        .pipe(gulp.dest(buildDest));
})

gulp.task('watch', function() {

    node = child.spawn('node', ['flo.js'], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, turning off fb-flo...');
        }
    });

    gulp.watch(jsSrc, ['js']);
    gulp.watch(index, ['index']);
    gulp.watch(['./img/**/*'], ['images']);
    gulp.watch(cssSrc, ['scss']);
});

gulp.task('server', function() {
    return gulp.src(buildDest)
        .pipe(webserver({
            directoryListing: true,
            open: true
        }));
});

gulp.task('watch-and-serve', ['server', 'watch']);

gulp.task('default', runSeq(['scss', 'js', 'images'], 'index'))
