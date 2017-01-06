
export const ACT ={
    action:{
        SELECT_CAR:'SELECT_CAR',
        GET_POS:'get_pos',
        GETED_POS:'GETED_POS',
        GETED_DEVICES:'GETED_DEVICES',
        GETED_CARS:'GETED_CARS',
        // GETED_DEVICES:'GETED_DEVICES'
    },
    fun:{
        selectCar:function (car) {
            return {type: ACT.action.SELECT_CAR,car};
        },
        getCars:function () {//异步获取车辆资料,所以是返回一个方法而不是一个json
            return function(dispatch) {
                Wapi.vehicle.list(res=>{
                    let cars=res.data;
                    dispatch(ACT.fun.getedCars(cars));
                    // let device_ids=cars.map(car=>car.did);
                    if(cars&&cars.length)
                        dispatch(ACT.fun.getPos(cars));
                },{
                    uid:_user.customer.objectId
                },{
                    limit:'-1'
                });
            }
        },
        getedCars:function (data) {
            return {type: ACT.action.GETED_CARS,data};
        },
        // getedDevices:function (data) {
        //     return {type: ACT.action.GETED_DEVICES,data};
        // },
        getPos:function(cars){
            return function(dispatch) {
                cars.forEach((d,i)=>{//如果有多辆车，避免同时发出多个请求，使用延时发送
                    setTimeout(function(){
                        Wapi.papi.getPosition(function(res){
                            if(res.error&&res.error!=22002){
                                W.alert(___.papi_error[res.error]);
                                return;
                            }
                            let device={
                                did:d.did,
                                pos:res.data
                            };
                            device.pos.gpsTime=device.pos.time.Value;
                            dispatch(ACT.fun.getedPos(device));
                        },{
                            map:0,
                            did:d.did,
                            err:true //不使用默认处理返回错误
                        });
                    },i*300);//300毫秒请求一辆车
                });
                if(!ACT.fun.getPos._id)//只能有一次轮询
                    ACT.fun.getPos._id=setTimeout(()=>{
                        ACT.fun.getPos._id=0;
                        dispatch(ACT.fun.getPos(cars))
                    },20000);//10秒轮询
            }
        },
        getedPos:function(device){
            return {type: ACT.action.GETED_POS,data:device};
        }
    }
};


var obj_ids=[];//全部车辆的id
let cars=[];


export function carsReducer(state = [], action) {
    let newState;
    switch (action.type) {
        case ACT.action.GETED_POS://获取到某个车辆的位置数据
            let dev=state.find(e=>(e.did==action.data.did));
            if(dev){
                dev=Object.assign({},dev);
                dev._device=Object.assign({},dev._device);
                dev._device.activeGpsData=Object.assign({},action.data.pos);
                
                newState=state.map(d=>{
                    if(d.did==dev.did)
                        return dev;
                    else
                        return d;
                });
            }
            return newState;
        case ACT.action.GETED_CARS://获取到车辆数据
            let carsArr=action.data||[];
            return carsArr;
        // case ACT.action.GETED_DEVICES:
        //     state.forEach(car=>{
        //         car._device=action.data.find(d=>(d.did==car.did));//匹配上
        //     });
        //     return state.concat();
        default:
            return state
    }
}

export function selectCarReducer(state = {}, action) {
    switch (action.type) {
        case ACT.action.SELECT_CAR:
            return action.car;
        default:
            return state;
    }
}