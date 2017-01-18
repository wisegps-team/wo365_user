
export const ACT ={
    action:{
        SELECT_CAR:'SELECT_CAR',
        SELECT_USERS:'SELECT_USERS',
        SELECT_DEPART_ADD:'SELECT_USERS_ADD',
        SELECT_DEPART_DELETE:'SELECT_USERS_DELETE',
        SHOW_CARS:'SHOW_CARS',
        GET_USERS:'GET_USERS',
        GET_CARS:'GET_CARS',
        GETED_USERS:'GETED_USERS',
        GETED_CARS:'GETED_CARS',
        GETED_DEVICES:'GETED_DEVICES'
    },
    'const':{
        all:'ALL'
    },
    fun:{
        selectCar:function (car) {
            return {type: ACT.action.SELECT_CAR,car};
        },
        selectDepartAdd:function(id){//添加select_users里的用户(其实是部门)
            return {type: ACT.action.SELECT_DEPART_ADD,id};
        },
        selectDepartDelete:function(id){//删除select_users里的用户(其实是部门)
            return {type: ACT.action.SELECT_DEPART_DELETE,id};
        },
        showCars:function(cars){
            return {type: ACT.action.SHOW_CARS,cars};
        },
        getCars:function () {//异步获取车辆资料,所以是返回一个方法而不是一个json
            return function(dispatch) {
                Wapi.vehicle.list(res=>{
                    let cars=res.data;
                    // cars[0].did='459432808549928';//测试写死
                    dispatch(ACT.fun.getedCars(cars));
                    let device_ids=cars.map(car=>car.did);
                    dispatch(ACT.fun.getDevices(cars));
                },{
                    uid:_user.customer.objectId
                    // uid:'802394552395763700'//测试用
                },{
                    limit:'-1'
                })
            }
        },
        getDevices:function(cars){
            return function(dispatch) {
                let device_ids=cars.map(car=>car.did);
                device_ids=device_ids.filter(e=>!!e);
                Wapi.device.list(function(res){
                    var devices=res.data;
                    dispatch(ACT.fun.getedDevices(devices));
                    if(!ACT.fun.getDevices._id)//只能有一次轮询
                        ACT.fun.getDevices._id=setTimeout(()=>{
                            ACT.fun.getDevices._id=0;
                            dispatch(ACT.fun.getDevices(cars))
                        },10000);//10秒轮询
                },{
                    did:device_ids.join('|'),
                    // did:'459432808549928',//测试写死
                    map:WiStorm.config.map
                },{
                    limit:'-1'
                })
            }
        },
        startGetCars:function () {
            return {type: ACT.action.GET_CARS};
        },
        getedUsers:function (data) {
            return {type: ACT.action.GETED_USERS,data};
        },
        getedCars:function (data) {
            return {type: ACT.action.GETED_CARS,data};
        },
        getedDevices:function (data) {
            return {type: ACT.action.GETED_DEVICES,data};
        }
    }
};


var obj_ids=[];//全部车辆的id
let cars=[];


export function carsReducer(state = [], action) {
    let newState;
    switch (action.type) {
        case ACT.action.GETED_CARS://获取到车辆数据
            let arr=action.data;
            arr.forEach((ele)=>{
                obj_ids.push(ele.obj_id);
            });
            cars=action.data;
            return action.data;
        case ACT.action.GETED_DEVICES:
            state.forEach(car=>{
                car._device=action.data.find(d=>(d.did==car.did));//匹配上
            });
            return state.concat();
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