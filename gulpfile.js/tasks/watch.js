var gulp   = require('gulp');
var watch  = require('gulp-watch');
var fonts  = require('../config/fonts');
var html   = require('../config/html');
var icons  = require('../config/icons');
var images = require('../config/images');
var sass   = require('../config/sass');
var server = require('../config/server');
var videos = require('../config/videos');

gulp.task('watch', ['browser-sync'], function () {
    watch(images.src, function () {
        gulp.start('images');
    });
    watch(videos.src, function () {
        gulp.start('videos');
    });
    watch(fonts.src, function () {
        gulp.start('fonts');
    });
    watch(sass.src, function () {
        gulp.start('sass');
    });
    watch(icons.src, function () {
        gulp.start('icons');
    });
    watch(html.src, function () {
        gulp.start('html');
    });
    watch(server.src, function () {
        gulp.start('server');
    });
});
