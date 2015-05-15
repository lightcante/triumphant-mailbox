/**************************************
  Set plugin dependencies
**************************************/
var gulp = require('gulp');

//require gulp plugins
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var open = require('gulp-open');

/*
PASTE <script src="//localhost:35729/livereload.js"></script>
IN THE HEAD OF THE PAGE FOR LIVERELOAD TO WORK
 */
var paths = {
  scripts: 'client/public/assets/js/*.js',
  images: 'client/public/assets/img/*.*',
  sass: 'client/public/assets/css/sass/**/*.scss',
  foundationSass: 'client/public/assets/lib/foundation-apps/scss',
  fontAwesomeSass: 'client/public/assets/lib/font-awesome/scss',
  styles: 'client/public/assets/css/*.css',
  angularScripts: 'client/public/app/**/*.js',
  html: ['client/public/index.html','client/public/app/**/*.html'],
  server: 'server/**/*.js'
};

gulp.task('angular', function() {
  return gulp.src([
    paths.angularScripts
  ])
  .pipe(jshint())
  .pipe(jshint.reporter(stylish))
  .pipe(livereload());
});

gulp.task('scripts', function() {
  return gulp.src([
    paths.scripts
  ])
  .pipe(jshint())
  .pipe(jshint.reporter(stylish))
  .pipe(livereload());
});

gulp.task('sass', function () {
  gulp.src([paths.sass])

    .pipe(sourcemaps.init())

    .pipe(sass({
      includePaths: [paths.foundationSass, paths.fontAwesomeSass],
      sourcemap: true
    }))

    .pipe(sourcemaps.write())

    .on('error', sass.logError)

    .pipe(gulp.dest('client/public/assets/css'));
});

gulp.task('styles', function() {
  return gulp.src([
    paths.styles
  ])
  .pipe(livereload());
});

gulp.task('html', function() {
  return gulp.src(
    paths.html 
  )
  .pipe(livereload());
});

gulp.task('images', function() {
  return gulp.src([
    paths.images
  ])
  .pipe(livereload());
});

gulp.task('server', function() {
  return gulp.src([
    paths.server
  ])
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
});

gulp.task('startServer', shell.task([
  'nodemon server/server.js'
]));

gulp.task('openInBrowser', function(){
  var options = {
    url: 'http://localhost:3000'
  };
  gulp.src('./client/public/index.html')
  .pipe(open('', options));
});

//gulp.task('openInBrowser', shell.task([
//  'google-chrome http://localhost:3000', 
//  'open http://localhost:3000'
//]));


gulp.task('watch', function () {
  livereload.listen();
  
  gulp.watch(paths.scripts,['scripts']);
  gulp.watch(paths.html,['html']);
  gulp.watch(paths.images,['images']);
  gulp.watch(paths.sass,['sass']);
  gulp.watch(paths.styles,['styles']);
  gulp.watch(paths.angularScripts,['angular']);
  gulp.watch(paths.server,['server']);
});

gulp.task('default', ['sass', 'watch', 'startServer', 'openInBrowser']);
