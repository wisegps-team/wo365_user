import WiStormAPI from './WiStormAPI.js';
import config from './config.js';

import Papi from './Papi';


export function WAPI(name,token){
	WiStormAPI.call(this,name,token,config.app_key,config.app_secret,{devKey:config.dev_key});
	this.get_op={
		fields:'objectId,createdAt,updatedAt'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WAPI.prototype=new WiStormAPI();
/**
 * 用户信息相关api类
 * @constructor
 */
function WUserApi(token,sessionToken){
    WiStormAPI.call(this,'user',token,config.app_key,config.app_secret);
	this.sessionToken=sessionToken;
	this.get_op={
		fields:'objectId,userType,username,mobile,mobileVerified,email,emailVerified,authData'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WUserApi.prototype=new WiStormAPI();//继承父类WiStormAPI

WUserApi.prototype.login=function(callback,data,op){
	var OP={};
	Object.assign(OP,op);				    //把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".login"; 		//接口名称
	
	data.password=this.md5(data.password);//md5加密
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
		fields:'uid'			//默认返回的字段
	};
	Object.assign(OP,op);
	OP.method=this.apiName+".register"; 				//接口名称
	data.password=this.md5(data.password);
	
	this.getApi(data,callback,OP);
}

/**
 * 检查账号或者用户名是否存在
 * mobile: 手机号
 * username: 用户名
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WUserApi.prototype.checkExists=function(callback,data,op){
	var OP={
		fields:'exist'			//默认返回的字段
	};
	Object.assign(OP,op);
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
	Object.assign(OP,op);
	OP.method=this.apiName+".password.reset";//接口名称
	data.password=this.md5(data.password);
	
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
	Object.assign(OP,op);
	OP.method=this.apiName+".access_token"; //接口名称
	data.password=this.md5(data.password);
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
	Object.assign(OP,op);				//把用户传入的配置覆盖默认配置
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
	Object.assign(OP,op);
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
	Object.assign(OP,op);				//把用户传入的配置覆盖默认配置
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
	Object.assign(OP,op);				//把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".share"; 		//接口名称
	
	this.getApi(data,callback,OP);
}

WUserApi.prototype.add=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	Object.assign(OP,op);
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

WUserApi.prototype.updateMe=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	Object.assign(OP,op);
	OP.method=this.apiName+".updateMe"; //接口名称
	if(!OP.err){
		callback=W.err(callback);
	}
	delete OP.err;
	if(!data._sessionToken&&this.sessionToken)
		OP._sessionToken=this.sessionToken;
	this.getApi(data,callback,OP);
}


/**
 * 通讯接口api类
 * @constructor
 */
function WCommApi(token){
	WiStormAPI.call(this,'comm',token,config.app_key,config.app_secret,{devKey:config.dev_key});
}
WCommApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 参数:
 * mobile: 手机号码
 * type: 发送短信类型
 * 0: 普通短信
 * 1: 普通校验码信息
 * 2: 忘记密码校验信息
 * content: 短信消息, type为0时需要设置
 * @param {Object} callback
 * @param {Object} mobile
 */
WCommApi.prototype.sendSMS=function(callback,mobile,type,content){
	var Data={
		method:this.apiName+".sms.send",
		mobile:mobile,
		type:type,
		'content':content
	};
	
	this.getApi(Data,callback);	
}
WCommApi.prototype.sendEmail=function(callback,email,type,content){
	var Data={
		method:this.apiName+".email.send",
		email,
		type,
		content
	};
	
	this.getApi(Data,callback);	
}

//验证验证码
WCommApi.prototype.validCode=function(callback,data,op){
	var OP={
		fields:'valid'			//默认返回的字段
	};
	Object.assign(OP,op);
	OP.method=this.apiName+".validCode";//接口名称
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

function WServiceApi(token){
	WiStormAPI.call(this,'service',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'objectId,sid,name,enterUrl,desc,createdAt,updatedAt,ACL'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WServiceApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 文件接口api类
 * @constructor
 */
function WFileApi(token){
	WiStormAPI.call(this,'file',token,config.app_key,config.app_secret);
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
	    v: '2.0',         //接口版本
	    sign_method: 'md5',//签名方式
		fields:'待定'	//默认返回的字段
	};
	OP.timestamp=W.dateToString(new Date());
	OP.app_key=this.appKey;
	Object.assign(OP,op);
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

function WDeveloperApi(token){
    WiStormAPI.call(this,'developer',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'objectId,uid,name,type,devKey,devSecret,pushEngine,smsEngine,createdAt,updatedAt,ACL'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WDeveloperApi.prototype=new WiStormAPI();//继承父类WiStormAPI

function WAppApi(token){
    WAPI.call(this,'app',token);
	this.get_op={
		fields:'objectId,devId,name,logo,appKey,appSecret,version,contact,domainName,ACL,creator,createdAt,updatedAt'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WAppApi.prototype=new WAPI();//继承父类WiStormAPI

function WTableApi(token){
	WAPI.call(this,'table',token);
	this.get_op={
		fields:'name,desc,type,isApi,isPrivate,isCache,cacheField,fieldDefine,indexDefine'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WTableApi.prototype=new WAPI();//继承父类WiStormAPI
WTableApi.prototype.refresh=function(callback,op){
	var OP=Object.assign({},op);
	OP.method=this.apiName+".refresh";//接口名称
	this.getApi(OP,callback);
}

/**
 * 角色表
 */
function WRoleApi(token){//角色
	WiStormAPI.call(this,'role',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'objectId,name,roles,users,createdAt,updatedAt'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WRoleApi.prototype=new WiStormAPI();//继承父类WiStormAPI

/**
 * 页面表
 */
function WPageApi(token){
	WiStormAPI.call(this,'page',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'objectId,appId,key,name,url,createdAt,updatedAt'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WPageApi.prototype=new WiStormAPI();//继承父类WiStormAPI


/**
 * 功能表
 */
function WFeatureApi(token){
	WiStormAPI.call(this,'feature',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'objectId,pageId,key,name,createdAt,updatedAt'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WFeatureApi.prototype=new WiStormAPI();//继承父类WiStormAPI

function WCacheApi(){
	WiStormAPI.call(this,'cache');
}
WFeatureApi.prototype=new WiStormAPI();//继承父类WiStormAPI
WFeatureApi.prototype.get=function(callback,key){
	var data={
		'key':key,
		'method':this.apiName+".getObj"
	};
	this.getApi(data,callback);
}


function WBaseApi(token){
	WiStormAPI.call(this,'feature',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'pid,name,show_name,go_id,go_name'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"name",
		page:"name",
		limit:"20"
	}
}
WBaseApi.prototype=new WiStormAPI();

//获取车辆品牌列表
WBaseApi.prototype.carBrand=function(callback,op){
	var OP=Object.assign({
		method:'wicare.carBrand.list',
		fields:'id,pid,name,url_icon,t_spell',
		id:">0",
		sorts:'t_spell',
		page:'t_spell',
		limit:-1
	},op);
	this.getApi(OP,callback);
}
//获取车系列表
WBaseApi.prototype.carSerie=function(callback,data){
	var OP={
		method:'wicare.carSerie.list',
		fields:'id,pid,name,show_name,go_id,go_name',
		sorts:"name",
		page:"name",
		limit:-1
	};
	Object.assign(OP,data);
	this.getApi(OP,callback);
}
//获取车型列表
WBaseApi.prototype.carType=function(callback,data){
	var OP={
		method:'wicare.carType.list',
		fields:'id,pid,name,show_name,go_id,go_name',
		sorts:"name",
		page:"name",
		limit:-1
	};
	Object.assign(OP,data);
	this.getApi(OP,function(res){
		if(res.data)
			res.data.map(e=>{
				e.name=e.go_name?e.name+' '+e.go_name:e.name;
				return e;
			});
		callback(res);
	});
}
//经纬度转地址
WBaseApi.prototype.geocoder=function(callback,data){
	data.method=this.apiName+'.geocoder';
	this.safetyGet(data,callback);
}

function WGps(token){
	WAPI.call(this,'_iotGpsData',token);
	this.get_op={
		fields:'did,uid,status,commType,commSign,model,hardwareVersion,softwareVersion,activedIn,expiredIn,activeGpsData,activeObdData,params,ip,port,binded,bindDate,vehicleName,vehicleId'//默认返回的字段
	}
	this.get_op={
		fields:"did,lon,lat,speed,direct,gpsFlag,mileage,fuel,temp,air,signal,voltage,status,alerts,gpsTime"
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"did,gpsTime",
		page:"",
		limit:"-1"
	}
	this._list=WiStormAPI.prototype.list;
}
WGps.prototype=new WAPI();//继承父类WiStormAPI

WGps.prototype.list=function(callback,data,op){
	// this._list(callback,data,op);
	let st=W.date(data.gpsTime.split('@')[0]);
	let et=W.date(data.gpsTime.split('@')[1]);
	let today=this._clearTime(new Date());
	let cst=this._clearTime(st);
	let that=this;
	if(today.getTime()==cst.getTime())
		this._list(callback,data,op);
	else if(st<today&&et>today){
		let D=Object.assign({},data);
		D.gpsTime=W.dateToString(st)+'@'+W.dateToString(today);
		this.getGpsList(function(res){
			let arr=res.data;
			let d=Object.assign({},data);
			d.gpsTime=W.dateToString(today)+'@'+W.dateToString(et);
			that._list(function(res) {
				res.data=arr.concat(res.data);
				callback(res);
			},d,op);
		},D);
	}else
		this.getGpsList(callback,data);
}
/**
 * 获取历史定位信息
 */
WGps.prototype.getGpsList=function(callback,data){
	let st=W.date(data.gpsTime.split('@')[0]);
	let et=W.date(data.gpsTime.split('@')[1]);
	let cst=this._clearTime(st);
	let day=Math.ceil((et.getTime()-cst.getTime())/24/60/60/1000);//跨了多少天
	if(day<0){
		callback({status_code:-2,err_mas:'Invalid Time Range'});
	}

	// if(day){
		let i=0;
		let datas=[];
		for(let i=0;i<day;i++){
			this.getGpsListOnday(function(res,j){
				if(!j||j==(day-1))
					res=res.filter(e=>{
						let t=W.date(e.gpsTime);
						return(t>=st&&t<=et);
					});
				datas.push({'i':j,data:res});
				if(datas.length>=day){
					let temData=[];
					datas.forEach(e=>temData[e.i]=e.data);//排序
					let data=[];
					temData.forEach(e=>data=data.concat(e));
					callback({data});
				}
			},data.did,cst,i,data.map);
			cst.setHours(cst.getHours()+24);
		}
	// }else{
	// 	//范围在同一天的
	// 	this.getGpsListOnday(function(res){
	// 		let data=res.filter(e=>{
	// 			let t=W.date(e.gpsTime);
	// 			return(t>=st&&t<=et);
	// 		});
	// 		callback({data});
	// 	},data.did,st);
	// }
	

	
}
WGps.prototype.getGpsListOnday=function(callback,did,date,index,map='BAIDU'){
	//http://web.file.myqcloud.com/files/v1/2016-09-13/696502000007496_2016-09-13.gz
	// let base_url='http://gpsdata-10013582.file.myqcloud.com/';
	let base_url='http://gpsdata-10013582.cos.myqcloud.com/';
	
	let today=W.dateToString(date).slice(0,10);
	let url=base_url+today+'/'+did+'_'+today+'.gz';
	W.get(url,null,function(res){
		if(!res){
			callback([],index);
			return;
		}
		var arr=res.split('\n');
		arr=arr.filter(e=>!!e);
		res=undefined;
		let keys=['gpsTime','rcvTime','lon','lat','speed','direct','gpsFlag','mileage','fuel','temp','status','alerts','g_lon','g_lat','c_lon','c_lat'];
		
		let a=arr.map(function(e,i) {
			let j=e.split('|');
			let d={};
			try {
				keys.forEach((e,i)=>d[e]=(j[i][0]=='['||j[i][0]=='{')?JSON.parse(j[i]):j[i]);
			} catch (error) {
				console.log(e,i);
			}
			if(map=='GOOGLE'){
				d.lon=d.g_lon;
				d.lat=d.g_lat;
			}
			return d;
		}, this);
		callback(a,index);
	},'text');
}

WGps.prototype._clearTime=function(date){
	let newDate=new Date(date.getTime());
	newDate.setHours(0);
	newDate.setMinutes(0);
	newDate.setSeconds(0);
	newDate.setMilliseconds(0);
	return newDate;
}

const Wapi={
    user:new WUserApi(_user?_user.access_token:null,_user?_user.session_token:null),
    developer:new WDeveloperApi(_user?_user.access_token:null),
    app:new WAppApi(_user?_user.access_token:null),
    table:new WTableApi(_user?_user.access_token:null),
    file:new WFileApi(_user?_user.access_token:null),
    comm:new WCommApi(_user?_user.access_token:null),
	role:new WRoleApi(_user?_user.access_token:null),
	page:new WPageApi(_user?_user.access_token:null),
	feature:new WFeatureApi(_user?_user.access_token:null),
	service:new WServiceApi(_user?_user.access_token:null),
	//以下为非核心功能表
	customer:new WAPI('customer',_user?_user.access_token:null),//客户表
	employee:new WAPI('employee',_user?_user.access_token:null),//员工表
	vehicle:new WAPI('vehicle',_user?_user.access_token:null),//车辆表
	device:new WAPI('_iotDevice',_user?_user.access_token:null),//终端表
	gps:new WGps(_user?_user.access_token:null),//定位数据表
	log:new WAPI('_iotLog',_user?_user.access_token:null),//日志数据表
	alert:new WAPI('_iotAlert',_user?_user.access_token:null),//警报数据表
	stat:new WAPI('_iotStat',_user?_user.access_token:null),//日统计数据表
	deviceLog:new WAPI('deviceLog',_user?_user.access_token:null),//设备出入库日志表
	deviceTotal:new WAPI('deviceTotal',_user?_user.access_token:null),//设备统计表
	//字典表
	department:new WAPI('department',_user?_user.access_token:null),//部门表
	custType:new WAPI('custType',_user?_user.access_token:null),//客户类型表
	area:new WAPI('area'),//地区表
	brand:new WAPI('brand',_user?_user.access_token:null),
	product:new WAPI('product',_user?_user.access_token:null),
	booking:new WAPI('booking'),
	base:new WBaseApi(_user?_user.access_token:null),
	papi:new Papi(),
	activity:new WAPI('activity',_user?_user.access_token:null),
};




function makeGetOp(name,fields,lop){
	Wapi[name].get_op={fields};
	Wapi[name].list_op={
		fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
	Object.assign(Wapi[name].list_op,lop);
}

makeGetOp('customer','objectId,uid,name,treePath,parentId,tel,custTypeId,custType,province,provinceId,city,cityId,area,areaId,address,contact,logo,sex,dealer_id,other');
makeGetOp('deviceLog','objectId,uid,did,type,createdAt,from,to');
makeGetOp('deviceTotal','custId,type,inNet,register,onLine,woGuanChe,zhangWoChe');
makeGetOp('vehicle','objectId,name,uid,departId,brandId,brand,model,modelId,type,typeId,desc,frameNo,engineNo,buyDate,mileage,maintainMileage,insuranceExpireIn,inspectExpireIn,serviceType,feeType,serviceRegDate,serviceExpireIn,did,drivers,managers');
makeGetOp('device','did,uid,status,commType,commSign,model,hardwareVersion,softwareVersion,activedIn,expiredIn,activeGpsData,activeObdData,params,ip,port,binded,bindDate,vehicleName,vehicleId,createdAt');
makeGetOp('alert','objectId,did,alertType,speedLimit,poild,lon,lat,speed,direct,mileage,fuel,createdAt');
makeGetOp('stat','did,day,distance,duration,fuel,avgSpeed,alertTotal,createdAt,day');
makeGetOp('department','objectId,name,uid,parentId,treePath,adminId',{limit:-1,sorts:'objectId',page:'objectId'});
makeGetOp('employee','objectId,uid,companyId,departId,type,name,sex,idcard,tel,email,wechat,licenseType,firstGetLicense,licenseExpireIn,isQuit');

makeGetOp('custType','id,name,appId,useType,userType,role,roleId',{limit:-1,sorts:'id',page:'id'});
makeGetOp('area','id,name,parentId,level,areaCode,zipCode,provinceId,provinceName',{limit:-1,sorts:'id',page:'id'});
makeGetOp('brand','objectId,name,company,uid',{limit:-1,sorts:'name',page:'name'});
makeGetOp('product','objectId,name,company,uid,brand,brandId',{limit:-1,sorts:'name',page:'name'});
makeGetOp('booking','mobile,sellerId,uid,status,status0,status1,status2,status3,name,carType,resTime,payTime,confirmTime,money,objectId,createdAt,updatedAt');
makeGetOp('activity','uid,type,name,url,status,reward,objectId,createdAt,updatedAt');



window.Wapi=Wapi;
export default Wapi;