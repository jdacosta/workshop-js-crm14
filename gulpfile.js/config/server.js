var config = require('./');

module.exports = {
    src: config.sourceDirectory + '/servers/**/*',
    dest: config.serverDirectory
};
