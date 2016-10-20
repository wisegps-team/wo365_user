/**
 * 08/03
 * 小吴
 * 管理平台的主页，主要功能是 按用户权限展示功能模块的入口
 */
"use strict";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';
import {Tabs, Tab} from 'material-ui/Tabs';

import ActionSupervisorAccount from 'material-ui/svg-icons/action/supervisor-account';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ActionWork from 'material-ui/svg-icons/action/work';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import HardwareKeyboard from 'material-ui/svg-icons/hardware/keyboard';
import ActionAssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import ActionTurnedInNot from 'material-ui/svg-icons/action/turned-in-not';
import ActionHome from 'material-ui/svg-icons/action/home';

import AreaSelect from '../_component/base/areaSelect';
import SexRadio from '../_component/base/sexRadio';
import ModuleCard from '../_component/base/moduleCard';

import STORE from '../_reducers/main';
import {user_type_act,brand_act,department_act} from '../_reducers/dictionary';

require('../_sass/home.scss');

//加载各种字典数据,权限啊等等
function loadDictionary(){
    STORE.dispatch(department_act.get({uid:_user.customer.objectId}));//部门
}
loadDictionary();

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
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
    }
}

class App extends Component {
    getChildContext() {
        return {
            view:thisView
        };
    }
    go(tab){
        thisView.goTo(tab.props.value+'.js');
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <div className='title'>
                    <h2>{___.app_name}</h2>
                </div>
                <div className='main'>
                    <ModuleCard title={___.car_monitor} icon={<MapsPlace style={sty.icon}/>} href='car_monitor' />
                    <ModuleCard title={___.car_manage} icon={<MapsDirectionsCar style={sty.icon}/>} href='car_manage' />
                    <ModuleCard title={___.device_manage} icon={<HardwareKeyboard style={sty.icon}/>} href='device_manage' />
                </div>
                <Tabs style={sty.tabs}>
                    <Tab
                        className='tab'
                        icon={<ActionHome/>}
                        label={___.home}
                    />
                    <Tab
                        className='tab'                    
                        icon={<ActionAccountCircle/>}
                        label={___.my_account}
                        value={'my_account'}
                        onActive={this.go}
                    />
                </Tabs>
            </div>
            </ThemeProvider>
        );
    }
}

App.childContextTypes = {
    view: React.PropTypes.object
};

