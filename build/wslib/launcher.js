//模块启动器
"use strict";
(function(){
    var sty=document.createElement('style');
    sty.innerHTML='body{overflow-x:hidden;padding:0;margin:0;box-sizing:border-box;font-family:微软雅黑}#W-LAUNCHER{min-height:100vh}#W-LAUNCHER>div{display:none;width:100vw;overflow-x:hidden;min-height:100vh;top:0;left:0;background:#fff;animation-fill-mode:forwards;-webkit-animation-fill-mode:forwards}#W-LAUNCHER>.active{display:block}#W-LAUNCHER>.enter{//前进的时候的进入动画 display:block;position:fixed;animation:fromRight .5s;-webkit-animation:fromRight .5s}#W-LAUNCHER>.enter.back{//返回的时候的进入动画 animation:fromLeft .5s;-webkit-animation:fromLeft .5s}#W-LAUNCHER>.leave{//前进的时候的离开动画 display:block;position:fixed;animation:toLeft .5s;-webkit-animation:toLeft .5s}#W-LAUNCHER>.leave.back{//返回的时候的离开动画 animation:toRight .5s;-webkit-animation:toRight .5s}@keyframes fromRight{from{transform:translate3d(100%,0,0);opacity:.5}to{transform:translate3d(0,0,0);opacity:1}}@-webkit-keyframes fromRight{from{-webkit-transform:translate3d(100%,0,0);opacity:.5}to{-webkit-transform:translate3d(0,0,0);opacity:1}}@keyframes fromLeft{from{transform:translate3d(-100%,0,0);opacity:.5}to{transform:translate3d(0,0,0);opacity:1}}@-webkit-keyframes fromLeft{from{-webkit-transform:translate3d(-100%,0,0);opacity:.5}to{-webkit-transform:translate3d(0,0,0);opacity:1}}@keyframes toLeft{from{transform:translate3d(0,0,0);opacity:1}to{transform:translate3d(-100%,0,0);opacity:.5}}@-webkit-keyframes toLeft{from{-webkit-transform:translate3d(0,0,0);opacity:1}to{-webkit-transform:translate3d(-100%,0,0);opacity:.5}}@keyframes toRight{from{transform:translate3d(0,0,0);opacity:1}to{transform:translate3d(100%,0,0);opacity:.5}}@-webkit-keyframes toRight{from{-webkit-transform:translate3d(0,0,0);opacity:1}to{-webkit-transform:translate3d(100%,0,0);opacity:.5}}.loader{width:80px;height:80px;border-radius:50%;perspective:800px;-webkit-perspective:800px;color:#00bcd4;margin:5vw auto;transition:color .5s;-webkit-transition:color .5s;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0}.loader>span{text-align:center;position:absolute;width:100%;bottom:-2em;text-shadow:1px 1px 3px rgba(0,0,0,.1)}.loader>div{position:absolute;box-sizing:border-box;width:100%;height:100%;border-radius:50%;border-width:3px;animation-duration:1s;-webkit-animation-duration:1s;animation-iteration-count:infinite;-webkit-animation-iteration-count:infinite;animation-timing-function:linear;-webkit-animation-timing-function:linear}.loader>div:nth-child(1){left:0;top:0;animation-name:rotate-one;-webkit-animation-name:rotate-one;border-bottom-style:solid}.loader>div:nth-child(2){right:0;top:0;animation-name:rotate-two;-webkit-animation-name:rotate-two;border-right-style:solid}.loader>div:nth-child(3){right:0;bottom:0;animation-name:rotate-three;-webkit-animation-name:rotate-three;border-top-style:solid}@keyframes rotate-one{0%{transform:rotateX(35deg) rotateY(-45deg) rotateZ(0)}to{transform:rotateX(35deg) rotateY(-45deg) rotateZ(360deg)}}@keyframes rotate-two{0%{transform:rotateX(50deg) rotateY(10deg) rotateZ(0)}to{transform:rotateX(50deg) rotateY(10deg) rotateZ(360deg)}}@keyframes rotate-three{0%{transform:rotateX(35deg) rotateY(55deg) rotateZ(0)}to{transform:rotateX(35deg) rotateY(55deg) rotateZ(360deg)}}@-webkit-keyframes rotate-one{0%{-webkit-transform:rotateX(35deg) rotateY(-45deg) rotateZ(0)}to{-webkit-transform:rotateX(35deg) rotateY(-45deg) rotateZ(360deg)}}@-webkit-keyframes rotate-two{0%{-webkit-transform:rotateX(50deg) rotateY(10deg) rotateZ(0)}to{-webkit-transform:rotateX(50deg) rotateY(10deg) rotateZ(360deg)}}@-webkit-keyframes rotate-three{0%{-webkit-transform:rotateX(35deg) rotateY(55deg) rotateZ(0)}to{-webkit-transform:rotateX(35deg) rotateY(55deg) rotateZ(360deg)}}';
    document.head.appendChild(sty);
    sty=undefined;

/**
 * es6的某些兼容代码
 */
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

/**
 * 框架的全局变量全部放这里
 * 之后所有模块都可以不引用直接使用这些变量了
 */
window.LAUNCHER={   //应用模块的启动器对象
    historyList:[],//用户在整个应用生命周期的历史记录
    historyIndex:0,//用户当前处于历史记录的哪个位置
    moduleList:[],//加载过的模块，除非是模块过多出于内存管理把view卸载了，内存管理待定怎么做
    getView:function(e){//获取当前模块的载体，只在加载时执行有效
        return document.currentScript.view.dom;
    }
};


/**
 * 当前状态
 */
var STATE={
    views: {},
    this_one: false,
    last_one: false,
    moduleList:[]
};
var APP;

/**
 * 跳转到指定模块
 */
function goTo(url,params){
    var locat=url;
    if(url.indexOf('.')!=-1){
        var e=/https*:\/\/[^/]+/;
        var start=url.match(e)[0];
        url=url.replace(e,'');
        url=start+url.replace(/\.[^?#]+/,'.js');//把后缀名改为js
    }
    var target=STATE.views[url];
    if(!target){//如果是一个新的模块，创建新的view
        target=createView(url,1,STATE.this_one.data.url);
    }else if(target==STATE.this_one){//如果是当前模块
        return false;
    }
    if(typeof params!=='undefined'&&(typeof params=='function'||typeof params=='object')){
        params=JSON.parse(JSON.stringify(params));
    }
    target.params=params;
    showView(url,false);
    setHistory(locat,url); 
}

/**
 * 显示某个view
 */
function showView(url,back){
    var t;
    if(!STATE.this_one){//首次
        window.history.replaceState(url,'id',location.href); 
        t=createView(url,1);
    }else
        t=STATE.views[url];
    if(t){
        if(t==STATE.this_one)return;//如果就是当前显示的view
        STATE.last_one=STATE.this_one;
        STATE.this_one=t;

        STATE.this_one.show((!config.animation||!back),back);   
        if(STATE.last_one)STATE.last_one.hide((!config.animation||back),back);
    }else{
        throw '模块未加载 url:'+url;
    }
}
/**
 * 出入动画执行完毕，去隐藏上一个view，触发对应的hide事件和show事件
 */
function animationEnd(){
    if(STATE.last_one){
        STATE.last_one.static();
        STATE.last_one.emitDom('hide');
    }
    STATE.this_one.static();
    document.body.scrollTop=STATE.this_one._scrollTop;
    if(STATE.this_one.state>=3){
        var D={
            params:STATE.this_one.params,
            caller:STATE.last_one?STATE.last_one.data.url:null
        }
        delete STATE.this_one.params;
        STATE.this_one.emitDom('show',D);
    }else
        STATE.this_one.emitDom('show');
}

/**
 * 设置历史记录
 */
function setHistory(url,state){//设置历史记录
    url=url.replace(/\.js[^?#]*/,'');//去掉js后缀名，如果有
    window.history.pushState(state,'id',url);                    
    window.LAUNCHER.historyList=window.LAUNCHER.historyList.slice(0,window.LAUNCHER.historyIndex+1);
    window.LAUNCHER.historyList.push(state);     
    window.LAUNCHER.historyIndex=window.LAUNCHER.historyList.length-1;  
    if(window.LAUNCHER.historyIndex<0)window.LAUNCHER.historyIndex=0;       
};

/**
 * 创建一个模块（页面）
 * url 模块的绝对路径
 * mode 创建模式 
 *              0: 创建一个view，不加载js，不渲染
 *              1：创建完不显示，会加载js，但不渲染（预加载）
 *              2：创建完不显示，但会加载js并渲染组件（预渲染）；
 *              3：创建子view，并不加载外部js，此时传递的url应该是一个id，这个view不会有load事件，但是有其他的事件
 * creater 创建者，创建该模块的模块url
 */
function createView(url,mode,creater){//创建一个view
    var div=document.createElement('div');
    var vi=new view(div,url,mode,creater);
    APP.appendChild(div);
    STATE.views[url]=vi;
    return vi;
}

/**
 * 预加载或者预渲染
 * @param {String} url 要加载的模块绝对地址
 * @param {Int} mode 加载模式 
 *                  0: 如果不传或者为false，则只是创建一个view
 *                  1：创建完不显示，会加载js，但不渲染（预加载）
 *                  2：创建完不显示，但会加载js并渲染组件（预渲染）；
 *                  3：创建子view，并不加载外部js，此时传递的url应该是一个id，这个view不会有load事件，但是有其他的事件
 * @param {any} params 可选，加载时传递的参数
 * @param {String} creater 创建者url
 */
function prefetch(url,mode,params,creater){
    if(!STATE.views[url]){//如果是一个新的模块，创建新的view
        if(typeof params!=='undefined'&&(typeof params=='function'||typeof params=='object')){
            params=JSON.parse(JSON.stringify(params));
        }
        var vi=createView(url,mode,creater);
        vi.params=params;
        return vi.dom;
    }else
        return false;
}



//事件触发者
function EventEmitter() {
    this.events = {};
}
//绑定事件函数
EventEmitter.prototype.on = function(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
    return (this.events[eventName].length-1);
};
//触发事件函数
EventEmitter.prototype.emit = function(eventName, _) {
    var events = this.events[eventName],
        args = Array.prototype.slice.call(arguments, 1),
        i, m;

    if (!events) {
        return;
    }
    for (i = 0, m = events.length; i < m; i++) {
        events[i].apply(this, args);
    }
};
//移除事件监听,第二参数可以是function对象，也可以是on方法所返回的整数
EventEmitter.prototype.off=function(eventName, callback){
    var events=this.events[eventName];
    if (!events) {
        return;
    }
    if(typeof callback=='function')
        for(var i=0;i<events.length;i++){
            if(events[i]==callback){
                events.splice(i,1);
                return;
            }
        }
    else
        events.splice(callback,1);
}

/**
 * mode
 * 0: 如果不传或者为false，则只是创建一个view
 * 1：创建完不显示，会加载js，但不渲染（预加载）
 * 2：创建完不显示，但会加载js并渲染组件（预渲染）；
 * 3：创建子view，并不加载外部js，此时传递的url应该是一个id，这个view不会有load事件，但是有其他的事件
 */
function view(dom,url,mode,creater){
    EventEmitter.call(this);//继承属性
    this.dom=dom;
    this.data={
        'url':url,
        'mode':mode
    };
    this.creater=creater;
    this.state=0;
    this.show_state=0;
    if(mode){//模式0动画结束才加载js
        this.loadScript();
    }
    dom.id=view.getViewId(url);
    dom.innerHTML=config.loading?config.loading:'';
    this.onDom('animationend',view.animationend);
    this.onDom('webkitAnimationEnd',view.animationend);

    for(var key in divFunction){
        dom[key]=divFunction[key].bind(this);
    }
}
view.prototype=new EventEmitter();//继承方法

//加载自身的js文件
view.prototype.loadScript=function(){
    if(this.state||this.data.mode==3)return;
    var that=this;
    if(this.data.mode==2)
       this.on('scriptLoaded',view.loaded);

    var script=document.createElement('script');
    script.view=this;
    script.onload=function(){
        that.state=2;
        that.emit('scriptLoaded');
        delete this.view;
    };
    script.onabort=view.scriptError;
	script.onerror=view.scriptError;
    script.async=true;
    document.head.appendChild(script);
    script.src=this.data.url;
    STATE.moduleList.push(script.src);
    window.LAUNCHER.moduleList=STATE.moduleList.concat();

    this.state=1;
}

//触发一个view的load事件，模块监听到这个事件后开始加载自己
view.prototype.loaded=function(){
    if(this.state>=3)return;
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("load", false, false);
    evt.params=this.params;
    delete this.params;
    this.state=3;
    this.dom.dispatchEvent(evt);
}

//触发一个除了load的任意事件
view.prototype.emitDom=function(type,data){
    if(type=='load')return;
    var evt = document.createEvent("HTMLEvents");
    if(typeof data!='undefined')
        Object.assign(evt,data);
    evt.initEvent(type, false, false);
    this.dom.dispatchEvent(evt);
}

//展示
view.prototype.show=function(animation,back){
    var cla='active';
    if(animation){
        cla+=' enter';
        if(back)cla+=' back';
    }
    this.dom.className=cla;
    this.show_state=1;
}

//隐藏
view.prototype.hide=function(animation,back){
    var cla='active';
    if(animation){
        cla+=' leave';
        if(back)cla+=' back';
    }
    this._scrollTop=document.body.scrollTop;
    this.dom.className=cla;
    this.show_state=0;
}
/**
 * 根据展示状态去掉动画类
 */
view.prototype.static=function(){
    if(this.show_state){
        this.dom.className='active';
    }else{
        this.dom.className='';
    }
}

view.prototype.onDom=function(type,callback,useCapture){
    var that=this;
    var _type='dom-'+type;
    this.dom.addEventListener(type,function(){
        that.emit(_type);
    },useCapture);
    this.on(_type,callback);
}

//view的静态方法

/**
 * 模块加载出错，加载中断或者加载不了
 */
view.scriptError=function(e){
    var v=this.view;
    delete this.view;
    //清除脚本元素和view元素
    if(!v.data.mode){
        history.back();    
    }
    STATE.moduleList.splice(STATE.moduleList.indexOf(v.data.url),1);
    window.LAUNCHER.moduleList=STATE.moduleList.map(function(mod){return mod;});
    this.parentElement.removeChild(this);
    setTimeout(function(){
        v.dom.parentElement.removeChild(v.dom);
    },500);
}

/**
 * 处理view显示或者消失的动画结束事件
 */
view.animationend= function () {
    if(event.target!==this.dom)return;//避免子节点事件冒泡误触发
    var that=this;
    switch(this.state){
        case(0)://还没有加载js，便正常加载
            this.loadScript();
            break;
        case(1)://正在加载js，还没加载完，区分加载模式进行处理
            if(this.data.mode==1)
                this.on('scriptLoaded',view.loaded);
            break;
        case(2)://已经加载完js，还没触发loaded，则触发loaded
            this.loaded();
            break;
    }
    if((!config.animation&&this.show_state)||config.animation)
        animationEnd();
};
/**
 * 触发view的load事件
 */
view.loaded= function (){
    this.loaded();
};

/**
 * 获取div的id
 */
view.getViewId= function(url){
    var id;
    if(config.src!='/'){
        id=url.slice(url.indexOf('/'+config.src+'/')+(config.src.length+2));
    }else{
        id=url.replace(location.origin,'').slice(1);
    }
    id=id.split('.')[0];
    id=id.replace(/\//g,'0');
    return id;
}

/**
 * 相对地址转绝对地址
 */
view.getPath=function(url,href){//相对地址转换为绝对地址
    if(!href){
        var a=document.createElement('a');
        a.href=url;//转换为绝对路径
        return a.href; 
    }
    if(/https*:\/\/.+/.test(url))return url;
    var start='',end='';
    var en=url.search(/[#?]/);
    href=href.replace(/\#.*/,'');//把hash先删除掉
    if(en!=-1){
        if(en==0){
            if(url[0]=='?')return (href.replace(/\?.*/,'')+url);
            if(url[0]=='#')return (href+url);
        }
        end=url.slice(en);
        url=url.slice(0,en);
    }
    var com=url.split('/');
    var e=/https*:\/\/[^/]+/;
    start=href.match(e)[0];
    href=href.replace(e,'');
    
    var path=href.split('/');
    path.pop();
    var res=(com[0]=='')?[]:path.concat([]);
    for(var i=0;i<com.length;i++){
        if(com[i]=='..'){
            res.pop();
        }else if(com[i]!='.'){
            res.push(com[i]);
        }
    }
    return start+res.join('/')+end;
}


/**
 * 以下是直接附在div元素上的方法，开放给模块内部使用的
 */
var divFunction={
    goTo:function(url,params){//跳转其他模块
        if(this.show_state){
            url=view.getPath(url,this.data.url);
            goTo(url,params);
            return true;
        }else{
            return false;
        }
    },
    postMessage:function(url,data){//给对应模块发送消息
        if(typeof data=='object'||typeof data=='function'){
            data=JSON.parse(JSON.stringify(data));
        }
        var vi=STATE.views[view.getPath(url,this.data.url)];
        if(!vi)return false;
        var D={
            'from':this.data.url,
            'data':data
        }
        vi.emitDom('message',D);
        return true;
    },
    moduleExist:function(url){//检测模块是否已存在
        if(STATE.views[view.getPath(url,this.data.url)])
            return true;
        else
            return false;
    },
    isShow:function(){//检测当前模块是否显示
        return this.show_state;
    },
    prefetch:function(url,mode,params){//预加载一个其他模块
        url=view.getPath(url,this.data.url);
        return prefetch(url,mode,params,this.data.url);
    },
    getCreater:function(){//获取当前模块的创建者url
        return this.creater;
    }
};




window.addEventListener('load',function(){
    APP=document.createElement('div');
    APP.id='W-LAUNCHER';
    document.body.appendChild(APP);
    showView(view.getPath(config.defaultModule));
});
window.addEventListener('popstate',function(e){
    var name=e.state;//跳转之后的地址
    var i=window.LAUNCHER.moduleList.indexOf(name);
    //判断这个地址是不是一个模块地址
    if(i!=-1){
        if(!i||window.LAUNCHER.historyList[window.LAUNCHER.historyIndex-1]==name){
            //后退
            window.LAUNCHER.historyIndex--;
            showView(name,true);
        }else{
            window.LAUNCHER.historyIndex++;
            showView(name);
        }
    }
});




})();