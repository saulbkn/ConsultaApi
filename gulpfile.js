'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
const jsdoc = require('gulp-jsdoc3');
const eslint = require('gulp-eslint');

sass.compiler = require('node-sass');

gulp.task ('sass', function () {
    return gulp.src('./css/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./css'))
            //Recarga los estilos de la página, pero con reload se recarga la propia página.
            .pipe(browserSync.stream());
});

gulp.task('eslint', function () {
    return gulp.src(['./js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('doc', function (cb) {
    return gulp.src(['./js/**/*.js'])
        .pipe(jsdoc(cb));
});

gulp.task('serve', gulp.series(['sass', 'doc', 'eslint'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch('./css/**/*.scss', gulp.series(['sass']));
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch("./js/*.js").on('change', browserSync.reload);
    gulp.watch("./js/*.js").on('change', gulp.series(['doc']));
    gulp.watch("./js/*.js").on('change', gulp.series(['eslint']));
}));

exports.default = gulp.series(['serve']);