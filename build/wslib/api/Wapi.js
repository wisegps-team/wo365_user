var Wapi={};Wapi.encrypt={};Wapi.encrypt.hexcase=0;Wapi.encrypt.b64pad="";Wapi.encrypt.chrsz=8;Wapi.encrypt.hex_md5=function(s){return Wapi.encrypt.binl2hex(Wapi.encrypt.core_md5(Wapi.encrypt.str2binl(s),s.length*Wapi.encrypt.chrsz))};Wapi.encrypt.b64_md5=function(s){return Wapi.encrypt.binl2b64(Wapi.encrypt.core_md5(Wapi.encrypt.str2binl(s),s.length*Wapi.encrypt.chrsz))};Wapi.encrypt.str_md5=function(s){return Wapi.encrypt.binl2str(Wapi.encrypt.core_md5(Wapi.encrypt.str2binl(s),s.length*Wapi.encrypt.chrsz))};Wapi.encrypt.hex_hmac_md5=function(key,data){return Wapi.encrypt.binl2hex(Wapi.encrypt.core_hmac_md5(key,data))};Wapi.encrypt.b64_hmac_md5=function(key,data){return Wapi.encrypt.binl2b64(Wapi.encrypt.core_hmac_md5(key,data))};Wapi.encrypt.str_hmac_md5=function(key,data){return Wapi.encrypt.binl2str(Wapi.encrypt.core_hmac_md5(key,data))};Wapi.encrypt.core_md5=function(x,len){x[len>>5]|=128<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=Wapi.encrypt.md5_ff(a,b,c,d,x[i+0],7,-680876936);d=Wapi.encrypt.md5_ff(d,a,b,c,x[i+1],12,-389564586);c=Wapi.encrypt.md5_ff(c,d,a,b,x[i+2],17,606105819);b=Wapi.encrypt.md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=Wapi.encrypt.md5_ff(a,b,c,d,x[i+4],7,-176418897);d=Wapi.encrypt.md5_ff(d,a,b,c,x[i+5],12,1200080426);c=Wapi.encrypt.md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=Wapi.encrypt.md5_ff(b,c,d,a,x[i+7],22,-45705983);a=Wapi.encrypt.md5_ff(a,b,c,d,x[i+8],7,1770035416);d=Wapi.encrypt.md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=Wapi.encrypt.md5_ff(c,d,a,b,x[i+10],17,-42063);b=Wapi.encrypt.md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=Wapi.encrypt.md5_ff(a,b,c,d,x[i+12],7,1804603682);d=Wapi.encrypt.md5_ff(d,a,b,c,x[i+13],12,-40341101);c=Wapi.encrypt.md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=Wapi.encrypt.md5_ff(b,c,d,a,x[i+15],22,1236535329);a=Wapi.encrypt.md5_gg(a,b,c,d,x[i+1],5,-165796510);d=Wapi.encrypt.md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=Wapi.encrypt.md5_gg(c,d,a,b,x[i+11],14,643717713);b=Wapi.encrypt.md5_gg(b,c,d,a,x[i+0],20,-373897302);a=Wapi.encrypt.md5_gg(a,b,c,d,x[i+5],5,-701558691);d=Wapi.encrypt.md5_gg(d,a,b,c,x[i+10],9,38016083);c=Wapi.encrypt.md5_gg(c,d,a,b,x[i+15],14,-660478335);b=Wapi.encrypt.md5_gg(b,c,d,a,x[i+4],20,-405537848);a=Wapi.encrypt.md5_gg(a,b,c,d,x[i+9],5,568446438);d=Wapi.encrypt.md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=Wapi.encrypt.md5_gg(c,d,a,b,x[i+3],14,-187363961);b=Wapi.encrypt.md5_gg(b,c,d,a,x[i+8],20,1163531501);a=Wapi.encrypt.md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=Wapi.encrypt.md5_gg(d,a,b,c,x[i+2],9,-51403784);c=Wapi.encrypt.md5_gg(c,d,a,b,x[i+7],14,1735328473);b=Wapi.encrypt.md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=Wapi.encrypt.md5_hh(a,b,c,d,x[i+5],4,-378558);d=Wapi.encrypt.md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=Wapi.encrypt.md5_hh(c,d,a,b,x[i+11],16,1839030562);b=Wapi.encrypt.md5_hh(b,c,d,a,x[i+14],23,-35309556);a=Wapi.encrypt.md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=Wapi.encrypt.md5_hh(d,a,b,c,x[i+4],11,1272893353);c=Wapi.encrypt.md5_hh(c,d,a,b,x[i+7],16,-155497632);b=Wapi.encrypt.md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=Wapi.encrypt.md5_hh(a,b,c,d,x[i+13],4,681279174);d=Wapi.encrypt.md5_hh(d,a,b,c,x[i+0],11,-358537222);c=Wapi.encrypt.md5_hh(c,d,a,b,x[i+3],16,-722521979);b=Wapi.encrypt.md5_hh(b,c,d,a,x[i+6],23,76029189);a=Wapi.encrypt.md5_hh(a,b,c,d,x[i+9],4,-640364487);d=Wapi.encrypt.md5_hh(d,a,b,c,x[i+12],11,-421815835);c=Wapi.encrypt.md5_hh(c,d,a,b,x[i+15],16,530742520);b=Wapi.encrypt.md5_hh(b,c,d,a,x[i+2],23,-995338651);a=Wapi.encrypt.md5_ii(a,b,c,d,x[i+0],6,-198630844);d=Wapi.encrypt.md5_ii(d,a,b,c,x[i+7],10,1126891415);c=Wapi.encrypt.md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=Wapi.encrypt.md5_ii(b,c,d,a,x[i+5],21,-57434055);a=Wapi.encrypt.md5_ii(a,b,c,d,x[i+12],6,1700485571);d=Wapi.encrypt.md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=Wapi.encrypt.md5_ii(c,d,a,b,x[i+10],15,-1051523);b=Wapi.encrypt.md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=Wapi.encrypt.md5_ii(a,b,c,d,x[i+8],6,1873313359);d=Wapi.encrypt.md5_ii(d,a,b,c,x[i+15],10,-30611744);c=Wapi.encrypt.md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=Wapi.encrypt.md5_ii(b,c,d,a,x[i+13],21,1309151649);a=Wapi.encrypt.md5_ii(a,b,c,d,x[i+4],6,-145523070);d=Wapi.encrypt.md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=Wapi.encrypt.md5_ii(c,d,a,b,x[i+2],15,718787259);b=Wapi.encrypt.md5_ii(b,c,d,a,x[i+9],21,-343485551);a=Wapi.encrypt.safe_add(a,olda);b=Wapi.encrypt.safe_add(b,oldb);c=Wapi.encrypt.safe_add(c,oldc);d=Wapi.encrypt.safe_add(d,oldd)}return Array(a,b,c,d)};Wapi.encrypt.md5_cmn=function(q,a,b,x,s,t){return Wapi.encrypt.safe_add(Wapi.encrypt.bit_rol(Wapi.encrypt.safe_add(Wapi.encrypt.safe_add(a,q),Wapi.encrypt.safe_add(x,t)),s),b)};Wapi.encrypt.md5_ff=function(a,b,c,d,x,s,t){return Wapi.encrypt.md5_cmn((b&c)|((~b)&d),a,b,x,s,t)};Wapi.encrypt.md5_gg=function(a,b,c,d,x,s,t){return Wapi.encrypt.md5_cmn((b&d)|(c&(~d)),a,b,x,s,t)};Wapi.encrypt.md5_hh=function(a,b,c,d,x,s,t){return Wapi.encrypt.md5_cmn(b^c^d,a,b,x,s,t)};Wapi.encrypt.md5_ii=function(a,b,c,d,x,s,t){return Wapi.encrypt.md5_cmn(c^(b|(~d)),a,b,x,s,t)};Wapi.encrypt.core_hmac_md5=function(key,data){var bkey=Wapi.encrypt.str2binl(key);if(bkey.length>16){bkey=Wapi.encrypt.core_md5(bkey,key.length*Wapi.encrypt.chrsz)}var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^909522486;opad[i]=bkey[i]^1549556828}var hash=Wapi.encrypt.core_md5(ipad.concat(Wapi.encrypt.str2binl(data)),512+data.length*Wapi.encrypt.chrsz);return Wapi.encrypt.core_md5(opad.concat(hash),512+128)};Wapi.encrypt.safe_add=function(x,y){var lsw=(x&65535)+(y&65535);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&65535)};Wapi.encrypt.bit_rol=function(num,cnt){return(num<<cnt)|(num>>>(32-cnt))};Wapi.encrypt.str2binl=function(str){var bin=Array();var mask=(1<<Wapi.encrypt.chrsz)-1;for(var i=0;i<str.length*Wapi.encrypt.chrsz;i+=Wapi.encrypt.chrsz){bin[i>>5]|=(str.charCodeAt(i/Wapi.encrypt.chrsz)&mask)<<(i%32)}return bin};Wapi.encrypt.binl2str=function(bin){var str="";var mask=(1<<Wapi.encrypt.chrsz)-1;for(var i=0;i<bin.length*32;i+=Wapi.encrypt.chrsz){str+=String.fromCharCode((bin[i>>5]>>>(i%32))&mask)}return str};Wapi.encrypt.binl2hex=function(binarray){var hex_tab=Wapi.encrypt.hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++){str+=hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&15)+hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&15)}return str};Wapi.encrypt.binl2b64=function(binarray){var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3){var triplet=(((binarray[i>>2]>>8*(i%4))&255)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&255)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&255);for(var j=0;j<4;j++){if(i*8+j*6>binarray.length*32){str+=Wapi.encrypt.b64pad}else{str+=tab.charAt((triplet>>6*(3-j))&63)}}}return str};
/**
 * 框架的api基类，所有api类都继承此类
 * @constructor
 */
