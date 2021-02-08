'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();


sass.compiler = require('node-sass');

gulp.task ('sass', function () {
    return gulp.src('./css/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./css'))
            .pipe(browserSync.stream());
});

gulp.task('serve', gulp.series(['sass'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch('./css/**/*.scss', gulp.series(['sass']));
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch("./js/*.js").on('change', browserSync.reload);

}));

exports.default = gulp.series(['serve']);