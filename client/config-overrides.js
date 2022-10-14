const webpack = require('webpack');
const path = require('path');
const args = process.argv.slice(2);
const https = args[2] === '--https' && args[3] === 'true';

module.exports = (config, env) => {
    config.externals = {
        'babel-polyfill': 'babel-polyfill',
        jQuery: 'jQuery'
    };
    return config;
}
