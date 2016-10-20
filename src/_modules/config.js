/**
 * 关于项目所有的配置
 */
const CONFIG={}

//本地测试时使用
console.debug(
W.setCookie('_app_config_','{"smsEngine":{"emay":{"host":"sdk999ws.eucp.b2m.cn","port":8080,"cdkey":"9SDK-EMY-0999-JCXUR","password":"512967"}},"devKey":"86e3ddeb8db36cbf68f10a8b7d05e7ac","devSecret":"b4c36736d48a1cdf5bb0b7e8c0d0e3a4","objectId":770933352235667500,"desc":"\u8f66\u8f86\u76d1\u63a7\u7ba1\u7406\u5e73\u53f0","name":"\u6c83\u7ba1\u8f66\u7528\u6237\u5e73\u53f0","enterUrl":"\/wo365\/index.html","devId":763995219921342500,"sid":770811593507344400,"appKey":"3cea92bd76089d5ebea86613c8dbd068","appSecret":"000daf0bd5827b47e3fbd861ad4fcbb2","wxAppKey":"wxa59f6d089fdef4fe"}',30)
);

let keys=W.getCookie('_app_config_');
try {
    keys=JSON.parse(keys);
    Object.assign(CONFIG,keys);
    ___.app_name=CONFIG.name;
} catch (error) {
    alert('app key error');
}


export default CONFIG;