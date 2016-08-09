/**
 * Gulpfile to automate build and release task
 * Most of it borrowed from Kitematic (https://github.com/kitematic/kitematic/blob/master/gulpfile.js)
 */

'use strict'

var packageJson = require('./package.json');
var sequence = require('run-sequence');
var gulp = require('gulp');
var fs = require('fs');
var del = require('del');
var $ = require('gulp-load-plugins')({
  rename: {
    'gulp-download-electron': 'electron'
  }
});

var concat = require('gulp-concat');


// Application dependencies
var dependencies = Object.keys(packageJson.dependencies);

// App options
var options = {
  dev: process.argv.indexOf('release') === -1,
  name: 'Twitch',
  app: 'Yoda.app',
  dmg: 'yoda-installer-1.0.1.dmg',
  icon: './src/resources/utils/yoda.icns',
  plist: './src/resources/utils/Info.plist',
  bundle: 'com.whoisandie.yoda'
};

// Paths
var paths = {
  APP: ['src/index.html', 'src/browser.js'],
  FONTS: 'src/resources/fonts/**',
  IMAGES: 'src/resources/images/**',
  JS_FILES: ['src/scripts/*.js'],
  CSS_FILES: ['src/styles/**/*.less', 'src/styles/*.less'],
  BUILD: './build',
  TMP: './tmp',
  RELEASE: './release'
};

// Clean build task
gulp.task('clean:build', function(cb){
  del([
    paths.BUILD
  ], cb);
});

// Clean Release task
gulp.task('clean:release', function(cb){
  del([
    paths.TMP,
    paths.RELEASE
  ], cb);
});

// Download task
gulp.task('download', ['clean:build'], function(cb){
  $.electron({
    version: packageJson['electron-version'],
    outputDir: 'cache'
  }, cb);
});

// Copy task
gulp.task('copy', function(){
  return gulp.src(paths.APP)
  .pipe(gulp.dest(options.dev ? paths.BUILD : paths.TMP))
  .pipe($.livereload());
});

// Fonts task
gulp.task('fonts', function(){
  return gulp.src(paths.FONTS)
  .pipe($.if(options.dev, $.changed(paths.BUILD)))
  .pipe(gulp.dest(options.dev ? paths.BUILD : paths.TMP))
  .pipe($.if(options.dev, $.livereload()));
});

// Images task
gulp.task('images', function(){
  return gulp.src(paths.IMAGES)
  .pipe($.if(options.dev, $.changed(paths.BUILD)))
  .pipe(gulp.dest(options.dev ? paths.BUILD : paths.TMP))
  .pipe($.if(options.dev, $.livereload()));
});

// Styles task
gulp.task('styles', function(){
  return gulp.src('src/styles/main.less')
  .pipe($.plumber(function(error) {
      $.util.log($.util.colors.red('Error (' + error.plugin + '): ' + error.message + ' in ' + error.fileName));
      this.emit('end');
  }))
  .pipe($.if(options.dev, $.changed(paths.BUILD)))
  .pipe($.less())
  .pipe($.if(!options.dev, $.cssmin()))
  .pipe(gulp.dest(options.dev ? paths.BUILD : paths.TMP))
  .pipe($.if(options.dev, $.livereload()));
});

// Scripts task
gulp.task('scripts', function(){
  return gulp.src(paths.JS_FILES)
  .pipe($.plumber(function(error) {
      $.util.log($.util.colors.red('Error (' + error.plugin + '): ' + error.message + ' in ' + error.fileName));
      this.emit('end');
  }))
  .pipe($.if(options.dev, $.changed(paths.BUILD)))
  .pipe($.babel({ blacklist: ['regenerator'] }))
  .pipe($.if(!options.dev, $.uglify({ mangle: false })))
  .pipe(gulp.dest(options.dev ? paths.BUILD : paths.TMP))
  .pipe($.if(options.dev, $.livereload()));
});


// Compile task
gulp.task('compile', ['download'], function(cb){
  sequence('copy', 'fonts', 'images', 'styles', 'scripts', cb);
});

gulp.task('cc', function() {
  return gulp.src(['build/*.js'])
    .pipe(concat('browser.js'))
    .pipe(gulp.dest('./dist/build/'));
});

// Watch task
gulp.task('watch', ['compile'], function(){
  gulp.watch(paths.APP, ['copy']);
  gulp.watch(paths.JS_FILES, ['scripts']);
  gulp.watch(paths.CSS_FILES, ['styles']);

  $.livereload.listen();

  var env = process.env;
  env.NODE_ENV = 'development';
  gulp.src('')
  .pipe($.shell(['cache\\electron.exe .'], {
    env: env
  }));
});

// Default task
gulp.task('default', ['watch']);
