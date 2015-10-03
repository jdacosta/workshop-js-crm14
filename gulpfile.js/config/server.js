var config = require('./');

module.exports = {
    src: [
      config.sourceDirectory + '/servers/**/*',
      '!' +   config.sourceDirectory + '/servers/ssl/*'
    ],
    dest: config.serverDirectory
};