function WiStormAPI(){
	this.url="http://o.bibibaba.cn/router/rest";
	this.safetyUrl="http://h5.bibibaba.cn/baba/wx/wslib/api/safetyWapi.php";
	this.appKey=WiStorm.config.app_key;
	this.appSecret=WiStorm.config.app_secret;
	this.access_token=_user?_user.access_token:'';
	this.encrypt=Wapi.encrypt;
	this.apiName="wicare";
};

/**
 * get方法的接口调用
 * @param {Object} data
 * @param {Object} callback
 * @param {Object} op
 */
WiStormAPI.prototype.getApi=function(data,callback,op){
	var D={
		format: 'json',   //返回数据格式
	    v: '1.0',         //接口版本
	    sign_method: 'md5'//签名方式
	}
	D.timestamp=W.dateToString(new Date());
	D.app_key=this.appKey;
	this.jsonConcat(D,data);
	this.jsonConcat(D,op);

	var url=this.makeUrl(D);
	var ajaxSetting={
		dataType:D.format,//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:callback,
		error:function(xhr,type,errorThrown){//异常处理；
			throw ("apiError:"+type);
		}
	}
	this.ajax(url,ajaxSetting);
}

WiStormAPI.prototype.postApi=function(getData,callback,data){
	var D={
		format: 'json',   //返回数据格式
	    v: '1.0',         //接口版本
	    sign_method: 'md5'//签名方式
	}
	D.timestamp=W.dateToString(new Date());
	D.app_key=this.appKey;
	this.jsonConcat(D,getData);

	var url=this.makeUrl(D);
	var ajaxSetting={
		data:data,
		dataType:D.format,//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:callback(res),
		error:function(xhr,type,errorThrown){//异常处理；
			throw ("apiError:"+type);
		}
	}
	this.ajax(url,ajaxSetting);
}

/**
 * 调用安全api
 * @param {Object} data
 * @param {Object} callback
 * @param {Object} op
 */
WiStormAPI.prototype.safetyGet=function(data,callback,op){
	var reg=new RegExp("(^\\s*)|(\\s*$)", "g");
	var val;
	for(key in data){
		if(typeof data[key]=='object')
			val=JSON.stringify(data[key]);
		else if(typeof data[key]=='undefined')
			continue;
		else
			val=data[key].toString();
		data[key]=encodeURI(val.replace(reg,""));
	}
	var ajaxSetting={
		'data':data,
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:callback,
		error:function(xhr,type,errorThrown){//异常处理；
			throw ("apiError:"+type);
		}
	}
	this.ajax(this.safetyUrl,ajaxSetting);
}

