'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js',
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: [/\.vert$/, /\.frag$/], use: 'raw-loader' },
            {
                test: /\.(gif|png|jpe?g|svg|xml|csv)$/i,
                use: 'file-loader'
            },
            { test: /\.(json)$/i, use: 'file-loader', type: 'javascript/auto'},
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        library: 'phaser3-aspects',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    plugins: [
        new webpack.DefinePlugin({
            WEBGL_RENDERER: true,
            CANVAS_RENDERER: true
        }),
    ],
};
