import WiStormAPI from './WiStormAPI.js';
import config from './config.js';

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
 * 检查用户是否已注册（特指user表和customer都存在的情况
 * mobile: 手机号
 * username: 用户名
 * @param {Object} callback
 * @param {Object} data
 */
WUserApi.prototype.checkExists=function(callback,data){
	Wapi.serverApi.checkExists(callback,data);
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
	this.getApi(data,callback,OP);
}

/**
 * 获取用户账单列表
 * 参数:
 *     uid: 用户ID
 *	   start_time: 开始时间
 *	   end_time: 结束时间
 * @param {Object} callback
 * @param {Object} data 				
 * @param {Object} op
 */
WUserApi.prototype.getBillList=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	Object.assign(OP,op);
	OP.method="wicare.bill.list"; //接口名称
	this.getApi(data,callback,OP);
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

// 获取账户列表
//callback data:account_type, page, limit
WUserApi.prototype.getAccountList=function(callback,data,op){
	let OP=Object.assign({},op);
	OP.method="wicare.account.list"; //接口名称
	if(!OP.err){
		callback=W.err(callback);
	}
	delete OP.err;
	this.getApi(data,callback,OP);
}

WUserApi.prototype.getAccountTotal=function(callback,op){
	let OP=Object.assign({},op);
	OP.method="wicare.account.total"; //接口名称
	if(!OP.err){
		callback=W.err(callback);
	}
	delete OP.err;
	this.getApi(OP,callback);
}

export default WUserApi;