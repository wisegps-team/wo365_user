/**
 * 关于项目所有的配置
 */
const CONFIG={}

//本地测试时使用
console.debug(
W.setCookie('_app_config_','{"smsEngine":{"weixin":{"sdkappkey":"e50b94fbd56a595484e9c6f6f744567f","sdkappid":"1400017134"}},"devKey":"86e3ddeb8db36cbf68f10a8b7d05e7ac","devSecret":"b4c36736d48a1cdf5bb0b7e8c0d0e3a4","objectId":798339854114099200,"desc":"\u667a\u8054\u8f66\u7f51\u7528\u6237\u5e73\u53f0","enterUrl":"\/wo365_user\/index.html","name":"\u667a\u8054\u8f66\u7f51\u7528\u6237\u5e73\u53f0","devId":763995219921342500,"appKey":"5775b54f2e44e702a4c975c064ec2efd","appSecret":"46f011a3b2503226c5f3a55a56e9ac05","wxAppKey":"wx76f1169cbd4339c1","sid":798373295236976600}',30)
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