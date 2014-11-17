var gulp = require('gulp');
var bem = require('gulp-bem');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var csso = require('gulp-csso');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var config = require('../config');

gulp.task('css', ['tree'], function () {
  function buildCss(page) {
    return global.tree.deps(config.tree.pagesPath + '/' + page.id)
      .pipe(bem.src('{bem}.{css,styl}'))
      .pipe(concat(page.id + '.css'))
      .pipe(stylus())
      .pipe(autoprefixer({
          browsers: config.css.browsers,
          cascade: config.css.cascade
      }))
      .pipe(gulpif(!config.isDebug, csso(true)))
      .pipe(gulp.dest(config.css.dest));
  }

  return bem.objects(config.tree.pagesPath).map(buildCss);
});
