var config = {};

config.devServerURL    = 'http://localhost:1337';
config.publicDirectory = './dist/public';
config.serverDirectory = './dist/servers';
config.sourceDirectory = './src';
config.publicAssets    = config.publicDirectory + '/assets';
config.sourceAssets    = config.sourceDirectory + '/public';

module.exports = config;