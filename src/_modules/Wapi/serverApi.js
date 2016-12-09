/**
 * 可操作服务器资源，例如在服务器上存文件
 */
import WiStormAPI from './WiStormAPI.js';

class ServerApi{
    constructor(props, context) {
		this.url='http://wx.autogps.cn/server_api.php';
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
		this.get(data,callback);
	}

	addAndBind(callback,data){
		data.method='addAndBind';
		this.get(data,callback);
	}
}

export default ServerApi;