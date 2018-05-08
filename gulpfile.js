var gulp         = require('gulp');
var less         = require('gulp-less');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefix   = require('gulp-autoprefixer');
var minify       = require('gulp-minify-css');
var rename       = require('gulp-rename');
var header       = require('gulp-header');
var nunjucks     = require('gulp-nunjucks-render');
var pkgJson      = require('./package.json');
var argv         = require('yargs').argv;
var baseURL      = (argv.production === undefined) ? '' : pkgJson.demo.url;
var banner       = ['/** <%= package.name %> | <%= package.demo.url %> */ '];

gulp.task('styles', function() {
  return gulp.src('src/less/bundle.less')
    .pipe(less())
    .pipe(autoprefix({browsers: ['last 2 versions']}))
    .pipe(rename(pkgJson.name + '.css'))
    .pipe(header(banner, {package: pkgJson}))
    .pipe(gulp.dest('dist/')) // <-- deliver expanded for dist
    .pipe(minify())
    .pipe(rename(pkgJson.name + '.min.css'))
    .pipe(header(banner, {package: pkgJson}))
    .pipe(gulp.dest('dist/')) // <-- deliver compressed for dist
    .pipe(gulp.dest('docs/')) // <-- deliver extra copy for docs
})

gulp.task('docs', function() {
  return gulp.src('src/docs/pages/**/*.njk')
    .pipe(nunjucks({
      path: 'src/docs/partials/',
      data: {
        package: pkgJson,
        baseURL: baseURL
      },
    }))
    .pipe(gulp.dest('docs/'));
})

gulp.task('default', ['styles', 'docs'], function() {
  gulp.watch('src/less/*', ['styles']),
  gulp.watch('src/docs/**/*', ['docs'])
})
