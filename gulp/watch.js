var gulp = require('gulp');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var paths = gulp.paths;

gulp.task('watch', function () {
  livereload.listen();

  watch(paths.styles.src, function () {
    gulp.start('styles');
    changed();
  });

  watch(paths.templates.src, function () {
    gulp.start('templateCache');
    changed();
  });

  watch(paths.scripts.src, function () {
    changed();
  });

  function changed() {
    livereload.changed(paths.rootDir + '\\index.html');
  }
});
