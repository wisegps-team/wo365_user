/**
 * 支付接口api类
 * @constructor
 */
import WiStormAPI from'./WiStormAPI';
import config from'./config';

class WPayApi extends WiStormAPI {
    constructor(token) {
        super('pay',token,config.app_key,config.app_secret,{devKey:config.dev_key});
    }

    /**
     * 获取微信支付参数;
     * @param {Function} callback
     * @param {Object} data
     *           open_id: 微信用户OpenID(目前来说必须是智联车网的用户openid);
     *           uid: 用户ID;
     *           order_type: 订单类型: (1：购买  2：充值  3：提现  4：退款)
     *           remark: 产品描述;
     *           amount: 金额;
     * 
     * @returns 微信JSAPI支付参数
     *  */
    wxOrder(callback,data){
        var OP=Object.assign({},data);		
        OP.method=this.apiName+".weixin"; 		//接口名称
		this.getApi(OP,callback);
    }

    /**
     * 直接使用余额支付，安全性低,不宜前端调用
     * @param {Function} callback
     * 
     * @param {Object} data
     *      uid: 支付用户ID;
     *      to_uid: 收款用户ID, 如果为0, 则表示向平台支付
     *      bill_type: 交易类型: (1: 交易， 2: 充值 3: 扣费 4: 提现 5: 退款)
     *      amount: 金额;
     *      remark: 描述;
     */
    payBalance(callback,data){
        
    }
	
	/**
	 * 马上调起微信支付，必须在指定的目录下，目录的子目录中都不可以使用本方法，对于wx.autogps.cn,就是指http://wx.autogps.cn/autogps/
	 * @param {Function} callback 回调方法，因为不用跳转，所以支持匿名函数和普通函数
	 * @param {Object} data 微信下单接口返回的支付参数，或者是后台下单payWeixin接口所需要的数据(注意下单的open_id需要是智联车网公众号的open_id)
	 * @param {Boolean} isPayArgs 当本参数为trun，则会直接调用微信支付接口，否则则先调用下单接口，然后再调用支付
	 */
	wxPayNow(callback,data,isPayArgs){//微信调起支付
		if(isPayArgs)
			this._pay(callback,data);
		else{
			data._return=true;
			this.wxOrder(res=>{
				if(res.status_code){
					callback(res);
				}
				this._pay(callback,res.pay_args);
			},data);
		}
	}

	/**
	 * 封装微信支付，使返回的数据符合api的返回格式
	 */
	_pay(callback,data){
		WeixinJSBridge.invoke('getBrandWCPayRequest',data,function(res){
			let r={
				err_msg:res.err_msg
			};
			if(res.err_msg=="get_brand_wcpay_request：ok")//支付成功
				r.status_code=0
			else if(res.err_msg=="get_brand_wcpay_request：cancel")
				r.status_code=-1001;
			else if(res.err_msg=="get_brand_wcpay_request：fail")
				r.status_code=-1002;
			callback(r);
		});
	}

	/**
	 * 跳转到下单页面
	 * @param {Object} data 下单数据
	 * 				uid: 用户ID;
     *           	order_type: 订单类型: (1：购买  2：充值  3：提现  4：退款)
     *           	remark: 产品描述;
     *           	amount: 金额;
	 * 				title: 只展示，不参与下单
	 * @param {String} key 支付完返回时，需要传递给checkWxPay检查支付结果
	 * @param {String} link 可选，支付完成后的跳转链接，不传会退回当前页
	 */
	wxPay(data,key,link){
		//跳转确认订单页面
// let url=location.origin+'/order.php?key='+encodeURIComponent(key);

		//测试用
		WiStorm.config.wxAppKey='wxa5c196f7ec4b5df9';
		let url='http://'+WiStorm.config.domain.user+'/order.php?key='+encodeURIComponent(key);
		localStorage.setItem(key,JSON.stringify({
			err_msg :"get_brand_wcpay_request:cancel"
		}));//默认设置为未支付
		if(link)url+='&callback='+encodeURIComponent(link);
		if(data.psw)data.psw=this.md5(data.psw);
		for(let k in data){
			url+='&'+k+'='+encodeURIComponent(data[k]);
		}
		
		top.location="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WiStorm.config.wxAppKey+"&redirect_uri="+encodeURIComponent(url)+"&response_type=code&scope=snsapi_base&state=state#wechat_redirect";
    }

	/**
	 * @param {Function} callback 检查到有支付结果时调用的方法
	 * @param {String} key 调用wxPay时传入的key
	 */
	checkWxPay(callback,key){
		let res=localStorage.getItem(key);
		localStorage.removeItem(key);
		if(res){
			res=JSON.parse(res);
			let r=Object.assign({},res);
			if(res.err_msg=="get_brand_wcpay_request:ok")//支付成功
				r.status_code=0
			else if(res.err_msg=="get_brand_wcpay_request:cancel")
				r.status_code=-1001;
			else if(res.err_msg=="get_brand_wcpay_request:fail")
				r.status_code=-1002;
			callback(r);
			return true;
		}else
			return false;
	}
}

export default WPayApi;