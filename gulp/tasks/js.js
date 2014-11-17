var gulp = require('gulp');
var bem = require('gulp-bem');
var pack = require('gulp-bem-pack');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var config = require('../config');

gulp.task('js', ['tree'], function () {
  function buildJs(page) {
    return global.tree.deps(config.tree.pagesPath + '/' + page.id)
      .pipe(bem.src('{bem}.js'))
      .pipe(pack(page.id + '.js', {
        debug: config.isDebug
      }))
      .pipe(gulpif(!config.isDebug, uglify({
        compress: true
      })))
      .pipe(gulp.dest(config.js.dest));
  }

  return bem.objects(config.tree.pagesPath).map(buildJs);
});
