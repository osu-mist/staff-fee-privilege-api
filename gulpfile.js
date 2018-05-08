const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');


gulp.task('lint', () =>
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('test', () =>
  gulp.src(['tests/*.js'])
    .pipe(mocha({ reporter: 'spec' })));

gulp.task('start', () => nodemon({ script: 'app.js' }));

gulp.task('run', ['lint', 'test', 'start']);
