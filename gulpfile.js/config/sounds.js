var config   = require('./');

module.exports = {
    src:  config.sourceAssets + '/sounds/**/*',
    dest: config.publicAssets + '/sounds'
};
