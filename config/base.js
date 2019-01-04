const path = require('path');
// const htmlPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('mini-css-extract-plugin'); // 将css输出为独立文件

const outputPath = path.resolve(__dirname, '../dist');

module.exports = {
    output: {
        path: outputPath,
        filename: '[name].min.js',
        chunkFilename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/env", "@babel/react"
                        ],
                        plugins: [
                            '@babel/plugin-proposal-function-bind',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-export-default-from'
                        ]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(css|less)$/,
                use: [
                    // {
                    //     loader: ExtractTextPlugin.loader,
                    //     options: {
                    //         publicPath: outputPath + '/dist/css'
                    //     }
                    // },
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'less-loader'}
                ]
            },
            {
                test: /\.(png|jpe?g|gif)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'dist/images/[name].[ext]',
                            publicPath: outputPath
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // new ExtractTextPlugin({
        //     filename: "dist/css/[name].css",
        //     chunkFilename: "dist/css/[id].css"
        // })
    ]
};
