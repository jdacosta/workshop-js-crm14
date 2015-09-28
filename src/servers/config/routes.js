var Static  = require('./static');

exports.endpoints = [
    { method: 'GET', path: '/{static*}', config: Static.get }
];
