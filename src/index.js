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
    getUserData(user){
        W.loading(1);
        this.getCustomer(user);
    }
    getCustomer(user){
        let token=user.access_token;
        let cust_data={
            access_token:token
        };
        let role_user;//获取权限时将会用到
        if(user.employee){
            cust_data.objectId=user.employee.companyId;
            role_user=user.employee.objectId;
        }else{
            cust_data.uid=user.uid;
        }
        Wapi.customer.get(function(result){
            user.customer=result.data;
            W._loginSuccess(user);
            let loginLocation=_g.loginLocation||"src/moblie/home.html";
            if(loginLocation.indexOf('.html')==-1)//需要到home.html跳转
                loginLocation="src/moblie/home.html?loginLocation="+_g.loginLocation;
            top.location=loginLocation;
        },cust_data);
    }
    loginSuccess(res){
        let user=res.data;
        let min=-Math.floor((W.date(res.data.expire_in).getTime()-new Date().getTime())/60000);
        W.setCookie("access_token", res.data.access_token,min);
        if(!user.mobileVerified&&user.mobile){//未通过手机验证
            W.alert(___.please_verification);
            this._user=user;//先暂存
            this.setState({active:2});
        }else{
            if((!user.authData||!user.authData.openId)&&_g.openid)//没有绑定的，进行绑定
                Wapi.user.updateMe(res=>{
                    user.authData=Object.assign(user.authData,{openId:_g.openid});
                    this.getUserData(user);
                },{
                    access_token:user.access_token,
                    'authData.openId':_g.openid,
                    _sessionToken:user.session_token
                });
            else
                this.getUserData(user);
        }
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
            <FlatButton label={___.register} primary={true} onClick={()=>location='register.html?intent=logout&needOpenId=true'} key='register'/>,
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