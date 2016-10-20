"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';

import {ThemeProvider} from './_theme/default';
import FlatButton from 'material-ui/FlatButton';

import Login from './_component/login';
import Forget from './_component/login/forget';
import Wapi from './_modules/Wapi';

require('./_sass/index.scss');//包含css

window.addEventListener('load',function(){
    ReactDOM.render(<App/>,W('#main'));
});


class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            active:0//0,登录；1，注册；2，忘记密码
        }
        this.loginSuccess = this.loginSuccess.bind(this);
        this.forgetSuccess = this.forgetSuccess.bind(this);
    }
    // getUserData(user){
    //     W.loading(1);
    //     if(user.userType==9){//如果是员工
    //         let that=this;
    //         Wapi.employee.get(res=>{
    //             user.employee=res.data;
    //             this.getCustomer(user);
    //         },{
    //             uid:user.uid,
    //             access_token:user.access_token
    //         })
    //     }else
    //         this.getCustomer(user);
    // }
    // getCustomer(user){
    //     let token=user.access_token;
    //     let cust_data={
    //         access_token:token
    //     };
    //     let role_user;//获取权限时将会用到
    //     if(user.employee){
    //         cust_data.objectId=user.employee.companyId;
    //         role_user=user.employee.objectId;
    //     }else{
    //         cust_data.uid=user.uid;
    //     }
    //     Wapi.customer.get(function(result){
    //         user.customer=result.data;
    //         W._loginSuccess(user);
    //         if(WiStorm.agent.mobile)
    //             top.location="src/moblie/home.html";
    //         else
    //             top.location="src/pc/home.html";
    //     },cust_data);
    // }
    loginSuccess(user){
        user.devices=user.devices.map(e=>{return {did:e}});
        W._loginSuccess(user);
        top.location="src/moblie/home.html";
        // if(WiStorm.agent.mobile)
        //     top.location="src/moblie/home.html";
        // else
        //     top.location="src/pc/home.html";
    }
    forgetSuccess(res){
        W.toast(___.reset_pwd+___.success);
        if(this._user){//第一次登陆验证手机并重置密码
            this._user.mobileVerified=true;
            this.getUserData(this._user);
            this._user=undefined;
        }
        this.setState({active:0});
    }
    
    render() {
        let actives=[
            <Login onSuccess={this.loginSuccess}/>,
            <div/>,
            /*<Forget onSuccess={this.forgetSuccess} user={this._user}/>*/
        ]
        let buttons=[
            <FlatButton label={___.login} primary={true} onClick={()=>this.setState({active:0})} key='login'/>,
            <FlatButton label={___.register} primary={true} onClick={()=>location='register.html?intent=logout'} key='register'/>,
            /*<FlatButton label={___.forget_pwd} primary={true} onClick={()=>this.setState({active:2})} key='forget_pwd'/>*/];
        return (
            <ThemeProvider>
                <div className='login'>
                    {actives[this.state.active]}
                    <div style={{
                        textAlign: 'right',
                        marginTop: '10px'
                        }}
                    >
                        {buttons.filter((e,i)=>i!=this.state.active)}
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}