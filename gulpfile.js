const gulp = require('gulp');
const bundle = require('./tasks/bundle');

gulp.task('bundle', bundle.build);
gulp.task('watch', bundle.watch);

gulp.task('default', bundle.build);
