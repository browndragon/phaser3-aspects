'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js',
        gameobjects: './src/gameobjects/debugScene.js',
        lStarter: './src/levels/starter/debugScene.js'
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
        filename: '[name].bundle.js'
    },

    plugins: [
        new webpack.DefinePlugin({
            WEBGL_RENDERER: true,
            CANVAS_RENDERER: true
        }),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
    },
};
