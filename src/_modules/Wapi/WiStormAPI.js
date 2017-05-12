import md5 from 'md5';

function _noop(){};

/**
 * api接口类，构造时传入表名和token
 * @param {String} name 表名
 * @param {String} token 调用接口的信令
 * @param {Object} opt 可选的配置
 */
function WiStormAPI(name,token,key,secret,opt){
    Object.defineProperties(this, {//添加只读属性
        "url": {
			value:'http://wop-api.chease.cn/router/rest'
			// value:'http://wop-api3.chease.cn/router/rest'
			// value:'http://192.168.3.120:8089/router/rest'
            // value: "http://o.bibibaba.cn/router/rest"
        },
        "safetyUrl": {
            // value: "http://h5test.bibibaba.cn/baba/wx/wslib/api/safetyWapi.php",
			value: "http://h5.bibibaba.cn/baba/wx/wslib/api/safetyWapi.php"
        },
        "appKey": {
            value: key
        },
        "appSecret": {
            value: secret
        },
		"devKey": {
            value: (opt?opt.devKey:null)
        },
        "tableName":{
            value: name
        },
        "apiName":{
            value: "wicare."+name
        }
    });
    this.access_token=token;
    if(opt){
        this.get_op=opt.get_op;
        this.list_op=opt.list_op;
    }
	this.md5=md5;
}

/**
 * get方法的接口调用
 * @param {Object} data
 * @param {Object} callback
 * @param {Object} op
 */
WiStormAPI.prototype.getApi=function(data,callback,op){
	var D={
		format: 'json',   //返回数据格式
	    // v: '1.0',         //接口版本
	    v: '2.0',         //接口版本
	    sign_method: 'md5'//签名方式
	}
	D.timestamp=W.dateToString(new Date());
	D.app_key=this.appKey;
	Object.assign(D,data,op);

	var url=this.makeUrl(D);
	var ajaxSetting={
		dataType:D.format,//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:callback||function(res){console.log(res)},
		error:function(xhr,type,errorThrown){//异常处理；
			// throw ("apiError:"+type);
		}
	}
	this.ajax(url,ajaxSetting);
}

WiStormAPI.prototype.postApi=function(getData,callback,data){
	var D={
		format: 'json',   //返回数据格式
	    v: '2.0',         //接口版本
	    sign_method: 'md5'//签名方式
	}
	D.timestamp=W.dateToString(new Date());
	D.app_key=this.appKey;
	Object.assign(D,getData);

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
	if(this.devKey)
		json.dev_key=this.devKey;
	var sign="";
	var URL="";
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
		val=this.encodeURI(val);
		signText+=key+val;
		getData+="&"+key+"="+val;
	}
	if(this.appSecret)
		signText=this.appSecret+signText+this.appSecret;
	sign=this.md5(signText).toUpperCase();
	URL=this.url+"?sign="+sign+getData;
	console.log(URL);
	return URL;
}

//需要特殊处理几个特殊字符
WiStormAPI.prototype.encodeURI=function(val){
	var reg=new RegExp("(^\\s*)|(\\s*$)", "g");//去左右空格
	val=val.replace(/\+/g,'%2B');
	val=val.replace(/\&/g,'%26');
	val=val.replace(/\#/g,'%23');
	val=encodeURI(val.replace(reg,""));
	return val;
}

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
		success:_noop,
		error:_noop
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
	    for (let items in json.data){
			data+="&"+items+"="+json.data[items];
		}
		if(json.type=="GET")
			json.url+="?"+data.slice(1);
    }
	
	var xmlhttp=new XMLHttpRequest();
	if (json.timeout>0){
		xmlhttp.abortTimeout=setTimeout(function(){
			xmlhttp.onreadystatechange=_noop;
			xmlhttp.abort();
			json.error(xmlhttp,'timeout',json);
			json.success({"status_code":-2,"err_msg":"获取信息超时"});
		}, json.timeout);
	}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState === 4) {
			xmlhttp.onreadystatechange = _noop;
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
	Object.assign(OP,op);
	OP.method=this.apiName+".create"; //接口名称
	if(!OP.err){
		callback=W.err(callback);
	}
	delete OP.err;
	this.getApi(data,callback,OP);
}
WiStormAPI.prototype.delete=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	Object.assign(OP,op);
	OP.method=this.apiName+".delete"; //接口名称
	if(!OP.err){
		callback=W.err(callback);
	}
	delete OP.err;
	this.getApi(data,callback,OP);
}
WiStormAPI.prototype.update=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	Object.assign(OP,op);
	OP.method=this.apiName+".update"; //接口名称
	if(!OP.err){
		callback=W.err(callback);
	}
	delete OP.err;
	this.getApi(data,callback,OP);
}
WiStormAPI.prototype.get=function(callback,data,op){
	var OP={};
	Object.assign(OP,this.get_op,op);
	OP.method=this.apiName+".get"; //接口名称
	if(!OP.err){
		callback=W.err(callback);
	}
	delete OP.err;
	this.getApi(data,callback,OP);
}
WiStormAPI.prototype.list=function(callback,data,op){
	var OP={};	
	Object.assign(OP,this.list_op,op);
	OP.method=this.apiName+".list"; //接口名称
	if(!OP.err){
		callback=W.err(callback);
	}
	delete OP.err;
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
	var D={}
	
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

/**
 * 获取计数接口
 */
WiStormAPI.prototype.count=function(callback,data,op){
	var OP={};	
	Object.assign(OP,op);
	OP.method=this.apiName+".count"; //接口名称
	if(!OP.err){
		callback=W.err(callback);
	}
	delete OP.err;
	this.getApi(data,callback,OP);
}

/**
 * 获取统计信息
 */
WiStormAPI.prototype.aggr=function(callback,data,op){
	var OP={};	
	Object.assign(OP,op);
	OP.method=this.apiName+".aggr"; //接口名称
	if(!OP.err){
		callback=W.err(callback);
	}
	delete OP.err;
	this.getApi(data,callback,OP);
}

export default WiStormAPI;