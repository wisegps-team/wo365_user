

export const ACT ={
    action:{
        SELECT_CAR:'SELECT_CAR',
        GET_CARS:'GET_CARS',
        GETED_CARS:'GETED_CARS',
        GETED_DEVICES:'GETED_DEVICES'
    },
    fun:{
        selectCar:function (car) {
            return {type: ACT.action.SELECT_CAR,car};
        }
    }
};