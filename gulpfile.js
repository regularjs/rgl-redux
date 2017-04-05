const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const plumber = require('gulp-plumber');
const all = require('gulp-all');


gulp.task('build:example', function () {
  const webpackConfig = require('./examples/webpack.config');
  const examples = fs.readdirSync('./examples/').filter(file => fs.statSync(path.resolve(__dirname, `./examples/${file}`)).isDirectory());
  return all(examples.map(example => {
    return gulp.src(`./examples/${example}/src/index.js`)
      .pipe(plumber())
      .pipe(named())
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(gulp.dest(`./examples/${example}/build`));
  }))
});