WiStormAPI.prototype.makeUrl=function(json){
	if(!json.access_token&&this.access_token)
		json.access_token=this.access_token;
	var sign="";
	var URL="";
	var reg=new RegExp("(^\\s*)|(\\s*$)", "g");
	//按key名进行排序
	var keyArr=[];
	for(var key in json){
		keyArr.push(key);
	}
	keyArr.sort();
	
	//拼装
	var signText="",key,getData="",val;
	for(var i=0;i<keyArr.length;i++){
		key=keyArr[i];
		val=json[key];
		if(val===null||val===undefined)
			continue;
		else if(typeof val=="object"){
			val=JSON.stringify(val);			
		}else
			val=val.toString();
		val=val.replace(/\+/g,'%2B');
		val=val.replace(/\&/g,'%26');
		val=encodeURI(val.replace(reg,""));
		signText+=key+val;
		getData+="&"+key+"="+val;
	}
	signText=this.appSecret+signText+this.appSecret;
	sign=this.encrypt.hex_md5(signText).toUpperCase();
	URL=this.url+"?sign="+sign+getData;
	console.log(URL);
	return URL;
}

/**
 * 合并两个json对象，如果存在相同属性，取第二个json的属性值
 * @param {Object} json1
 * @param {Object} json2
 */
WiStormAPI.prototype.jsonConcat=function(json1,json2){
	for(var key in json2){
		json1[key]=json2[key];
	}
};

/**
 * 框架的ajax，mui的ajax转化而来，无依赖
 * @param {String} url
 * @param {Object} options，具体可参考http://dev.dcloud.net.cn/mui/ajax/
 */
WiStormAPI.prototype.ajax=function(url,options) {
	var json={
		dataType:"json",
		timeout:10000,
		type:"GET",
		success:Wapi._noop,
		error:Wapi._noop
	}
	var headers = {
		"X-Requested-With": "XMLHttpRequest",
		"Accept": "*/*",
		"Content-Type": "application/x-www-form-urlencoded"
	};
	json.url=url;
	this.jsonConcat(json,options);
	this.jsonConcat(headers,options.headers);
	
	json.type=json.type.toUpperCase();
    var data="";
    if(json.data){
	    for (items in json.data){
			data+="&"+items+"="+json.data[items];
		}
		if(json.type=="GET")
			json.url+="?"+data.slice(1);
    }
	
	var xmlhttp=new XMLHttpRequest();
	if (json.timeout>0){
		xmlhttp.abortTimeout=setTimeout(function(){
			xmlhttp.onreadystatechange=Wapi._noop;
			xmlhttp.abort();
			json.error(xmlhttp,'timeout',json);
			json.success({"status_code":-2,"err_msg":"获取信息超时"});
		}, json.timeout);
	}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState === 4) {
			xmlhttp.onreadystatechange = Wapi._noop;
			clearTimeout(xmlhttp.abortTimeout);
			var result, error = false;
			if ((xmlhttp.status >= 200 && xmlhttp.status < 300) || xmlhttp.status === 304 ||xmlhttp.status === 0){
				var dataType=json.dataType;
				var resultText = xmlhttp.responseText||'{"status_code":-1,"err_msg":"无返回信息"}';
				try {
					if (dataType === 'xml') {
						result = xmlhttp.responseXML;
					} else if (dataType === 'json') {
						result = JSON.parse(resultText);
					}else
						result=resultText;
				} catch (e) {
					error = e;
				}
				if (error) {
					json.error(xmlhttp,'parsererror',json);
				} else {
					json.success(result, xmlhttp, json);
				}
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

WiStormAPI.prototype.add=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".create"; //接口名称
	
	this.getApi(data,callback,OP);
}
WiStormAPI.prototype.delete=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".delete"; //接口名称
	
	this.getApi(data,callback,OP);
}
WiStormAPI.prototype.update=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".update"; //接口名称
	
	this.getApi(data,callback,OP);
}
WiStormAPI.prototype.get=function(callback,data,op){
	var OP={};
	this.jsonConcat(OP,this._get_op);
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".get"; //接口名称
	
	this.getApi(data,callback,OP);
}
WiStormAPI.prototype.list=function(callback,data,op){
	var OP={};	
	this.jsonConcat(OP,this._list_op);
	this.jsonConcat(OP,op);
	OP.method=this.apiName+"s.list"; //接口名称
	
	this.getApi(data,callback,OP);
}
/**
 * 更新表中的某个json数组字段
 * @param {Object} callback
 * @param {Object} data 基本形式如下
 * 	 data={
		access_token:13454,
		_obj_id:123, //条件参数
		seller_ids:{
			_seller_id:456, //数组内的条件字段
			obj_name:'abc'  //要更新的字段
		}
	};
 * @param {Object} op
 */
WiStormAPI.prototype.updateJsonArray=function(callback,data,op){
	var D={
		access_token:data.access_token,
	}
	delete data.access_token;
	
	var sd;
	for(var k in data){
		if(k[0]=='_'){
			D[k]=data[k];
		}else{
			sd=data[k];
			for(var sk in sd){
				if(sk[0]=='_'){
					D['_'+k+'.'+sk.slice(1)]=sd[sk];
				}else
					D[k+'.$.'+sk]=sd[sk];
			}
		}
	}
	this.update(callback,D,op);
}

Wapi._=new WiStormAPI();
Wapi._noop=function(){};

/**
 * 用户信息相关api类
 * @constructor
 */
function WUserApi(){
	this.tableName="user";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'cust_id,login_id,cust_name,cust_type,privilege,saler_id,car_brand,car_series,seller_id,seller_ids,logo,remark,create_time,update_time,photo,address,tel,mobile'//默认返回的字段
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"cust_id",
		page:"cust_id",
		limit:"20"
	}
}
WUserApi.prototype=new WiStormAPI();//继承父类WiStormAPI

WUserApi.prototype.login=function(callback,data,op){
	var OP={};
	this.jsonConcat(OP,op);				    //把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".login"; 		//接口名称
	
	data.password=this.encrypt.hex_md5(data.password);//md5加密
	this.getApi(data,callback,OP);			         //使用“GET”请求，异步获取数据
}

