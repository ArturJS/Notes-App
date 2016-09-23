var gulp = require('gulp');
var inject = require('gulp-inject');
var paths = gulp.paths;

gulp.task('injectStyles', function () {
  var target = gulp.src(paths.rootDir + '\\index.html');
  var sources = gulp.src([paths.styles.dest + '/allStyles.css'], {read: false});

  function addVersion(filepath) {
    return inject.transform.apply(inject.transform, [filepath + '?v=' + Date.now()]);
  }

  return target.pipe(inject(sources, {
    transform: addVersion
  }))
    .pipe(gulp.dest(paths.rootDir));
});

