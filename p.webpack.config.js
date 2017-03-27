var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var fs = require('fs');

//递归获取path下的所有文件
function getAllFile(path,entry_json){
    fs.readdirSync(__dirname+path).reduce(function (entries, dir) {
        if(dir[0]!='_'){
            if (!fs.statSync(__dirname+path+'/'+dir).isDirectory()){
                entries[path+'/'+dir] = ('.'+path+'/'+dir);
            }else
                getAllFile(path+'/'+dir,entries);
        }
        return entries
    },entry_json);
}
var entry_json={};
getAllFile('/src',entry_json);
entry_json['common.js']=['react','react-dom','react-tap-event-plugin','redux','./src/_reducers/main.js','./src/_theme/default.js','./src/_modules/Wapi'];
console.log(entry_json);

module.exports = {
    //插件项
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
                // warnings: false,
                drop_console:true,//去掉console.*一切代码
                // drop_debugger:true,//去掉debugger
                // conditionals:true, //使用表达式代替if语句
                // evaluate:true, //常量表达式求值，如a>5*4转换成a>20
            },
        })
    ],
    //页面入口文件配置
    entry: entry_json,
    //入口文件输出配置
    output: {
        path: './build',
        filename: '[name]'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.jsx$/, loader: 'babel-loader!jsx-loader?harmony' },
            { 
                test: /\.js$/, 
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    
    //其它解决方案配置
    resolve: {

    }
};