var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var cssmin = require('gulp-minify-css');
var concat = require('gulp-concat');
var paths = gulp.paths;

gulp.task('styles', function (done) {
  runSequence('cleanStyles', 'buildStyles', 'injectStyles', done);
});

gulp.task('cleanStyles', function () {
  return del([paths.styles.dest + '/allStyles.css']);
});

gulp.task('buildStyles', function () {
  return gulp.src(paths.styles.src)
    .pipe(sass({
      sourceMap: true,
      errLogToConsole: true
    }).on('error', sass.logError))
    .pipe(autoprefixer("last 3 version", "safari 5", "ie 9"))
    .pipe(concat('allStyles.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(paths.styles.dest));
});
