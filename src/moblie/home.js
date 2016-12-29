/**
 * 08/03
 * 小吴
 * 管理平台的主页，主要功能是 按用户权限展示功能模块的入口
 */
"use strict";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import {Provider,connect} from 'react-redux';

import ActionSupervisorAccount from 'material-ui/svg-icons/action/supervisor-account';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ActionWork from 'material-ui/svg-icons/action/work';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import HardwareKeyboard from 'material-ui/svg-icons/hardware/keyboard';
import ActionAssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import ActionTurnedInNot from 'material-ui/svg-icons/action/turned-in-not';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionList from 'material-ui/svg-icons/action/list';
import IconButton from 'material-ui/IconButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';

import STORE from '../_reducers/main';
import {ACT} from '../_reducers/monitor';
import DeviceList from '../_component/device_list';
import Map from '../_component/map';
import Sonpage from '../_component/base/sonPage';

require('../_sass/home.scss');

// //加载各种字典数据,权限啊等等
// function loadDictionary(){
//     STORE.dispatch(department_act.get({uid:_user.customer.objectId}));//部门
// }
// loadDictionary();

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
        <ConnectAPP/>
        </Provider>,thisView);
});


const sty={
    icon:{
        height: '34px',
        width: '34px',
        fill:  '#42A5F5'
    },
    tabs:{
        position: 'fixed',
        width: '100vw',
        bottom: '0px'
    },
    w:{width:'100%',height: 'calc(100vh - 50px)'}
}

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            deviceListOpen:false
        }
        this.showDeviceList = this.showDeviceList.bind(this);
    }
    componentDidMount() {
        STORE.dispatch(ACT.fun.getPos(this.props.cars));
    }
    
    
    getChildContext() {
        return {
            view:thisView
        };
    }
    go(tab){
        thisView.goTo(tab.props.value+'.js');
    }
    showDeviceList(){
        thisView.goTo('car_manage.js');
        // this.setState({deviceListOpen:!this.state.deviceListOpen});
    }
    render() {
        return (
            <ThemeProvider>
                <AppBar
                    iconElementRight={<IconButton onClick={this.showDeviceList}>
                        <ActionList style={{
                            width:'32px',
                            height:'32px'
                        }}/>
                    </IconButton>}
                />
                <Map 
                    id='monitor_map' 
                    style={sty.w} 
                    cars={this.props.cars} 
                />
                <Sonpage open={this.state.deviceListOpen} back={this.showDeviceList}>
                    <DeviceList/>
                </Sonpage>
            </ThemeProvider>
        );
    }
}

App.childContextTypes = {
    view: React.PropTypes.object
};

const ConnectAPP=connect(function select(STATE) {
    let state={
        cars:STATE.cars
    };
    return state;
})(App);