/**
 * 注册
 * mobile: 手机(手机或者邮箱选其一)
 * email: 邮箱(手机或者邮箱选其一)
 * password: 密码
 * valid_type: 验证设备类型 1: 通过手机号  2:通过邮箱
 * valid_code: 收到的验证码
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WUserApi.prototype.register=function(callback,data,op){
	var OP={
		fields:'cust_id'			//默认返回的字段
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".register"; 				//接口名称
	data.password=this.encrypt.hex_md5(data.password);
	
	this.getApi(data,callback,OP);
}

/**
 * 检查账号或者用户名是否存在
 * mobile: 手机号
 * cust_name: 用户名
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WUserApi.prototype.checkExists=function(callback,data,op){
	var OP={
		fields:'exist'			//默认返回的字段
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".exists";//接口名称
	this.getApi(data,callback,OP);
}


/**
 * 重置密码
 * 参数:
 * account: 手机号码或者邮箱地址
 * passsword: md5(登陆密码)
 * valid_type: 验证设备类型 1: 通过手机号  2:通过邮箱
 * valid_code: 收到的验证码
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WUserApi.prototype.resetPassword=function(callback,data,op){
	var OP={
		fields:'status_code'			//默认返回的字段
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".password.reset";//接口名称
	data.password=this.encrypt.hex_md5(data.password);
	
	this.getApi(data,callback,OP);
}


/**
 * 获取用户授权令牌access_token
 * data包含：
 *     account:登录手机或邮箱
 *     passsword:密码
 * @param {Function} callback
 * @param {json} data，账户密码
 * @param {OP} op
 */
WUserApi.prototype.getToken=function(callback,data,op){
	var OP={
		fields:'access_token'			//默认返回的字段
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".access_token"; //接口名称
	data.password=this.encrypt.hex_md5(data.password);
	this.getApi(data,callback,OP);
}

/**
 * 绑定第三方登录帐号id
 * data包含：
 *     account:登录手机或邮箱
 *     passsword:密码
 * @param {Function} callback
 * @param {json} data，账户密码
 * @param {OP} op
 */
WUserApi.prototype.bind=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	this.jsonConcat(OP,op);				//把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".bind"; 		//接口名称
	
	this.getApi(data,callback,OP);
}

/**
 * 创建一条崩溃/错误记录
 * @param {Object} data
 * @param {Object} callback
 * @param {Object} op
 */
WUserApi.prototype.createCrash=function(data,callback,op){
	var OP={
		fields:'status_code,exception_id'
	};
	this.jsonConcat(OP,op);
	OP.method='wicare.crash.create';
	
	this.getApi(data,callback,OP);
}

/**
 * 分销商各层级注册
 * @param {Object} data 必须parent_open_id，parent_mobile,mobile,password,valid_code,valid_type
 * @param {Object} callback
 * @param {Object} op
 */
WUserApi.prototype.distributorRegister=function(callback,data){
	data.method=this.apiName+'.distributor.register';
	this.safetyGet(data,callback);
}

/**
 * 验证邀请手机和openid是否有效
 * @param {Object} data 需要parent_open_id，parent_mobile
 * @param {Object} callback
 * @param {Object} op
 */
WUserApi.prototype.distributorCheck=function(callback,data){
	data.method=this.apiName+'.distributor.checkParent';
	this.safetyGet(data,callback);
}

/**
 * 客户签到
 * @param {Function} callback
 * @param {json} data,open_id
 * @param {OP} op
 */
WUserApi.prototype.checkin=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	this.jsonConcat(OP,op);				//把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".checkin"; 		//接口名称
	
	this.getApi(data,callback,OP);
}

/**
 * 客户分享
 * @param {Function} callback
 * @param {json} data，open_id
 * @param {OP} op
 */
WUserApi.prototype.share=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	this.jsonConcat(OP,op);				//把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".share"; 		//接口名称
	
	this.getApi(data,callback,OP);
}

WUserApi.prototype.add=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".create"; //接口名称
	if(data.obj_name)
		data.obj_name=data.obj_name.toUpperCase();
	this.getApi(data,callback,OP);
}

WUserApi.prototype.getQrcode=function(callback,data,op){
	data.method=this.apiName+'.getQrcode';
	this.safetyGet(data,callback);
}
/**
 * 添加绑定商户
 * 参数:
 *     cust_id: 用户ID
 *     seller_id: 商户ID
 * @param {Object} callback
 * @param {Object} data 				
 * @param {Object} op
 */
WUserApi.prototype.addSeller=function(callback,data,op){
	var D={
		access_token:data.access_token,
		_cust_id:data.cust_id
	};
	delete data.cust_id;
	delete data.access_token;
	D.seller_ids="+"+JSON.stringify(data);
	this.update(callback,D,op);
}

/**
 * 删除绑定商户
 * 参数:
 *     cust_id: 用户ID
 *     seller_id: 商户ID
 * @param {Object} callback
 * @param {Object} data 				
 * @param {Object} op
 */
WUserApi.prototype.deleteSeller=function(callback,data,op){
	data._cust_id=data.cust_id;
	data.seller_ids="-"+data.seller_id.toString();
	delete data.seller_id;
	delete data.cust_id;
	this.update(callback,data,op);
}



/**
 * 业务表api类
 * @constructor
 */
function WBusinessApi(){
	this.tableName="business";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'business_id,business_type,obj_name,obj_id,mileage,evaluate_level,status,arrive_time,leave_time,cust_id,cust_name,business_content,car_brand_id,car_brand,car_series_id,car_series,car_type_id,car_type,game_id,game_title',//默认返回的字段
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"business_id",
		page:"business_id",
		limit:"20"
	}
}
WBusinessApi.prototype=new WiStormAPI();//继承父类WiStormAPI

/**
 * 到店离店统计,需要令牌
 * data包含：
 *     parent_cust_id: 商户ID;
 *     begin_time: 开始时间;
 *     end_time: 结束时间;
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WBusinessApi.prototype.getBusinessTotal=function(callback,data,op){
	var OP={
		fields:'arrive_total,leave_total,evaluate_total'//默认返回的字段
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+'.total';//接口名称
	this.getApi(data,callback,OP);		//调用新接口
}

/**
 * seller_id: 商户ID;
 * status: 状态 1:在店 2:离店;
 * query_type: 离店查询方式 1: 到店时间 2: 离店时间 3: 评价时间
 * begin_time: 开始时间;
 * end_time: 结束时间;
 * max_id: 本页最大ID, 获取下页内容时使用
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WBusinessApi.prototype.list=function(callback,data,op){
	var OP={};
	this.jsonConcat(OP,this._list_op);
	this.jsonConcat(OP,op);
	OP.method=this.apiName+'.list';//接口名称
	
	this.getApi(data,callback,OP);		//调用新接口
}


/**
 * 异常车况表api类
 * @constructor
 */
function WExceptionApi(){
	this.tableName="exception";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'exception_id,msg_template,obj_id,cust_id,obj_name,cust_name,device_id,car_brand_id,car_brand,car_series_id,car_series,car_type_id,car_type,maintain_last_mileage,mileage,last_arrive,exp_type,exp_reason,pushed,push_time,create_time,update_time'
	};
	this._list_op={
		fields:this._get_op.fields,
		sorts: 'exception_id',
	    page: 'exception_id',
    	limit: "20"
	};
}
WExceptionApi.prototype=new WiStormAPI();//继承父类WiStormAPI




