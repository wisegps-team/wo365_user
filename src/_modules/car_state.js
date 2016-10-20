const ALERT_SOS = 0x3001;              //紧急报警
const ALERT_OVERSPEED = 0x3002;        //超速报警
const ALERT_VIRBRATE = 0x3003;         //震动报警       
const ALERT_MOVE = 0x3004;             //位移报警       
const ALERT_ALARM = 0x3005;            //防盗器报警     
const ALERT_INVALIDRUN = 0x3006;       //非法行驶报警   
const ALERT_ENTERGEO = 0x3007;         //进围栏报警     
const ALERT_EXITGEO = 0x3008;          //出围栏报警     
const ALERT_CUTPOWER = 0x3009;         //断电报警       
const ALERT_LOWPOWER = 0x300A;         //低电压报警     
const ALERT_GPSCUT = 0x300B;           //GPS天线断路报警
const ALERT_OVERDRIVE = 0x300C;        //疲劳驾驶报警   
const ALERT_INVALIDACC = 0x300D;       //非法启动       
const ALERT_INVALIDDOOR = 0x300E;      //非法开车门  

// show_mode 
// 1: 车辆列表中
// 2: 实时监控中
// 3: 轨迹回放中
export function getStatusDesc(vehicle, show_mode) {
    /*
    离线，1--显示SIM卡号, 2--离线1个小时内小时显示“离线 <1小时“，超过1个小时，显示离线“离线 xx个小时”
    在线，有效定位，速度超过10公里，显示：行驶，其他状态 xx公里/小时，速度低于等于10公里，显示：静止，其他状态
    在线，无效定位，如果信号小于指定值，速度超过10公里，显示：盲区，速度低于等于10公里，显示：静止
    */
    var res={
        state:0,//0停止，1行驶，2离线，3装卸，4断电
        desc:'',
        speed:0,
        delay:0
    };
    var alerts=vehicle.activeGpsData.alerts;
    // 如果数据接收时间在10分钟以内，认为在线，否则为离线
    var now = new Date();
    // var rcv_time = W.date(vehicle.activeGpsData.rcv_time);
    var rcv_time = W.date(vehicle.activeGpsData.gpsTime);
    res.delay = parseInt(Math.abs(now - rcv_time) / 1000 / 60);//把相差的毫秒数转换为分钟
    if (show_mode == 3 || res.delay < 1440) {
        if(alerts.indexOf(ALERT_CUTPOWER) > -1){
            res.desc = ___.ALERT_CUTPOWER;
            res.state =4;
        }else if(alerts.indexOf(ALERT_SOS) > -1){
            res.desc = ___.ALERT_SOS;
            res.state =3;
        }else if(vehicle.activeGpsData.speed > 5){
            res.state =1;
            if(show_mode == 2||show_mode == 3){
                res.speed=parseInt(vehicle.activeGpsData.speed).toFixed(0);
                res.desc = ___.travel+" " + res.speed + "km/h";                
            }else{
                res.desc = ___.travel;
            }
        }else{
            res.desc = ___.stop;
        }
    } else {
        res.desc = ___.offline + parseInt(res.delay/ 60 / 24) + ___.day;
        res.state =2;        
    }
    return res;
}

export function getUniAlertsDesc(uni_alerts) {
    var desc = "";
    for (var i = 0; i < uni_alerts.length; i++) {
        switch (uni_alerts[i]) {
            case ALERT_SOS: desc += ","+___.ALERT_SOS; break;
            case ALERT_OVERSPEED: desc += ","+___.ALERT_OVERSPEED; break;
            case ALERT_VIRBRATE: desc += ","+___.ALERT_VIRBRATE; break;
            case ALERT_MOVE: desc += ","+___.ALERT_MOVE; break;
            case ALERT_ALARM: desc += ","+___.ALERT_ALARM; break;
            case ALERT_INVALIDRUN: desc += ","+___.ALERT_INVALIDRUN; break;
            case ALERT_ENTERGEO: desc += ","+___.ALERT_ENTERGEO; break;
            case ALERT_EXITGEO: desc += ","+___.ALERT_EXITGEO; break;
            case ALERT_CUTPOWER: desc += ","+___.ALERT_CUTPOWER; break;
            case ALERT_LOWPOWER: desc += ","+___.ALERT_LOWPOWER; break;
            case ALERT_GPSCUT: desc += ","+___.ALERT_GPSCUT; break;
            case ALERT_OVERDRIVE: desc += ","+___.ALERT_OVERDRIVE; break;
            case ALERT_INVALIDACC: desc += ","+___.ALERT_INVALIDACC; break;
            case ALERT_INVALIDDOOR: desc += ","+___.ALERT_INVALIDDOOR; break;
        }
    }
    return desc;
}


export function getAllState(data){
    let res=getStatusDesc(data,2);
    
    let f=parseInt(data.activeGpsData.signal/5);
    f=(f>4)?4:f;
    f=(f<1)?1:f;
    let ft=[___.d,___.d,___.c,___.b,___.a];
    res.signal_desc=ft[f];
    res.signal_l=f;
    res.status_desc=(data.activeGpsData.status.indexOf(8196)!=-1)?___.start_up:___.flameout;
    res.gps_time=W.dateToString(W.date(data.activeGpsData.gpsTime));
    return res;
}