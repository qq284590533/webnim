const fs = require('fs');
const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);

const options = {
    key: fs.readFileSync('./ssh/key.pem'),
    cert: fs.readFileSync('./ssh/cert.pem')
}

const isProd = process.env.NODE_ENV === "prodution";
const https = process.env.IS_HTTPS === "TRUE" ? options : false

module.exports = {
    publicPath: './',
    outputDir: 'webNim',
    lintOnSave: false,
    assetsDir: 'static',
    productionSourceMap: isProd ? false : true,
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('static', resolve('src/static'));
    },
    devServer: {
        host: '127.0.0.1',
        port: '8080',
        open: false,
        https: https,
    }
}
