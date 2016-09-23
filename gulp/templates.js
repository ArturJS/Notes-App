var gulp = require('gulp');
var del = require('del');
var templateCache = require('gulp-angular-templatecache');
var runSequence = require('run-sequence');
var paths = gulp.paths;

gulp.task('templateCache', function (done) {
  runSequence('cleanTemplates', 'buildTemplates', done);
});

gulp.task('cleanTemplates', function () {
  return del([paths.templates.dest + '/templates.js']);
});

gulp.task('buildTemplates', function () {
  return gulp.src(paths.templates.src)
    .pipe(templateCache({
      standalone: true
    }))
    .pipe(gulp.dest(paths.templates.dest));
});
