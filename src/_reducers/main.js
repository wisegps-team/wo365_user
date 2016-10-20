import {Redux,createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import {carsReducer,selectCarReducer} from './monitor';

const initialState = {
    devices:_user.devices.map(e=>{return{did:e}})
};

function main(state = initialState, action) {
    return {
        devices:carsReducer(state.devices,action)
    };
}





let STORE=createStore(
    main,
    applyMiddleware(//应用中间件，为了可以使用异步action
        thunkMiddleware //为了可以使用异步action
    )
);

window.STORE=STORE;



export default STORE;