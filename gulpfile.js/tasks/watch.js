var gulp   = require('gulp');
var watch  = require('gulp-watch');
var html   = require('../config/html');
var images = require('../config/images');
var sass   = require('../config/sass');
var server = require('../config/server');

gulp.task('watch', function () {
    watch(images.src, function () {
        gulp.start('images');
    });
    watch(sass.src, function () {
        gulp.start('sass');
    });
    watch(html.src, function () {
        gulp.start('html');
    });
    watch(server.src, function () {
        gulp.start('server');
    });
});
