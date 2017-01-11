/**
 * WiStorm框架的基础文件，要使用框架必须引入本文件；
 * 包括了框架一些非常基础的东西，UI类的基类、基本工具等；
 */


//全局变量
window.WiStorm;
window._user;
window._g;

//执行错误直接弹出
window.onerror=function(msg,url,l){
	var flie=self.location.href.split(/[\\\/.]/);
    var flieName=flie[flie.length-2];
    url=url.split(/[\\\/.]/);
    url=url[url.length-2];
    var text="错误："+msg+";\n界面："+flieName+";\n文件："+url+";\n行数："+l;
    if((msg.indexOf("WeixinJSBridge")!=-1&&l==1)||
		(msg=="Uncaught TypeError: Cannot read property 'classList' of null"&&url=="WiStorm"&&l==1))
		return;
	if(WiStorm.debug){
		alert(text);
	}else{
		var userText=localStorage.getItem("_WiStormUserSetting_");
		var user,account;
		if(userText){
			try{
				user=JSON.parse(userText);
			}catch(e){
				//TODO handle the exception
				user={account:"解析用户信息出错"};
			}
			account=user.account||"未登录";
		}else{
			account="未登录";
		}
		var errorJson={"bug_report":text,"account":account};
		if(typeof Wapi=="object"){//如果已经加载了api文件，则直接发送错误
			Wapi.crash.add(function(res){},errorJson);
		}else{//否则存在本地，等Wapi加载完会自动发送
			var errorLog=localStorage.getItem("errorList");
			var errorList;
			if(errorLog){
				try{
					errorList=JSON.parse(errorLog);
				}catch(e){
					//TODO handle the exception
					errorList=[];
				}
			}else{
				errorList=[];
			}
			errorList.push(errorJson);
			localStorage.setItem("errorList",JSON.stringify(errorList));
		}
	}
}
window.addEventListener('load',function(){
	//处理记录在本地的错误日志
	var __errorLog=localStorage.getItem("errorList");
	var __errorList;
	if(__errorLog){
		try{
			__errorList=JSON.parse(__errorLog);
		}catch(e){
			//TODO handle the exception
			__errorList=[];
		}
		for(var __i=0;__i<__errorList.length;__i++){
			Wapi.crash.add(function(res){},__errorList[__i]);
		}
		localStorage.removeItem("errorList");
	}
});


/**
 * 微信的es6兼容
 * 因为微信的内核比较旧，所以某些方法还是需要兼容
 * babel也救不了它……
 */

if (typeof Object.assign != 'function') {
	Object.assign = function (target) {
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

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        if (i in list) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
      }
      return undefined;
    }
  });
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

/**
 * W是一个选择器，相当于jq的$，返回的是原生js对象（dom）
 * 框架封装的原生选择器，直接传递css选择字符串，默认返回第一个匹配的元素，
 * 如果需要返回全部匹配的元素需要指定第二个参数为true;
 * 返回原生的Element元素或者是所有匹配的Element组成的数组
 * @param {String} select,css选择器字符串
 * @param {Boolean} needAll,是否返回全部匹配的元素（默认只返回第一个）
 * @example
 * var tets1=W("div>a");
 * var test2=W("div>a",ture)[0];
 * @return {Element}
 */
function W(select,needAll){
	if(needAll)
		return document.querySelectorAll(select);
	else
		return document.querySelector(select);
}

/**
 * 空方法，用于需要空方法的地方，免得每次都创建
 */
W.noop = function(){};


W.debug=function(str){
	if(WiStorm.debug)
		alert(str);
};


/**
 * 日期的toString方法扩展，输出更符合普通格式的字符串
 * @param {Date} d
 */
W.dateToString=function(d){
  var j={};
  j.m=d.getMonth()+1;
  j.d=d.getDate();
  j.h=d.getHours();
  j.mi=d.getMinutes();
  j.s=d.getSeconds();
  for(items in j){
    if(j[items]<10)
      j[items]="0"+j[items];
  }
  return d.getFullYear()+"-"+j.m+"-"+j.d+" "+j.h+":"+j.mi+":"+j.s;
}

/**
 * 
 * 兼容ios的字符串转日期对象
 * @param {String} str
 */
