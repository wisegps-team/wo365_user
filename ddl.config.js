const webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

const vendors = [
    'react',
    'react-dom',
    'react-tap-event-plugin',
    'redux',
    'material-ui',
    'babel-polyfill'
];

module.exports = {
    output: {
        path: 'build/vendor',
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
        commonsPlugin,//智能提取公共模块插件
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,  // remove all comments
            },
            compress: {
                warnings: false,
                drop_console:true,//去掉console.*一切代码
                drop_debugger:true,//去掉debugger
                // conditionals:true, //使用表达式代替if语句
                // evaluate:true, //常量表达式求值，如a>5*4转换成a>20
            },
        }),
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        }),
    ],
};