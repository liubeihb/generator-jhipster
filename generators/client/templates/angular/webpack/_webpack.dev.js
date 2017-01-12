const webpack = require('webpack');
const path = require('path');
const commonConfig = require('./webpack.common.js');
const writeFilePlugin = require('write-file-webpack-plugin');
const webpackMerge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ENV = 'dev';

module.exports = webpackMerge(commonConfig({env: ENV}), {
    devServer: {
        contentBase: './target/www',
        proxy: [{
            context: [<% if (authenticationType == 'oauth2') { %>
                '/oauth',<% } %>
                '/api',
                '/management',
                '/swagger-resources',
                '/v2/api-docs',
                '/h2-console'
            ],
            target: 'http://127.0.0.1:<%= serverPort %>',
            secure: false
        }]
    },
    output: {
        path: path.resolve(<% if (buildTool === 'gradle') { %>'./build/www')<% } else { %>'./target/www')<% } %>,
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loaders: [
                'tslint-loader'
            ],
            exclude: ['node_modules', /reflect-metadata\/Reflect\.ts/]
        }]
    },
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 9000,
            proxy: 'http://localhost:8090'
        }, {
            reload: false
        }),
        new ExtractTextPlugin('styles.css'),
        new webpack.NoErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new writeFilePlugin()
    ]
});