W.date=function(str) {
    var date = new Date();
    if(!str)
    	return date;
    var t=str.split(/[T\s]/);
	if(t.length<2)
		t=(str+' 00:00:00').split(/[T\s]/);
    var str_before = t[0]; //获取年月日
    var str_after = t[1]; //获取时分秒
    var years = str_before.split('-')[0]; //分别截取得到年月日
    var months = str_before.split('-')[1] - 1;
    var days = str_before.split('-')[2];
    var hours = str_after.split(':')[0]||0;
    var mins = str_after.split(':')[1]||0;
    var seces = str_after.split(':')[2].replace("Z", "");
    var secs = seces.split('.')[0]||0;
    var smsecs = seces.split('.')[1]||0;
    if(str.indexOf("T")==-1){
    	date.setFullYear(years, months, days);
    	date.setHours(hours, mins, secs, smsecs);
    }else{
    	date.setUTCFullYear(years, months, days);
    	date.setUTCHours(hours, mins, secs, smsecs);
    }
    return date;
}

/**
 * 用于包含一个js文件到当前文件；
 * 包含时会先进行判断，是否已经包含过该文件，如果已经包含过则不处理；
 * @param {String} url  文件路径
 * @param {Function} callback 加载完成之后的回调方法
 */
W.include=function(url,callback,errorCall){
	var script=document.createElement("script");
	script.src=url;
	if(WiStorm.included.indexOf(script.src)!=-1){
		script.src=null;
		setTimeout(function(){callback(true)},0);
		return;
	}
	script.onload=callback;
	script.onabort=errorCall;
	script.onerror=errorCall;
	document.head.appendChild(script);

	//包含成功，把文件路径存储到WiStorm.included数组里
	WiStorm.included.push(script.src);
}


/**
 * 在文档加载时根据用户设置或者框架配置文件动态引入css
 * @param {String} cssName,css文件名（包含后缀）
 * @example
 * head><br>
 * title>单元测试页面 /title><br>
 * script src="wslib/WiStorm.js"> /script><br>
 * !--引入mui.css--><br>
 * script>link("mui.css")</script>
 * </head>
 */
W.link=function(cssName){
	var skinFolder=W.getSkin();
	var pathName=WiStorm.root+'skin/'+skinFolder+'/'+cssName;
	var l=document.createElement('link');
	l.href=pathName;
	l.rel="stylesheet";
	document.head.appendChild(l);
}


/**
 * 框架的ajax
 * @param {String} url
 * @param {Object} options，具体可参考http://dev.dcloud.net.cn/mui/ajax/
 */
W.ajax=function(url,options) {
	var json={
		dataType:"json",
		timeout:10000,
		type:"GET",
		success:W.noop,
		error:W.noop
	}
	var headers = {
		"X-Requested-With": "XMLHttpRequest",
		"Accept": "*/*",
		"Content-Type": "application/x-www-form-urlencoded"
	};
	json.url=url;
	Object.assign(json,options);
	Object.assign(headers,options.headers);
	
	json.type=json.type.toUpperCase();
    var data="";
    if(json.data){
	    for (items in json.data){
			data+="&"+items+"="+json.data[items];
		}
		if(json.type=="GET"){
			if(json.url.indexOf('?')==-1)
				json.url+="?"+data.slice(1);
			else
				json.url+=data;
		}
    }
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.responseType=json.dataType||'json';
	if (json.timeout>0){
		xmlhttp.timeout=json.timeout;
		xmlhttp.ontimeout=function(){
			json.error(xmlhttp,'timeout',json);
		}
	}
	
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState === 4) {
			xmlhttp.onreadystatechange = W.noop;
			if ((xmlhttp.status >= 200 && xmlhttp.status < 300) || xmlhttp.status === 304 ||xmlhttp.status === 0){
				var result = xmlhttp.response||{"status_code":-1,"err_msg":"无返回信息"};
				json.success(result, xmlhttp, json);
			} else {
				json.error(xmlhttp,xmlhttp.status ? 'error' : 'abort', json);
			}
		}
	}
	xmlhttp.open(json.type,json.url,true);
	
	for (var name in json.headers) {
		xmlhttp.setRequestHeader(name,json.headers[name]);
	}
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(data);
    
    return xmlhttp;
};

/**
 * 简化的ajax，用get方式
 * @param {String} url
 * @param {Object} data
 * @param {Function} success
 * @param {String} dataType
 */
W.get=function(url,data,success,dataType){
	var options={
		data:data,
		dataType:dataType,//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:success,
		error:function(xhr,type,errorThrown){
			console.log(type+"___url:"+url);
		}
	};
	W.ajax(url,options);
}

/**
 * 简化的ajax，用post方式
 * @param {String} url
 * @param {Object} data
 * @param {Function} success
 * @param {String} dataType
 */
W.post=function(url,data,success,dataType){
		var options={
		data:data,
		dataType:dataType,//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:success,
		error:function(xhr,type,errorThrown){
			console.log(type+"___url:"+url);
		}
	};
	W.ajax(url,options);	
}

