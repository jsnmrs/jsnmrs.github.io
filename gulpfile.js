var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var cp            = require('child_process');
var imagemin      = require('gulp-imagemin');
var jshint        = require('gulp-jshint');
var merge         = require('merge-stream');
var newer         = require('gulp-newer');
var scsslint      = require('gulp-scss-lint');
var uglify        = require('gulp-uglify');


// Default task - build, launch BrowserSync, and watch files
gulp.task('default', ['browser-sync', 'watch']);

gulp.task('build', ['images', 'css', 'js', 'jekyll-build']);

gulp.task('css', ['scsslint']);
gulp.task('js', ['jshint', 'js-smush']);


// Watch tasks - images, JS, SCSS, HTML/markdown
gulp.task('watch', function () {
    gulp.watch('img/*', ['images']);
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch(['index.html', '_includes/*.html', '_layouts/*.html', '*.md', '_posts/*'], ['jekyll-rebuild']);
});


// Jekyll build - using GitHub Pages spec via bundle exec
gulp.task('jekyll-build', function (done) {
  browserSync.notify('Building Jekyll');
  return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
    .on('close', done);
});


// Jekyll rebuild - hook for Jekyll build after file changes
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});


// Local server - starts after initial build tasks finish
gulp.task('browser-sync', ['build'], function() {
  browserSync({
    server: {baseDir: '_site'},
    host: '127.0.0.1',
    port: 4000
  });
});


// SCSS linting - using scss_lint gem via bundle exec
gulp.task('scsslint', function() {
  return gulp.src(['_sass/**/*.scss'])
    .pipe(scsslint({bundleExec: true}));
});


// Image optimization - JPG, GIF, PNG, SVG
// Writes to base image directory and _site image directory (for immediate refresh)
// Only runs on images that are newer than the versions in public/img/
gulp.task('images', function() {
  return gulp.src('img/*')
    .pipe(newer('img'))
    .pipe(imagemin([
    	imagemin.jpegtran({progressive: true}),
    	imagemin.optipng({optimizationLevel: 5}),
    	imagemin.svgo({plugins: [{removeViewBox: false}]})
    ]))
    .pipe(gulp.dest('img'))
    .pipe(gulp.dest('_site/img'))
    .pipe(browserSync.reload({stream: true}));
});


// Concatenate, uglify JS files
gulp.task('js-smush', function() {

  var options = {
    preserveComments: 'license',
    mangle : true,
    compress : true
  };

  var picturefill = gulp.src(['js/vendor/picturefill.js'])
    .pipe(uglify(options))
    .pipe(gulp.dest('_site/js/'))
    .pipe(gulp.dest('js/'));

  var sw = gulp.src(['js/lib/sw.js'])
    .pipe(uglify(options))
    .pipe(gulp.dest('_site/'))
    .pipe(gulp.dest('./'));

  return merge(picturefill, sw)
    .pipe(browserSync.reload({stream: true}));
});


// JS linting
gulp.task('jshint', function() {
  return gulp.src(['_js/lib/*', 'gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// To-do
// Performance tasks
// HTML validation tasks
// Accessibility scan tasks
