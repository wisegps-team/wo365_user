import WiStormAPI from './WiStormAPI.js';

/**
 * 服务器转发
 */
class Papi {
	constructor(props, context) {
		this.url='http://localhost:8080/test/papi.php?method=';
		this.ajax=WiStormAPI.prototype.ajax;
	}
	api(url,data={},callback,type='get',dataType='json'){
        let success;
        if(data._err){
            delete data._err;
            success=callback;
        }else{
            success=function(res){
                if(res.error){
					W.alert(___.papi_error[res.error]);
                }else
                    callback(res);
            }
        }
		let opt={
			data,
			dataType,
			type,//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success,
			error:function(xhr,type,errorThrown){//异常处理；
				throw ("apiError:"+type);
			}
		}

		this.ajax(url,opt);
	}

	/**
	 * 登录
	 * data {
	 * 		account:1555,
	 * 		password:123456
	 * }
	 */
	login(callback,data){
		let url=this.url+'login';
		let D={
			phone:data.account,
			pswd:data.password
		};

		this.api(url,D,callback,'post');
	}

	/**
	 * 注册
	 * 	data{
	 * 		mobile:1375555,
	 * 		password:123456,
	 * 		did:565454655
	 * 	}
	 */
	register(callback,data){
		let url=this.url+'createaccountbindimei';
		let D={
			phone:data.mobile,
			pswd:data.password,
			imei:data.did
		};

		this.api(url,D,callback,'post');
	}

	/**
	 * 修改密码
	 * 	data{
	 * 		account:13564564,
	 * 		password:123456,
	 * 		oldpwd:1234
	 * }
	 */
	resetPassword(callback,data){
		let url=this.url+'updatepassword';
		let D={
			phone:data.account,
			newpswd:data.password,
			oldpswd:data.oldpwd
		};

		this.api(url,D,callback,'post');
	}

	/**
	 * 绑定设备
	 * data{
	 * 		mobile:13564564,
	 * 		did:123456,
	 * }
	 */
	deviceBind(callback,data){
		let url=this.url+'devicebind';
		let D={
			mobile:data.mobile,
			imei:data.did
		};

		this.api(url,D,callback,'post');
	}

	/**
	 * 解绑设备
	 * data{
	 * 		mobile:13564564,
	 * 		did:123456,
	 * }
	 */
	deviceBind(callback,data){
		let url=this.url+'deviceunbind';
		let D={
			mobile:data.mobile,
			imei:data.did
		};

		this.api(url,D,callback,'post');
	}

	/**
	 * 获取当前经纬度
	 * data{
	 * 		map:0,
	 * 		did:123456,
	 * }
	 */
	getPosition(callback,data){
		let url=this.url+'getdeviceposition';
		let D={
			map:data.map,
			imei:data.did
		};

		this.api(url,D,callback,'get');
	}

	/**
	 * 历史轨迹
	 * data{
	 * 		map:0,
	 * 		did:123456,
	 *		date: 查询日期(只能按天查询，日期格式2016-04-07)
	 * }
	 */
	getwheelpath(callback,data){
		let url=this.url+'getwheelpath';
		let D={
			map:data.map,
			date:data.date,
			imei:data.did
		};

		this.api(url,D,callback,'get');
	}

	/**
	 * 远程设置防盗
	 * data{
	 * 		steal:震动防盗灵敏度，只能为(0,1,2)中的一个值，('0':'低','1':'中','2':'高')
	 *		alertdelay:震动报警延迟设定值，只能为(0,10,20,30,40,50,60)中的一个值，单位为秒
	 * 		did:123456,
	 * }
	 */
	remoteConfig(callback,data){
		let url=this.url+'remoteconfig';
		let D={
			steal:data.steal,
			alertdelay:data.alertdelay,
			imei:data.did
		};

		this.api(url,D,callback,'get');
	}
}

export default Papi;