/**
 * 简化的ajax，用get方式,返回json格式数据
 * @param {String} url
 * @param {Object} data
 * @param {Function} success
 */
W.getJSON=function(url,data,success){
	var options={
		data:data,
		dataType:"json",
		type:'get',
		timeout:10000,
		success:success,
		error:function(xhr,type,errorThrown){
			console.log(type+"___url:"+url);
		}
	};
	W.ajax(url,options);
}

/**
 * 按key返回用户设置的某个值
 * @param {String} key
 * @return {String}
 */
W.getSetting=function(key){
	return WiStorm.setting[key];
}

/**
 * 设置用户设置的值
 * @param {String} key
 * @param {Object} val
 */
W.setSetting=function(key,val){
	WiStorm.setting[key]=val;
	localStorage.setItem("_WiStormUserSetting_",JSON.stringify(WiStorm.setting));
}

/**
 * 把json从本地存储里获取出来，并转换成json对象，如果非json数据，第二个参数传true
 * @param {String} name
 * @param {Boolean} notJson
 */
W.ls=function(name,notJson){
	var r=localStorage.getItem(name);
	if(r&&r!=""){
		if(notJson){
			return r;
		}else{
			try{
				return JSON.parse(r);
			}catch(err){
				return null;
			}
		}
	}else return null;
}

/**
 * 存储json到本地存储，如果不是json对象，则第三个参数传true
 * @param {String} name
 * @param {Object} val
 * @param {Boolean} notJson
 */
W.setLS=function(name,val,notJson){
	if(notJson)
		localStorage.setItem(name,val);
	else 
		localStorage.setItem(name,JSON.stringify(val)); 
}

/**
 * 返回当前url内的search数据数组（即?后面部分）
 * @example
 * //url="www.baidu.com?w=123"
 * var test=W.getSearch();
 * alert(test.w);
 */
W.getSearch=function (){
    var url=location.search;
    if(!url)return {};
    url=url.split("?")[1].split("&");
    var json={};
    var n=url.length;
    for(var i=0;i<n;i++){
        json[url[i].split("=")[0]]=decodeURIComponent(url[i].split("=")[1]);
    }
    return json;
};

/**
 * 设置cookie，expiredays负数代表分钟，正数的单位为“天”（24小时）path为cookie的有效路径
 * @param {String} c_name
 * @param {String} value
 * @param {Number} expiredays
 * @param {String} path
 */
W.setCookie=function(c_name,value,expiredays,path){
	var exdate=new Date();
	expiredays=expiredays||1;//默认为1天
	if(expiredays>1)
		exdate.setDate(exdate.getDate()+expiredays);
	else if(expiredays>0)
		exdate.setHours(exdate.getHours()+expiredays*24);
	else 
		exdate.setMinutes(exdate.getMinutes()-expiredays);
	var domain="";
	if(path){
		domain="; path="+path+";";
	}else{
		domain="; path=/; domain="+document.domain;
	}
	var tem=c_name+"="+encodeURIComponent(value)+((expiredays==null)?"":";expires="+exdate.toGMTString())+domain;
	document.cookie=tem;
}

/**
 * 获取cookie
 * @param {String} c_name
 */
W.getCookie=function(c_name){
	if(document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name+"=");
		if (c_start!=-1){ 
		    c_start=c_start + c_name.length+1;
		    c_end=document.cookie.indexOf(";",c_start);
		    if(c_end==-1)c_end=document.cookie.length;
		    return decodeURIComponent(document.cookie.substring(c_start,c_end));
	    } 
	}
}

//重新加载用户设置
W._getSeting=function(){
	var setting=localStorage.getItem("_WiStormUserSetting_");
	try{
		if(setting)
			WiStorm.setting=JSON.parse(setting);
		else
			WiStorm.setting={};
	}catch(err){
		console.log(___.setting_echange_skinrror);
	}
	delete setting;
}

W.logout=function(param){
	W.setCookie("access_token","");
	W.setSetting("user",null);
	W.setSetting("pwd",null);
	W._login=false;
	top.location=WiStorm.root+'index.html?intent=logout'+param;
}

