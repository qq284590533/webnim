const fs = require('fs');
const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);

const options = {
    key: fs.readFileSync('./ssh/key.pem'),
    cert: fs.readFileSync('./ssh/cert.pem')
}

const isProd = process.env.NODE_ENV === "production";
const https = process.env.IS_HTTPS === "TRUE" ? options : false

module.exports = {
    publicPath: './',
    outputDir: 'webNim',
    lintOnSave: false,
    assetsDir: 'static',
    productionSourceMap: isProd ? false : true,
    chainWebpack: config => {
        // 排除sdk所在文件夹，防止二次打包
        config.module.rule('js').exclude.add(resolve('src/sdk')).end();
        // 修复热更新失效问题
        config.resolve.symlinks(true);
        // 定义别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('utils', resolve('src/utils'))
            .set('plugins', resolve('src/plugins'))
            .set('configs', resolve('src/configs'));

    },
    devServer: {
        host: '127.0.0.1',
        port: '8080',
        open: false,
        https: https,
        hotOnly: true
    }
}