/**
 * 提醒设置表
 */
function WExcOptionApi(){
	this.tableName="exception_option";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'option_id,option_type,option_name,cust_id,mileage,duration,object,object_type,object_name,msg_template,create_time,update_time'
	};
	this._list_op={
		fields:this._get_op.fields,
		sorts: 'option_id',
	    page: 'option_id',
    	limit: "20"
	};
}
WExcOptionApi.prototype=new WiStormAPI();//继承父类WiStormAPI




/**
 * 聊天信息
 */
function WChatApi(){
	this.tableName="chat";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'chat_id,user_id,friend_id,type,url,content,voice_len,lon,lat,address,create_time,read_time,sender_id,receiver_id'
	};
	this._list_op={
		fields:this._get_op.fields,
		sorts: 'chat_id',
	    page: 'chat_id',
    	limit: "20"
	};
}
WChatApi.prototype=new WiStormAPI();//继承父类WiStormAPI



/**
 * 关系表（聊天）
 */
function WRelationApi(){
	this.tableName="relation";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'relat_id,user_id,friend_id,friend_type,friend_name,sex,logo,content,send_time,create_time,unread_count,status'
	};
	this._list_op={
		fields:this._get_op.fields,
		sorts: '-create_time',
	    page: 'create_time',
    	limit: "20"
	};
}
WRelationApi.prototype=new WiStormAPI();//继承父类WiStormAPI






/**
 * 基础接口api类
 * @constructor
 */
function WBaseApi(){
	this.tableName="base";
	this.apiName+="."+this.tableName;
}
WBaseApi.prototype=new WiStormAPI();


/**
 * 获取天气
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WBaseApi.prototype.getWeather=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+'.weather.get';
	
	//this.getApi(data,callback,OP);
	W.getJSON("http://api.bibibaba.cn/base/weather2",data,callback);
}

/**
 * 获取城市空气指数
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WBaseApi.prototype.getAQI=function(callback,data,op){
	var OP={};
	this.jsonConcat(OP,op)
	OP.method=this.apiName+'.aqi.get';//接口名称
	
	this.getApi(data,callback,OP);
}


/**
 * 获取品牌列表
 * @param {Function} callback
 * @param {json} op，接口配置，可选
 */
WBaseApi.prototype.getBrands=function(callback,data,op){
	var OP={
		fields:'pid,name,url_icon,t_spell',
		sorts: 't_spell',
	    page: 't_spell',
    	limit: "-1"
	};
	this.jsonConcat(OP,data);
	OP.method=this.apiName+'.car_brands.list';//接口名称
	
	this.getApi(OP,callback,op);
}

/**
 * 获取车系列表
 * @param {Function} callback
 * @param {String} id，品牌id
 * @param {options} op，接口配置，可选
 */
WBaseApi.prototype.getSeriess=function(callback,data,op){
	var OP={
		fields:'pid,name,show_name,go_id,go_name',
		sorts: 'go_name,name',
	    page: 'go_name',
    	limit: "-1"
	};
	this.jsonConcat(OP,data);
	OP.method=this.apiName+'.car_series.list';//接口名称
	
	this.getApi(OP,callback,op);
}

/**
 * 获取车款列表
 * @param {Function} callback
 * @param {String} id，车系id
 * @param {options} op，接口配置，可选
 */
WBaseApi.prototype.getTypes=function(callback,data,op){
	var OP={
		fields:'pid,name,show_name,go_id,go_name',
		sorts: 'go_name,name',
	    page: 'go_name',
    	limit: "-1"
	};
	this.jsonConcat(OP,data);
	OP.method=this.apiName+'.car_types.list';//接口名称
	
	this.getApi(OP,callback,op);		//调用新接口
}

//经纬度转地址
WBaseApi.prototype.geocoder=function(callback,data){
	data.method=this.apiName+'.geocoder';
	this.safetyGet(data,callback);
}




/**
 * 通讯接口api类
 * @constructor
 */
function WCommApi(){
	this.tableName="comm";
	this.apiName+="."+this.tableName;
}
WCommApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 参数:
 * mobile: 手机号码
 * type: 发送短信类型
 * 1: 普通校验码信息
 * 2: 忘记密码校验信息
 * @param {Object} callback
 * @param {Object} mobile
 */
WCommApi.prototype.sendSMS=function(callback,mobile,type){
	var Data={
		method:this.apiName+".sms.send",
		mobile:mobile,
		type:type
	};
	
	this.getApi(Data,callback);	
}

//验证验证码
WCommApi.prototype.validCode=function(callback,data,op){
	var OP={
		fields:'valid'			//默认返回的字段
	};
	this.jsonConcat(OP,op);
	OP.method="wicare.user.valid_code";//接口名称
	this.getApi(data,callback,OP);
}

/*
 * 推送微信
 * data包含：
 * from:消息来源（字符串）
 * content：内容
 * open_id：接收者open_id
 * link：链接
 * remark:说明
 */
WCommApi.prototype.sendWeixin=function(callback,data){
	var url="http://h5.bibibaba.cn/send_weixin.php";
	var now = new Date();
    var op = {
        "first": {
            "value": data.content,
            "color": "#173177"
        },
        "keynote1": {
            "value": data.from,
            "color": "#173177"
        },
        "keynote2": {
            "value": W.dateToString(now),
            "color": "#173177"
        },
        "remark": {
            "value": data.remark,
            "color": "#173177"
        }
    };
    var OP={
		template_id:"FB1J1WM7tYMFPe0dScOBRc0MmGaOA_2VnBaNE1hnzH4",
		data:encodeURIComponent(JSON.stringify(op)),
		open_id:data.open_id,
		url:encodeURIComponent(data.link)
	}
	var ajaxSetting={
		dataType:"json",//服务器返回json格式数据
		data:OP,
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:callback,
		error:function(xhr,type,errorThrown){//异常处理；
			throw ("apiError:"+type);
		}
	}
	this.ajax(url,ajaxSetting);
}





/**
 * 开发者接口api类
 * @constructor
 */
function WDeveloperApi(){
	this.tableName="developer";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'dev_id,user_name,email,dev_type,user_id,dev_name,dev_key,dev_secret,access_apis,create_time'//默认返回的字段
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"dev_id",
		page:"dev_id",
		limit:"20"
	}
}
WDeveloperApi.prototype=new WiStormAPI();

