var config = require('./');

module.exports = {
    autoprefixer: { browsers: ['last 2 versions'] },
    src: config.sourceAssets + '/sass/**/*{sass,scss}',
    dest: config.publicAssets + '/css',
    settings: {
        indentedSyntax: false, // sass syntax
        imagePath: config.publicAssets + '/images' // image-url helper
    }
};
