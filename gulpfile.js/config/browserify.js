var config = require('./');

module.exports = {
    name: 'app-desktop.js',
    dest: config.publicAssets + '/js/',
    browserify: {
        entries: [config.sourceAssets + '/js/app.js'],
        debug: false
    }
};