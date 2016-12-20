/**
 * 关于原生工具（如二维码扫描，分享等等），在本地应用使用的是html5+提供的工具；
 * 在微信端调用的是微信的jssdk（即微信原生扫描），因为调用jssdk需要引入微信的js文件，以及配置相关信息，
 * 所以并不能马上使用，而需等待window的nativeSdkReady事件，如果是用户交互而调用，则可以通过判断W.native是否存在来确定是否可以使用；
 */

W._nativeSdkReady=function(){
	W.native={};
	if(WiStorm.agent.weixin){//微信sdk加载完，封装微信sdk，使之与html5+统一
		W.native.scanner={//微信二维码扫描
			start:function(callback){
				wx._scanner_callback=callback;
				wx.scanQRCode({
					needResult: 1,
					desc: 'scanQRCode desc',
					success: function(res) {
						wx._scanner_callback(res.resultStr);
					}
				});
			}
		};
		W.native.close=wx.closeWindow;//关闭窗口
	}else{
		W.plus.scanner=window.plus.scanner;
	}

	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("nativeSdkReady", false, false);
	window.dispatchEvent(evt);//触发window的nativeSdkReady事件
}

if(WiStorm.agent.weixin){//如果是微信端
	W.sha1=new function(){var m=0;var a="";var j=8;this.hex_sha1=function(o){return l(d(h(o),o.length*j))};this.b64_sha1=function(o){return k(d(h(o),o.length*j))};this.str_sha1=function(o){return c(d(h(o),o.length*j))};this.hex_hmac_sha1=function(o,p){return l(n(o,p))};this.b64_hmac_sha1=function(o,p){return k(n(o,p))};this.str_hmac_sha1=function(o,p){return c(n(o,p))};function g(){return hex_sha1("abc")=="a9993e364706816aba3e25717850c26c9cd0d89d"}function d(E,y){E[y>>5]|=128<<(24-y%32);E[((y+64>>9)<<4)+15]=y;var F=Array(80);var D=1732584193;var C=-271733879;var B=-1732584194;var A=271733878;var z=-1009589776;for(var s=0;s<E.length;s+=16){var v=D;var u=C;var r=B;var q=A;var o=z;for(var p=0;p<80;p++){if(p<16){F[p]=E[s+p]}else{F[p]=f(F[p-3]^F[p-8]^F[p-14]^F[p-16],1)}var G=i(i(f(D,5),b(p,C,B,A)),i(i(z,F[p]),e(p)));z=A;A=B;B=f(C,30);C=D;D=G}D=i(D,v);C=i(C,u);B=i(B,r);A=i(A,q);z=i(z,o)}return Array(D,C,B,A,z)}function b(p,o,r,q){if(p<20){return(o&r)|((~o)&q)}if(p<40){return o^r^q}if(p<60){return(o&r)|(o&q)|(r&q)}return o^r^q}function e(o){return(o<20)?1518500249:(o<40)?1859775393:(o<60)?-1894007588:-899497514}function n(q,t){var s=h(q);if(s.length>16){s=d(s,q.length*j)}var o=Array(16),r=Array(16);for(var p=0;p<16;p++){o[p]=s[p]^909522486;r[p]=s[p]^1549556828}var u=d(o.concat(h(t)),512+t.length*j);return d(r.concat(u),512+160)}function i(o,r){var q=(o&65535)+(r&65535);var p=(o>>16)+(r>>16)+(q>>16);return(p<<16)|(q&65535)}function f(o,p){return(o<<p)|(o>>>(32-p))}function h(r){var q=Array();var o=(1<<j)-1;for(var p=0;p<r.length*j;p+=j){q[p>>5]|=(r.charCodeAt(p/j)&o)<<(24-p%32)}return q}function c(q){var r="";var o=(1<<j)-1;for(var p=0;p<q.length*32;p+=j){r+=String.fromCharCode((q[p>>5]>>>(24-p%32))&o)}return r}function l(q){var p=m?"0123456789ABCDEF":"0123456789abcdef";var r="";for(var o=0;o<q.length*4;o++){r+=p.charAt((q[o>>2]>>((3-o%4)*8+4))&15)+p.charAt((q[o>>2]>>((3-o%4)*8))&15)}return r}function k(r){var q="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var t="";for(var p=0;p<r.length*4;p+=3){var s=(((r[p>>2]>>8*(3-p%4))&255)<<16)|(((r[p+1>>2]>>8*(3-(p+1)%4))&255)<<8)|((r[p+2>>2]>>8*(3-(p+2)%4))&255);for(var o=0;o<4;o++){if(p*8+o*6>r.length*32){t+=a}else{t+=q.charAt((s>>6*(3-o))&63)}}}return t}};
	
	W.wx={
		getNonceStr : function() {
			var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			var j = W.wx.getRandomNum(6, 32);
			var str = "";
			for (var i = 0; i < j; i++) {
				str += chars[W.wx.getRandomNum(0, 35)];
			}
			return str;
		},
		getRandomNum : function(Min, Max) {
			var Range = Max - Min;
			var Rand = Math.random();
			return (Min + Math.round(Rand * Range));
		},
		makeSign : function(nonceStr,timestamp){
			var str="jsapi_ticket="+W.wx.ticket+"&noncestr="+nonceStr+"&timestamp="+timestamp+"&url=";
			var url=location.href.split("#")[0];
			str+=url;
			return W.sha1.hex_sha1(str);
		},
		onload:function(){//加载完js之后，开始配置jssdk
			if(W.wx.ticket){//如果有ticket,则开始配置微信sdk
				var times=parseInt(new Date().getTime()/1000);
				var nonce=W.wx.getNonceStr();
				wx.config({
				    debug: WiStorm.debug, // 是否开启调试模式,调用的所有api的返回值会在客户端alert出来
				    appId: WiStorm.config.wx_app_id, // 公众号的唯一标识
				    timestamp: times, // 生成签名的时间戳
				    nonceStr: nonce, // 生成签名的随机串
				    signature: W.wx.makeSign(nonce,times),// 签名
				    jsApiList: [						
				    	'checkJsApi',
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo',
						'onMenuShareQZone',
						'hideMenuItems',
						'showMenuItems',
						'hideAllNonBaseMenuItem',
						'showAllNonBaseMenuItem',
						'translateVoice',
						'startRecord',
						'stopRecord',
						'onVoiceRecordEnd',
						'playVoice',
						'onVoicePlayEnd',
						'pauseVoice',
						'stopVoice',
						'uploadVoice',
						'downloadVoice',
						'chooseImage',
						'previewImage',
						'uploadImage',
						'downloadImage',
						'getNetworkType',
						'openLocation',
						'getLocation',
						'hideOptionMenu',
						'showOptionMenu',
						'closeWindow',
						'scanQRCode',
						'chooseWXPay',
						'openProductSpecificView',
						'addCard',
						'chooseCard',
						'openCard'] // 需要使用的js接口
				});
				wx.ready(W._nativeSdkReady);
				wx.error(function(res){
					res;
				});
			}
			W.wx.loaded=true;//标记微信sdk的js文件已经加载完
		}
	};
	
	var script=document.createElement("script");
	script.onload=W.wx.onload;//加载完js
	script.src=WiStorm.config.wx_sdk;
	W("head").appendChild(script);
	
//	W.wx.ticket=W.getCookie("wxTicket");//获取jssdk的ticket，调用任何api都需要用到
	if(!W.wx.ticket){//ticket过期，则重新获取ticket
		W.getJSON(WiStorm.config.wx_ticket_url,{HTTP_HOST:location.host},
			function(data){
				W.wx.ticket=data.ticket;
				var expires=-parseInt(data.expires/60);//计算有效时间，转换成分钟
				W.setCookie("wxTicket",data.ticket,expires);//保存到cookie里
				if(W.wx.loaded){//如果此时已经加载完微信的jssdk，则马上执行配置方法
					W.wx.onload();
				}
			}
		);
	}
}else{
	W.plusReady(W._nativeSdkReady);
}

	