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
thisView.setTitle(___.zhilianche);
thisView.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
        <ConnectAPP/>
        </Provider>,thisView);
    if(_g.loginLocation){
        thisView.goTo(_g.loginLocation+'.js');
    }
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
    w:{width:'100%',height: 'calc(100vh - 200px)'},
    head:{
        width:'100%',
        height:'180px',
        display:'block',
        textAlign:'center',
        paddingTop:'20px',
        // backgroundColor:'#33ccee',
        backgroundColor:'#3c9bf9',
        color:'#ffffff'
    },
    head_pic:{
        width:'100px',
        height:'100px', 
        borderRadius:'50%'
    },
    head_links:{
        display:'table',
        width:'100%',
        marginTop:'15px'
    },
    head_link:{
        display:'table-cell',
        width:'33%',
        borderRight:'1px solid #ffffff'
    }
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
        STORE.dispatch(ACT.fun.getCars());
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
    personalInfo(){
        thisView.goTo('./myAccount/personal_info.js');
    }
    recommend(){
        thisView.goTo('my_marketing.js');
    }
    wallet(){
        thisView.goTo('./myAccount/wallet.js');
    }
    toBillList(){
        thisView.goTo('./myAccount/my_order.js');
    }
    render() {
        // let name='_user.customer.name';
        let name = null;
        if(_user.customer){
            name=_user.customer.name
        }
        // let ;
        if(_user.employee){
            name=_user.employee.name;
        }
        if(_user.customer){
            if(_user.customer.custTypeId!=7){
                name=_user.customer.contact;
            } 
        }
        return (
            <ThemeProvider>
                {/*<AppBar
                    iconElementRight={<IconButton onClick={this.showDeviceList}>
                        <ActionList style={{
                            width:'32px',
                            height:'32px'
                        }}/>
                    </IconButton>}
                />*/}
                <div style={sty.head} >
                    <div style={{fontSize:'18px'}} onClick={this.personalInfo}>
                        <img src='../../img/head.png' style={sty.head_pic}/>
                        <div>
                            {name}
                        </div>
                    </div>
                    <div style={sty.head_links}>
                        <div style={sty.head_link} onClick={this.toBillList}>{___.order}</div>
                        <div style={sty.head_link} onClick={this.recommend}>{___.recommend}</div>
                        <div style={{display:'table-cell',width:'33%'}} onClick={this.wallet}>{___.wallet}</div>
                    </div>
                </div>
                <Map 
                    id='monitor_map' 
                    style={sty.w} 
                    cars={this.props.cars} 
                    active={this.props.select_car} carClick={carClick}
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
    let state=Object.assign({},STATE);
    return state;
})(App);

function  carClick(data) {
    STORE.dispatch(ACT.fun.selectCar(data));
    late(()=>thisView.goTo('home.js'));
}

function late(fun) {
    setTimeout(fun,1000);
}