/**
 * APPapi类
 * @constructor
 */
function WAppApi(){
	this.tableName="app";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'app_id,dev_id,app_name,app_logo,app_key,app_secret,data_privilege,create_time,update_time'//默认返回的字段
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"app_id",
		page:"app_id",
		limit:"20"
	}
}
WAppApi.prototype=new WiStormAPI();



/**
 * 终端接口api类
 * @constructor
 */
function WDeviceApi(){
	this.tableName="device";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'device_id,serial,cust_id,cust_name,device_type,sim,status,seller_id,active_time'//默认返回的字段
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"device_id",
		page:"device_id",
		limit:"20"
	}
}
WDeviceApi.prototype=new WiStormAPI();




/**
 * 获取电压曲线及水温曲线(也可以是其他数据的历史数据)
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WDeviceApi.prototype.getDeviceObdDataList=function(callback,data,op){
	var OP={
		fields:'rcv_time,obd_data.dpdy,obd_data.sw',	//默认返回的字段
		sorts:"rcv_time",
		page:"rcv_time",
		limit:"1000"
	};
	
	this.jsonConcat(OP,op);				    //把用户传入的配置覆盖默认配置
	OP.method="wicare.device_obd_datas.list"; 				//接口名称
	
	this.getApi(data,callback,OP);
}

/**
 * 获取里程日曲线或者平均油耗日曲线
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WDeviceApi.prototype.getDayTripList=function(callback,data,op){
	var OP={
		fields:'rcv_day,total_distance,avg_fuel',	//默认返回的字段
		sorts:"rcv_day",
		page:"rcv_day",
		limit:"1000"
	};
	
	this.jsonConcat(OP,op);				    //把用户传入的配置覆盖默认配置
	OP.method="wicare.day_trips.list"; 				//接口名称
	
	this.getApi(data,callback,OP);
}


/**
 * 获取gps字段信息
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WDeviceApi.prototype.getDeviceGpsDataList=function(callback,data,op){
	var OP={
		fields:'rcv_time,lon,lat',	//默认返回的字段
		sorts:"rcv_time",
		page:"rcv_time",
		limit:"1000"
	};
	
	this.jsonConcat(OP,op);				    //把用户传入的配置覆盖默认配置
	OP.method="wicare.gps_datas.list"; 				//接口名称
	
	this.getApi(data,callback,OP);
}

/**
 * 获取空气历史
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WDeviceApi.prototype.getDeviceAirDataList=function(callback,data,op){
	var OP={
		fields:'rcv_time,air',	//默认返回的字段
		sorts:"rcv_time",
		page:"rcv_time",
		limit:"1000"
	};
	
	this.jsonConcat(OP,op);				    //把用户传入的配置覆盖默认配置
	OP.method="wicare.air_datas.list"; 				//接口名称
	
	if(!data.air){
		data.air=">0";
	}
	this.getApi(data,callback,OP);
}

/**
 * 发送设备指令
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WDeviceApi.prototype.sendCommand=function(callback,data,op){
	var OP={
		fields:'status_code'	//默认返回的字段
	};
	
	this.jsonConcat(OP,op);				    //把用户传入的配置覆盖默认配置
	data.params=JSON.stringify(data.params);
	OP.method="wicare.command.create"; 				//接口名称
	
	this.getApi(data,callback,OP);
}

/**
 * 点赞
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WDeviceApi.prototype.incDayTrip = function (callback,data,op) {
	var OP={
		fields:'status_code'	//默认返回的字段
	};
	
	this.jsonConcat(OP,op);				    //把用户传入的配置覆盖默认配置
	OP.method="wicare.day_trip.inc"; 				//接口名称
	this.getApi(data,callback,OP);
};








/**
 * 文件接口api类
 * @constructor
 */
function WFileApi(){
	this.tableName="file";
	this.apiName+="."+this.tableName;
}
WFileApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 
 * @param {Function} callback,上传成功之后调用
 * @param {File} file，要上传的文件对象，使用html5文件api
 * @param {Function} updateProgress，上传进度发生改变时调用，传入一个0-1之间的小数
 * @param {json} op，接口配置
 */
WFileApi.prototype.upload=function(callback,file,updateProgress,op){
	var OP={
		format: 'json',   //返回数据格式
	    v: '1.0',         //接口版本
	    sign_method: 'md5',//签名方式
		fields:'待定'	//默认返回的字段
	};
	OP.timestamp=W.dateToString(new Date());
	OP.app_key=this.appKey;
	this.jsonConcat(OP,op);
	OP.method="wicare.file.upload"; 
	var url=this.makeUrl(OP);//签名并构建路径
	
	var oData = new FormData();
	oData.append("image",file,file.name);

	var oReq = new XMLHttpRequest();
	oReq.open("POST",url,true);
	
	if(updateProgress){
		oReq.upload.addEventListener("progress",function(event){
			if(event.lengthComputable){
			    var percentComplete = event.loaded / event.total;
			    updateProgress(percentComplete);
			}
		});
	}
	oReq.onload = function(oEvent) {
		if (oReq.status == 200) {
			var json;
			try{
				json=JSON.parse(oReq.responseText);
			}catch(e){
				//TODO handle the exception
				json=oReq.responseText;
			}
			callback(json);
		} else {
		  	callback("Error " + oReq.status + " occurred uploading your file.<br \/>");
		}
	};
	oReq.send(oData);
}

/**
 * 
 * @param {Function} callback,上传成功之后调用
 * @param {String} dataUrl，要上传的文件base64编码
 * @param {Function} updateProgress，上传进度发生改变时调用，传入一个0-1之间的小数
 * @param {json} op，接口配置
 */
WFileApi.prototype.base64=function(callback,data,updateProgress,op){
	var method=this.apiName+'.base64'; 
	data.dataUrl=data.dataUrl.replace(/data:.*;base64,/,'');
	var url=this.safetyUrl+'?method='+method;
	var oData = new FormData();
	oData.append("image",data.dataUrl);
	oData.append("imageName",data.name);
	oData.append("suffix",data.suffix);

	var oReq = new XMLHttpRequest();
	oReq.open("POST",url,true);
	
	if(updateProgress){
		oReq.upload.addEventListener("progress",function(event){
			if(event.lengthComputable){
			    var percentComplete = event.loaded / event.total;
			    updateProgress(percentComplete);
			}
		});
	}
	oReq.onload = function(oEvent) {
		if (oReq.status == 200) {
			var json;
			try{
				json=JSON.parse(oReq.responseText);
			}catch(e){
				//TODO handle the exception
				json=oReq.responseText;
			}
			callback(json);
		} else {
		  	callback("Error " + oReq.status + " occurred uploading your file.<br \/>");
		}
	};
	oReq.send(oData);
}




