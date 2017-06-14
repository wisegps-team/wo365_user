/**
 * 可操作服务器资源，例如在服务器上存文件
 */
import WiStormAPI from './WiStormAPI.js';

class ServerApi{
    constructor(props, context) {
		// this.url = 'http://h5test.bibibaba.cn/server_api.php'
		this.url='https://h5.bibibaba.cn/server_api.php';
		// this.url='http://192.168.3.233:8080/test/server_api.php';
		this.ajax=WiStormAPI.prototype.ajax;
	}
    get(data={},success,dataType='json'){
		let opt={
			data,
			dataType,
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success,
			error:function(xhr,type,errorThrown){//异常处理；
				throw ("apiError:"+type);
			}
		}

		this.ajax(this.url,opt);
	}
    saveConfigFile(callback,data){
        data.method='wx_config_file';
		this.get(data,callback);
    }

	getAnyQrcode(callback,data){
        data.method='getAnyQrcode';
		this.get(data,callback);
    }

	sendWeixinByTemplate(callback,data){
		data.data=encodeURIComponent(JSON.stringify(data.data));
		data.link=encodeURIComponent(data.link);
		data.method=data.wxAppKey?'sendWeixinByTemplate':'sendWeixinByUid';
		this.get(data,callback);
	}

	getInstallByUid(callback,data){
		data.method='getInstallByUid';
		this.get(data,callback);
	}
	
	getUserOpenId(callback,data){
		data.method='getUserOpenId';
		this.get(data,callback);
	}

	setWxTemplate(callback,data){
		data.method='setWxTemplate';
		this.get(data,callback);
	}

	getUserOpenId(callback,data){
		data.method='getUserOpenId';
		this.get(data,callback);
	}

	checkExists(callback,data){
		data.method='checkExists';
		data.appId=WiStorm.config.objectId;
		this.get(data,callback);
	}
	
	addAndBind(callback,data){
		data.method='addAndBind';
		this.get(data,callback);
	}
	setMenu(callback,data){
		data.method='setMenu';
		this.get(data,callback);
	}

	getBrand(callback,data){
		data.method='getBrand';
		this.get(data,callback);
	}
	getWeixinKey(callback,data){
		data.method='getWeixinKey';
		this.get(data,callback);
	}
	bindOpenId(callback,data){
		data.method='bindOpenId';
		data.host=location.host;
		this.get(data,callback);
	}
	getDevice(callback,data){
		data.method='getDevice';
		this.get(data,callback);
	}
	checkVehicleExists(callback,data){
		data.method='checkVehicleExists';
		this.get(data,callback);
	}
	getUserWeixinKey(callback,data){
		data.method='getUserWeixinKey';
		this.get(data,callback);
	}
	getMoveCarInfo(callback,data){
		data.method='getMoveCarInfo';
		this.get(data,callback);
	}
}

export default ServerApi;