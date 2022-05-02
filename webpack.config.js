const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: 'index.js',
    output: {
    path: __dirname + './src',
    filename: './main.js'
},
    plugins: [
    new HtmlWebpackPlugin()
    ]
}