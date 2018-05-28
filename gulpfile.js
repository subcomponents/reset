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
var baseURL      = (argv.production) ? pkgJson.demo.url : '';
var banner       = ['/** <%= package.name %> | <%= package.demo.url %> */\n'];

gulp.task('css', function() {
  return gulp.src('src/less/bundle.less')
    .pipe(less())
    .pipe(autoprefix())
    .pipe(rename(pkgJson.name + '.css'))
    .pipe(header(banner, { package: pkgJson }))
    .pipe(gulp.dest('dist')) // <-- deliver expanded for dist
    .pipe(minify())
    .pipe(rename(pkgJson.name + '.min.css'))
    .pipe(header(banner, { package: pkgJson }))
    .pipe(gulp.dest('dist')) // <-- deliver compressed for dist
    .pipe(gulp.dest('docs')) // <-- deliver extra copy for docs
})

gulp.task('html', function() {
  return gulp.src('src/docs/pages/**/*.njk')
    .pipe(nunjucks({
      path: 'src/docs/partials',
      data: { package: pkgJson, baseURL: baseURL, timestamp: Date.now() }
    }))
    .pipe(gulp.dest('docs'));
})

gulp.task('default', ['css', 'html'], function() {
  gulp.watch('src/less/*', ['css']),
  gulp.watch('src/docs/**/*', ['html'])
})