/**
 * 订单接口api类
 * @constructor
 */
function WOrderApi(){
	this.tableName="order";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'order_id,cust_id,seller_id,saler_id,order_type,status,product_name,unit_price,quantity,remark,create_time'//默认返回的字段
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"order_id",
		page:"order_id",
		limit:"20"
	}
}
WOrderApi.prototype=new WiStormAPI();






/**
 * 支付接口api类
 * @constructor
 */
function WPayApi(){
	this.tableName="pay";
	this.apiName+="."+this.tableName;
}
WPayApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 产生订单并获取微信支付参数,
 * callback会在页面跳回到时候调用，所以不支持匿名函数和局部函数
 * 下单成功会自动跳转到确认订单页面，在确认订单页面支付，支付完成会返回当前url;
 * 参数:
 *	cust_id: 商户Id;
 *	open_id: 微信用户OpenID;
 *	order_type: 订单类型 1: 设备 2: 服务费
 *	product_name: 产品名称;
 *	remark: 产品描述;
 *	unit_price: 单价;
 *	quantity: 数量;
 *	total_price: 总价;
 */
WPayApi.prototype.pay=function(callback,data){
	data.method=this.apiName+'.buy';
	if(data._return==true){
		this.getApi(data,callback);
	}else
		this.getApi(data,function(res){
			if(res.status_code){
				//后台下单不成功
				callback(res);
			}else{
				if(res.act_pay===0){
					res.err_msg='get_brand_wcpay_request:ok';
					callback(res);
				}
				//下单成功跳转确认订单页面
				localStorage.setItem("_temp_order_id",res.order_id);
				localStorage.setItem("_weixin_pay_args",JSON.stringify(res.pay_args));
				localStorage.setItem("_weixin_pay_callback",callback.name)
				top.location="http://h5.bibibaba.cn/baba/wx/src/activation.html?title="+data.product_name+"&detail="+data.remark+"&price="+(res.act_pay||res.total_price);
			}
		});
}
window.addEventListener("load",function(){
	var callback=localStorage.getItem("_weixin_pay_callback");
	var res=localStorage.getItem("_weixin_pay_res");	
	localStorage.removeItem("_weixin_pay_callback");
	localStorage.removeItem("_weixin_pay_res");
	if(callback&&res){
		eval(callback+"("+res+")");
	}
})

/**
 * 根据订单获取微信支付参数,
 * callback会在页面跳回到时候调用，所以不支持匿名函数和局部函数
 * 下单成功会自动跳转到确认订单页面，在确认订单页面支付，支付完成会返回当前url;
 * 参数:
 *	open_id: 微信用户OpenID;
 *   order_id: 订单编号
 *    product_name: 产品名称;
 *    remark: 产品描述;
 *    total_price: 总价;
 */
WPayApi.prototype.orderPay=function(callback,data){
	data.method=this.apiName+'.weixin';
	if(data._return==true){
		this.getApi(data,callback);
	}else
		this.getApi(data,function(res){
			if(res.status_code){
				//后台下单不成功
				callback(res);
			}else{
				//下单成功跳转确认订单页面
				localStorage.setItem("_temp_order_id",res.order_id);
				localStorage.setItem("_weixin_pay_args",JSON.stringify(res.pay_args));
				localStorage.setItem("_weixin_pay_callback",callback.name)
				top.location="http://h5.bibibaba.cn/baba/wx/src/activation.html?title="+data.product_name+"&detail="+data.remark+"&price="+(res.act_pay||res.total_price);
			}
		});
}
window.addEventListener("load",function(){
	var callback=localStorage.getItem("_weixin_pay_callback");
	var res=localStorage.getItem("_weixin_pay_res");	
	localStorage.removeItem("_weixin_pay_callback");
	localStorage.removeItem("_weixin_pay_res");
	if(callback&&res){
		eval(callback+"("+res+")");
	}
})




/**
 * 车辆接口api类
 * @constructor
 */
function WVehicleApi(){
	this.tableName="vehicle";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'nick_name,cust_name,obj_id,cust_id,seller_id,obj_name,device_id,car_brand_id,car_brand,car_series_id,car_series,car_type_id,car_type,frame_no,maintain_last_mileage,mileage,arrive_count,evaluate_count,last_arrive_time,business_status,evaluate_level'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"obj_id",
		page:"obj_id",
		limit:"20"
	};
}
WVehicleApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

WVehicleApi.prototype.add=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".create"; //接口名称
	
	data.obj_name=data.obj_name.toUpperCase();
	this.getApi(data,callback,OP);
}

WVehicleApi.prototype.update=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".update"; //接口名称
	if(data.obj_name)
		data.obj_name=data.obj_name.toUpperCase();
	this.getApi(data,callback,OP);
}
/**
 * 添加绑定商户
 * 参数:
 *     obj_id: 车辆ID
 *     seller_id: 商户ID
 * @param {Object} callback
 * @param {Object} data 				
 * @param {Object} op
 */
WVehicleApi.prototype.addSeller=function(callback,data,op){
	var D={
		access_token:data.access_token,
		_obj_id:data.obj_id
	};
	delete data.obj_id;
	delete data.access_token;
	D.seller_ids="+"+JSON.stringify(data);
	this.update(callback,D,op);
}

/**
 * 删除绑定商户
 * 参数:
 *     obj_id: 车辆ID
 *     seller_id: 商户ID
 * @param {Object} callback
 * @param {Object} data 				
 * @param {Object} op
 */
WVehicleApi.prototype.deleteSeller=function(callback,data,op){
	data._obj_id=data.obj_id;
	data.seller_ids="-"+data.seller_id.toString();
	delete data.seller_id;
	delete data.obj_id;
	this.update(callback,data,op);
}



/**
 * 字典接口api类
 * @constructor
 */
function WDictApi(){
	this.tableName="dict";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'dict_value'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"dict_value",
		page:"dict_value",
		limit:"20"
	};
}
WDictApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 工具接口
 * @constructor
 */
function WUtilApi(){
	this.tableName="util";
	this.apiName+="."+this.tableName;
}
WUtilApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

