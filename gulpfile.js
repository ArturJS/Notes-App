var gulp = require('gulp');
var runSequence = require('run-sequence');
var open = require('gulp-open');
var connect = require('connect');
var connectLivereload = require('connect-livereload');
var serveStatic = require('serve-static');

gulp.paths = {
  templates: {
    src: './templates/*.html',
    dest: './app/'
  },
  styles: {
    src: './styles/scss/*.scss',
    dest: './styles/css/'
  },
  scripts: {
    src: './app/**/*.js'
  },
  rootDir: __dirname
};

var config = {
  rootDir: __dirname,

  // any port to use for your local server
  servingPort: 8000
};

require('require-dir')('./gulp');

gulp.task('serve', [], function () {
  runSequence(['templateCache', 'styles', 'watch'], 'connect', 'open-chrome');
});

// `gulp connect` task starting your server
gulp.task('connect', function () {
  connect()
    // 'connectLivereload' inject JavaScript into our page with `index.html`
    // to listen for change notifications:
    //   <script src="//localhost:35729/livereload.js?snipver=1"></script>
    .use(connectLivereload())
    .use(serveStatic(config.rootDir))
    .listen(config.servingPort);
});

gulp.task('open-chrome', function () {
  return gulp.src('./Index.html')
    .pipe(open({
      uri: 'http://localhost:' + config.servingPort,
      app: 'chrome'
    }));
});
