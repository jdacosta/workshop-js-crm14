var config = require('./');

module.exports = {
    src: config.sourceAssets + '/*.html',
    dest: config.publicDirectory,
    minify: {
        empty: true,
        cdata: true,
        comments: true,
        conditionals: true,
        spare: true,
        quotes: true,
        loose: true
    }
};
