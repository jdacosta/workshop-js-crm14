var config = require('./');

module.exports = {
    src: config.sourceDirectory + '/servers/ssl/*',
    dest: config.serverDirectory + '/ssl'
};
