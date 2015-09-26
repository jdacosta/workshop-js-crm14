var config   = require('./');
var pngquant = require('imagemin-pngquant');

module.exports = {
    src:  config.sourceAssets + '/img/**/*',
    dest: config.publicAssets + '/img',
    imagemin: {
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
        multipass: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }
};
