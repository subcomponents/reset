var gulp         = require('gulp');
var less         = require('gulp-less');
var autoprefix   = require('gulp-autoprefixer');
var minify       = require('gulp-minify-css');
var rename       = require('gulp-rename');
var header       = require('gulp-header');
var nunjucks     = require('gulp-nunjucks-render');
var pkgJson      = require('./package.json');
var browserSync  = require('browser-sync').create();
var banner       = ['/** (C) License <%= package.license %> | <%= package.repo.url %> */\n\n'];

gulp.task('css', function() {
  return gulp.src('./src/less/bundle.less')
    .pipe(less())
    .pipe(autoprefix())
    .pipe(rename(pkgJson.keyword + '.css'))
    .pipe(header(banner, { package: pkgJson }))
    .pipe(gulp.dest('./dist')) // <-- deliver expanded for dist
    .pipe(minify())
    .pipe(rename(pkgJson.keyword + '.min.css'))
    .pipe(header(banner, { package: pkgJson }))
    .pipe(gulp.dest('./dist')) // <-- deliver compressed for dist
    .pipe(gulp.dest('./docs')) // <-- deliver extra copy for docs
    .pipe(browserSync.stream())
})

gulp.task('html', function() {
  return gulp.src('./src/docs/pages/**/*.njk')
    .pipe(nunjucks({
      path: './src/docs/partials',
      data: { package: pkgJson }
    }))
    .pipe(gulp.dest('./docs'))
    .pipe(browserSync.stream())
})

gulp.task('readme', function() {
  return gulp.src('./src/readme/*.njk')
    .pipe(nunjucks({
      ext: '.md',
      data: { package: pkgJson }
    }))
    .pipe(gulp.dest('./'))
})

gulp.task('server', function() {
  browserSync.init({ server: "./docs", open: false })
})

gulp.task('watch', function() {
  gulp.watch('./src/less/**/*', ['css']);
  gulp.watch('./src/docs/**/*', ['html']);
  gulp.watch('./src/readme/**/*', ['readme']);
})

gulp.task('default', ['css', 'html', 'readme', 'server', 'watch'])
