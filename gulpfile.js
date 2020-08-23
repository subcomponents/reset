var { gulp, src, dest, watch, series, parallel } = require('gulp');
var postcss      = require('gulp-postcss');
var presetEnv    = require('postcss-preset-env');
var atImport     = require('postcss-import');
var minify       = require('gulp-minify-css');
var rename       = require('gulp-rename');
var header       = require('gulp-header');
var nunjucks     = require('gulp-nunjucks-render');
var pkgJson      = require('./package.json');
var browserSync  = require('browser-sync').create();
var banner       = ['/** <%= package.version %> <%= package.repo.url %> */\n'];

function css() {
  return src('./src/css/bundle.css')
    .pipe(postcss([atImport, presetEnv({ preserve: true })]))
    .pipe(rename(pkgJson.keyword + '.css'))
    .pipe(header(banner, { package: pkgJson }))
    .pipe(dest('./dist')) // <-- deliver expanded for dist
    .pipe(minify())
    .pipe(rename(pkgJson.keyword + '.min.css'))
    .pipe(header(banner, { package: pkgJson }))
    .pipe(dest('./dist')) // <-- deliver compressed for dist
    .pipe(dest('./docs')) // <-- deliver extra copy for docs
    .pipe(browserSync.stream())
}

function docs() {
  return src('./src/docs/pages/**/*.njk')
    .pipe(nunjucks({
      path: './src/docs/partials',
      data: { package: pkgJson }
    }))
    .pipe(dest('./docs'))
    .pipe(browserSync.stream())
}

function readme() {
  return src('./src/readme/*.njk')
    .pipe(nunjucks({
      ext: '.md',
      data: { package: pkgJson }
    }))
    .pipe(dest('./'))
}

function server() {
  browserSync.init({ server: "./docs", open: false })
}

function watcher() {
  watch('./src/css/**/*', series(css, docs));
  watch('./src/docs/**/*', docs);
  watch('./src/readme/**/*', readme);
}

exports.default = parallel(css, docs, readme, server, watcher);