W.wxLogin=function(s){
	W.setCookie("access_token","");
	W.setSetting("user",null);
	var state=s||'sso_login';
	if(WiStorm.test_mode){
		var url = WiStorm.config.wx_login; //测试使用
		url = url.replace(/\?\S*/, "");
		url = W.encoded(url);
		top.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WiStorm.config.wx_app_id+"&redirect_uri=http://h5.bibibaba.cn/jump.html&response_type=code&scope=snsapi_userinfo&state="+url+"#wechat_redirect";
	}else{
		W.setCookie("__login_redirect_uri__",location.href,-15);
		var u=encodeURIComponent(WiStorm.config.wx_login);
		top.location="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WiStorm.config.wx_app_id+"&redirect_uri="+u+"&response_type=code&scope=snsapi_base&state="+state+"#wechat_redirect";
	}				
}

W.emit=function(taget,event,params,canBubble,cancelable){
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent(event, canBubble, cancelable);
	evt.params=params;
	taget.dispatchEvent(evt);
}

/**
 * 静默授权获取open_id
 * 如果想限定某页面只能在微信下打开，则可以通过指定needweixin参数为true来实现
 */
W.getOpenId=function(needweixin,s){
	if(needweixin||!WiStorm.agent.weixin)return;
	s=s||"getOpenId";
	W.setCookie("__login_redirect_uri__",location.href,-15);
	var u=encodeURIComponent(WiStorm.config.wx_login);
	top.location="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WiStorm.config.wx_app_id+"&redirect_uri="+u+"&response_type=code&scope=snsapi_base&state="+s+"#wechat_redirect";
}

/**
 * 输出api返回的错误信息
 * @param {Object} code
 */
W.errorCode=function(json){
	if(!json.status_code)return;
	W.loading?W.loading():null;
	if(json.status_code==3){
		W.confirm(___.reLogin,function(b){
			if(b){
				if(WiStorm.agent.weixin){
					W.wxLogin();
				}else{
					W.setCookie("__login_redirect_uri__",location.href,-15);
					top.location=WiStorm.root+"index.html";
				}
			}
		});
	}else{
		var er={
			'4097':'连接服务器失败',
			'8193':'查询不到有效节点',
			'36867':'查询不到有效节点',
			'36868':'无效签名',
			'36869':'方法无效',
			'36870':'无效的Appkey'
		}
		var erKey=Object.keys(er);
		
		var text=___.error[json.status_code]||___.unknown_err;
		if(erKey.indexOf(json.status_code.toString())!=-1){
			text=___.error['000'];
		}
		W.alert("error_code："+json.status_code+"；error_msg："+text);
	}
}

/**
 * 简单处理api返回错误信息
 */
W.err=function(fun){
	if(typeof fun!=='function'){
		return function(res){
			console.log(res);
			if (res.status_code) {
				W.errorCode(res);
				return;
			}
		}
	}else
		return function(res){
			if (res.status_code) {
				W.errorCode(res);
				return;
			}else
				fun(res);
		}
}

W.login=function(){
	if(_g.sso_login&&_g.access_token){//已经授权
		//登录成功
		W.setSetting("openId",_g.openid);
		W.setCookie("access_token", _g.access_token,1);
	}
}
W._loginSuccess=function(res){
	W._login = true;//表示已登录
	_user=res;
	W.setSetting("user",res);
}

W.toRegister=function(){
	W.alert("没有帐号或者未启用，请先注册",function(){
		W.setCookie("__login_redirect_uri__",location.href,-60);
		var reg=/src\/baba\/\S*\.html.*/;
		var url=location.href;
		var registerUrl="index.html?intent=register";
		if(reg.test(url)){
			registerUrl="index.html?intent=register&type=user";
		}
		top.location=WiStorm.root+registerUrl;
	});
}

W.replace=function(text,data){
	data=data||___;
	return text.replace(/(\<|&lt;)\%.*?\%(&gt;|\>)/g,function(word){
		word=word.replace(/(\<|&lt;|&gt;|\>|%)/g,'');
		return data[word]||'';
	});
}


/**
 * 5+的Ready事件封装，如果执行此方法时5+的ready事件已经触发过了，则会立即执行；
 * 其中第一个参数为要执行的方法，第二参数web是一个标志，为true时，则不管是普通浏览器环境下，还是在打包成原生应用的情况下，都会执行；
 * 如果不传web参数或者传递一个false值，则只会在原生应用下执行
 * @param {Function} fun
 * @param {Boolean} web
 */
W.plusReady=function(fun,web){
	if(web){
		if(window.plus)
			setTimeout(fun,0);
		else
			document.addEvent("plusready",fun,false);
	}else{
		if(WiStorm.isWeb)
			return;//普通浏览器下不执行下面的代码
		if(window.plus)
			setTimeout(fun,0);
		else
			document.addEvent("plusready",fun,false);
	}
}