//获取二维码接口
WUtilApi.prototype.getPicValidCode=function(callback,data,op){
	var OP={
		fields:'status_code'	//默认返回的字段
	};
	
	this.jsonConcat(OP,op);	//把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".pic_valid_code.get";//接口名称
	this.getApi(data,function(res){
		if(!res.status_code){
			res.valid_code_img=res.valid_code_img.match(/data:image(.*?)(?=")/)[0];
		}
		callback(res);
	},OP);
}


/**
 * 微信好友关系表api类
 * @constructor
 */
function WFriendApi(){
	this.tableName="weixin_friend";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'open_id,name,friend_open_id,friend_name,click_count'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"click_count",
		page:"click_count",
		limit:"100"
	};
}
WFriendApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 操作日志表api类
 * @constructor
 */
function WLogApi(){
	this.tableName="op_log";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'cust_id,open_id,type,content,create_time'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"create_time",
		page:"create_time",
		limit:"100"
	};
}
WLogApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 账单表
 * @constructor
 */
function WBillApi(){
	this.tableName="bill";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'order_id,source,type,remark,m_type,sum,is_delay_pay,create_time'
	}
	this._list_op={
		fields:this._get_op.fields,	//默认返回的字段
		sorts:"create_time",
		page:"create_time",
		limit:"100"
	};
}
WBillApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法



/**
 * 位置表(目前只有一个充电桩位置接口)
 * @constructor
 */
function WLocationApi(){
	this.tableName="location";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'name,address,tel,lon,lat,distance'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"-create_time",
		page:"create_time",
		limit:"20"
	};
}
WLocationApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 产品表
 * @constructor
 */
function WProductApi(){
	this.tableName="product";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'product_id,product_type,status,product_name,photo,sku_info,unit_price,stock,remark,url'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"product_id",
		page:"product_id",
		limit:"20"
	};
}
WProductApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 奖品表
 * @constructor
 */
function WLotteryApi(){
	this.tableName="lottery";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'lottery_id,name,type,sum,time_start,time_end,msg'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"lottery_id",
		page:"lottery_id",
		limit:"20"
	};
}
WLotteryApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

//抽奖
WLotteryApi.prototype.draw=function(callback,data,op){
	var OP={
		fields:'status_code'	//默认返回的字段
	};
	
	this.jsonConcat(OP,op);				    //把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".draw"; 				//接口名称
	this.getApi(data,callback,OP);
}

//领奖
WLotteryApi.prototype.receive=function(callback,data,op){
	var OP={
		fields:'status_code'	//默认返回的字段
	};
	
	this.jsonConcat(OP,op);				    //把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".receive"; 				//接口名称
	this.getApi(data,callback,OP);
}


/**
 * 游戏表
 */
function WGameApi(){
	this.tableName="game";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'game_id,open_id,type,material_url,create_time'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"create_time",
		page:"create_time",
		limit:"20"
	};
}
WGameApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 游戏操作表
 */
function WGamelogApi(){
	this.tableName="game_log";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'log_id,game_id,open_id,completion,create_time,update_time,duration,name,logo'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"duration",
		page:"duration",
		limit:"20"
	};
}
WGamelogApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 广告表
 */
function WAdApi(){
	this.tableName="ad";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'ad_id,city,image,content,url,probability'
	}
	this._list_op={
		fields:this._get_op.fields,	//默认返回的字段
		sorts:"ad_id",
		page:"ad_id",
		limit:"20"
	};
}
WAdApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 广告日志表
 */
function WAdlogApi(){
	this.tableName="ad_log";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'ad_id,open_id,type'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"ad_id",
		page:"ad_id",
		limit:"20"
	};
}
WAdlogApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 优惠券表
 */
function WVoucherApi(){
	this.tableName="voucher";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'voucher_id,cust_id,open_id,code,type,remark,sum,valid_time,is_used'
	}
	this._list_op={
		fields:this._get_op.fields,	//默认返回的字段
		sorts:"voucher_id",
		page:"voucher_id",
		limit:"20"
	};
}
WVoucherApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法


/**
 * 故障码表
 */
function WObderrApi(){
	this.tableName="obd_err";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'err_id,code,brand,c_define,e_define,category,content,level'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"err_id",
		page:"err_id",
		limit:"20"
	};
}
WObderrApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 活动预约表
 */
function WBookingApi(){
	this.tableName="booking";
	this.apiName+="."+this.tableName;
	this._get_op={
		fields:'book_id,status,game_id,cust_id,open_id,cust_name,mobile,obj_name,obj_id,day,range,discount,downpayment'
	}
	this._list_op={
		fields:this._get_op.fields,
		sorts:"book_id",
		page:"book_id",
		limit:"20"
	};
}
WBookingApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

Wapi.vehicle=new WVehicleApi();//车辆
Wapi.pay=new WPayApi();//支付
Wapi.order=new WOrderApi();//订单
Wapi.file=new WFileApi();//文件
Wapi.device=new WDeviceApi();//设备
Wapi.developer=new WDeveloperApi();//开发者
Wapi.user=new WUserApi();//用户
Wapi.base=new WBaseApi();//基本
Wapi.comm=new WCommApi();//通信
Wapi.business=new WBusinessApi();//业务
Wapi.exc_opt=new WExcOptionApi();//提醒设置
Wapi.exception=new WExceptionApi();//异常车况
Wapi.chat=new WChatApi();//聊天
Wapi.relation=new WRelationApi();//关系表
Wapi.dict=new WDictApi();//字典表
Wapi.util=new WUtilApi();//工具接口类
Wapi.friend=new WFriendApi();//微信好友表
Wapi.log=new WLogApi();//操作日志表
Wapi.bill=new WBillApi();//账单表
Wapi.location=new WLocationApi();//位置表
Wapi.product=new WProductApi();//产品表
Wapi.lottery=new WLotteryApi();//奖品表
Wapi.game=new WGameApi();//游戏表
Wapi.gamelog=new WGamelogApi();//游戏操作表
Wapi.ad=new WAdApi();//广告表
Wapi.adLog=new WAdlogApi();//广告日志表
Wapi.voucher=new WVoucherApi();//广告日志表
Wapi.obderr=new WObderrApi();//故障码表
Wapi.booking=new WBookingApi();//预订记录表
Wapi.app=new WAppApi();//应用表


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
		Wapi.user.createCrash(__errorList[__i],function(res){});
	}
	localStorage.removeItem("errorList");
}


var evt = document.createEvent("HTMLEvents");
evt.initEvent("W.apiready", false, false);
window.dispatchEvent(evt);