var config = require('./');

module.exports = {
    src:  config.sourceAssets + '/icons/*.svg',
    dest: config.publicAssets + '/fonts',
    sassDest: config.sourceAssets + '/sass/fonts/generated',
    template: './gulpfile.js/tasks/icons/icons.templating',
    sassOutputName: '_icons.scss',
    fontPath: '../../assets/fonts',
    className: 'icon',
    options: {
        fontName: 'icons',
        appendCodepoints: true,
        normalize: true
    }
};
