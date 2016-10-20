import { ACT } from './device_actions';

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