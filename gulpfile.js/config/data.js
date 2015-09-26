var config = require('./');

module.exports = {
    src:  config.sourceAssets + '/data/**',
    dest: config.publicAssets + '/data'
};
