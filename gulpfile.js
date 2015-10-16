'use strict';

/**
 * REQUIRE GULP PLUGINS
 */
var gulp = require('gulp'),
  gulpUtil = require('gulp-util'),
  gulpCompass = require('gulp-compass'),
  gulpMinifyCss = require('gulp-minify-css'),
  gulpAutoprefixer = require('gulp-autoprefixer'),
  gulpConcat = require('gulp-concat'),
  gulpUglify = require('gulp-uglify'),
  browserSync = require('browser-sync');

/**
 * CAPTURE FILE SOURCES
 */
var bowerDir = 'bower_components/',
  bowerCss = [
    bowerDir + 'foundation/css/foundation.min.css',
    bowerDir + 'normalize.min.css',
    bowerDir + 'font-awesome.min.css'
  ],
  bowerScss = [],
  bowerJs = [
    bowerDir + 'jquery/dist/jquery.min.js',
    bowerDir + 'foundation/js/foundation.min.js'
  ];
var customCss = ['build/css/app.css'],
  customScss = ['build/scss/app.scss'],
  customJs = ['build/js/custom.js'];
var cssSources = ['build/css/**/*.css'],
  scssSources = ['build/scss/**/*.scss'],
  jsSources = ['build/js/**/*.js'],
  mediaSources = ['build/media/**/*.*'],
  htmlSources = ['build/*.html'];

/**
 * STYLE
 */
 // grab bower scss and drop in build/scss folder
gulp.task('bowerScss', function() {
  return gulp.src(bowerScss)
    .pipe(gulp.dest('build/scss'));
});
 // run compass on app.scss
 // don't forget to @import all the packages (bower)
 // _custom.scss is used to add custom styles
gulp.task('sass', ['bowerScss'], function() {
  return gulp.src(customScss)
    .pipe(gulpCompass({
      css: 'build/css',
      sass: 'build/scss',
      image: 'build/media',
      style: 'expanded'
    }));
});
 // grab the bower css, minify, concat and drop in build/css and dist/css
gulp.task('bowerCss', function() {
  return gulp.src(bowerCss)
    .pipe(gulpMinifyCss({
      compatibility: 'ie8'
    }))
    .pipe(gulpConcat('bower.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(gulp.dest('dist/css'));
});
 // grab the output from the sass task, autoprefix, minify
 // and drop in build/css and dist/css
gulp.task('css', ['bowerCss', 'sass'], function() {
  return gulp.src(customCss)
    .pipe(gulpAutoprefixer('last 2 versions', 'ie 8'))
    .pipe(gulpMinifyCss({
      compatibility: 'ie8'
    }))
    .pipe(gulpConcat('app.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(gulp.dest('dist/css'));
});

/**
 * JAVASCRIPT
 */
 // grab bower js minify, concat and drop in build/js and dist/js
gulp.task('bowerJs', function() {
  return gulp.src(bowerJs)
    .pipe(gulpUglify())
    .pipe(gulpConcat('bower.min.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(gulp.dest('dist/js'));
});
 // grab custom.js minify, concat and dorp in build/js and dist/js
gulp.task('js', ['bowerJs'], function() {
  return gulp.src(customJs)
    .pipe(gulpUglify())
    .pipe(gulpConcat('app.min.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(gulp.dest('dist/js'));
});

/**
 * MEDIA
 */
 // grab all media and move to dist/media
gulp.task('media', function() {
  return gulp.src(mediaSources)
    .pipe(gulp.dest('dist/media'));
});

/**
 * HTML
 */
 // grab all html and move to dist/
gulp.task('html', function() {
  return gulp.src(htmlSources)
    .pipe(gulp.dest('dist'));
});
/**
 * WATCH
 */
 // watch the work files for changes
gulp.task('watch', [], function() {
  gulp.watch(scssSources, ['css']); //all scss files
  gulp.watch(customJs, ['js']); // custom.js
  gulp.watch(htmlSources, ['html']); //all html
});
/**
 * BROWSER SYNC
 */
gulp.task('bs', function() {
  browserSync.init(["./dist/css/*.css", "./dist/js/*.js", './dist/*.html'], {
    server: {
      baseDir: "./dist"
    }
  });
});

/**
 * DEFAULT
 */
gulp.task('default', ['css', 'js', 'media', 'html', 'bs', 'watch']);
