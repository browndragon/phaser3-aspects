'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: {
        example: './src/Example.js',
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
    resolve: {
        alias: {
            // Standin for actually importing the aspects library. In your code, just do an npm dependency.
            'phaser3-aspects': path.resolve(__dirname, '../'),
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            WEBGL_RENDERER: true,
            CANVAS_RENDERER: true
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: false,
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
    },
};