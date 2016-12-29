/**
 * 通用工具函数
 */

/**
 * 获取随机字符串
 * @param {Number} len 字符串长度，默认值为32
 */
export function randomStr(len=32){
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　　var maxPos = chars.length;
　　var pwd = '';
　　for (let i = 0; i < len; i++) {
　　　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
/**
 * 预处理条码，切除多余信息
 */
export function reCode(code){
    if(code.indexOf(',')!=-1){
        return code.split(',')[1];
    }else
        return code;
}

/**
 * 获取部门名称
 */
export function getDepart(departId){
    let departs=STORE.getState().department;
    let _depart=departs.find(item=>item.objectId==departId);
    let _departName='';
    if(_depart)_departName=_depart.name;
    return _departName;
}

/**
 * 获取部门以及所有子孙部门的id
 * @param {Object} data 包含children的部门信息
 * @returns {Array} ids 所有子孙部门的id
 */
export function getAllChild(data){
    let ids=[data.objectId];
    if(data.children){
        data.children.forEach(e=>ids=ids.concat(getAllChild(e)));
    }
    return ids;
}


export function makeRandomEvent(obj){
    let key=randomStr();
    let o={};
    for(let k in obj){
        o[k]=key+obj[k];
    }
    return o;
}

/**
 * 返回保存当前域名openId的key名,域名中的点符号“.”使用下划线“_”替换，并且在最后加上“_openId”
 * 例如 wx_autogps_cn_openId
 *  */
export function getOpenIdKey(host){
    if(!host)
        host=location.host;
    host=host.replace(/\./g,'_');
    return host+'_openId';
}