///下面是一些进入应用则需要执行的代码，例如加载配置文件，语言文件等
//获取跳转参数 即 http://127.0.0.1:8020/baba_wx/src/customer_add.html?a=123&b=asd  问号后面部分
window._g=W.getSearch();

var	WiStorm_root="http://"+location.host+"/";
if(location.host.indexOf('localhost')==-1&&!location.host.match(/(192\.|127\.)/))
	WiStorm_root+="wo365_user/";
var u = navigator.userAgent;
var _d=false;
if(_g.debug)_d=true;
window.WiStorm={
	test_mode:false,
	debug:_d,
	config:{
		"description": "WiStorm框架的配置信息",
		"skin": "default",
		"default_language": "zh-cn",
		"update_url": WiStorm_root+"update/version.json",
		"wx_ticket_url":location.origin+"/WX.TokenAndTicket.php?action=ticket",
		"wx_sdk":"http://res.wx.qq.com/open/js/jweixin-1.0.0.js",
		"wx_login":location.origin+"/oauth2.php",
		languages:['zh-cn','en-us'],
		'map':'BAIDU',
		domain:{
			'wx':'wx.autogps.cn',
			'user':'user.autogps.cn',
			'wo':'w.wo365.net',
			'wowx':'wx.wo365.net'
		}
	},
	setting:{},//用户设置，由W.getSetting(name)和W.setSetting(key,val)操作
	included:[],//当前页面使用include(url)来包含的文件名
	root:"",//app根目录的绝对路径（即www目录的绝对路径）
	agent:{
	    trident: u.indexOf('Trident') > -1, //IE内核
	    presto: u.indexOf('Presto') > -1, //opera内核
	    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
	    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
	    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
	    iPad: u.indexOf('iPad') > -1, //是否iPad
	    weixin: u.indexOf('MicroMessenger') > -1, //是否微信
	    qq: u.match(/\sQQ/i) == " qq" //是否QQ
	}
};//包含框架相关
u=undefined;
_d=undefined;


	


//根据页面路径获取绝对路径
var tem=location.href;
var s=tem.search("/www/")+5;
WiStorm.root=tem.slice(0,s);
if(location.protocol=="http:"||location.protocol=="https:"){//浏览器环境
	WiStorm.root=WiStorm_root;
	WiStorm.isWeb=true;
}
tem=undefined;
s=undefined;

//获取cookie中的app信息
var keys=W.getCookie('_app_config_');
try {
	keys=JSON.parse(keys);
	Object.assign(WiStorm.config,keys);
	WiStorm.config.wx_app_id=keys.wxAppKey;
} catch (error) {
	if(_g.intent!='logout'){
		var loc=encodeURIComponent((location.origin+location.pathname).replace(WiStorm.root,''));
		loc=(loc=='index.html')?'':'&location='+loc;
		location=location.origin+(location.search||'?')+loc;
	}
}
keys=undefined;
if(_g.wx_app_id){
	WiStorm.config.wx_app_id=_g.wx_app_id;
	WiStorm.config.wx_login=WiStorm.config.wx_login+'?wx_app_id='+WiStorm.config.wx_app_id;	
}

/**
 * 获取本地用户存储
 * 在微信中每隔24小时会清理一次，所以基本上只能得到本次登录之后存储的数据
 */
W._getSeting();
window._user=W.getSetting("user");

if(_user&&W.getCookie("access_token")){
	_user.access_token=W.getCookie("access_token");
	W._login=true;
}else 
	W._login=false;

//处理用户登录
if(_g.needUser&&!_g.openid){
	W.wxLogin();
}else if(_g.needOpenId=="true"){
	if(!_g.openid){
		W.getOpenId();
	}
}
if(!W._login&&location.pathname.indexOf("index.html")<0&&_g.intent!="logout"){
	if(WiStorm.agent.weixin){
		if(_g.sso_login){
			window.addEventListener("load",W.login);
		}else{
			W.wxLogin();
		}
	}else{
		W.setCookie("__login_redirect_uri__",location.href,-15);
		top.location=WiStorm.root+"index.html";
	}
}else if(W._login){
	window.addEventListener("load",function(){
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("W.loginSuccess", false, false);//当页面load事件触发并且已经登录成功则会触发该事件,用于某些需要不经过登录页也可以直接访问，但是又需要用户授权登录的页面
		window.dispatchEvent(evt);
	});
}

//获取语言资源
var l=navigator.language.toLowerCase();
if(WiStorm.config.languages.indexOf(l)==-1)
	l=WiStorm.config.default_language;
var url=WiStorm.root+"language/"+l+".js";
document.write('<script src="'+url+'"></script>');
l=undefined;
url=undefined;