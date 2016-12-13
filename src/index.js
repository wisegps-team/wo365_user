"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';

import {ThemeProvider} from './_theme/default';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import VerificationCode from './_component/base/verificationCode';

import Login from './_component/login';
import Forget from './_component/login/forget';
import Wapi from './_modules/Wapi';
import sty from './_component/login/style';
import {getOpenIdKey} from './_modules/tool';

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
        this.bindSuccess = this.bindSuccess.bind(this);
    }
    getUserData(user){
        //校验记录的openId是否当前获取到的openId
        WiStorm.agent.weixin=true;
        if(WiStorm.agent.weixin&&_g.openid&&user.authData&&user.authData[getOpenIdKey()]){//保存有当前域名的openId
            if(user.authData[getOpenIdKey()]!==_g.openid){
                W.confirm(___.ask_change_openId,res=>{
                    if(res){
                        this._user=user;
                        this.setState({active:2});
                    }
                });
                return;
            }
        }
        W.loading(1);
        this.getCustomer(user);
    }
    getCustomer(user){
        let token=user.access_token;
        let cust_data={
            access_token:token,
            appId:WiStorm.config.objectId
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

    bindSuccess(user){//绑定微信成功
        W.toast(___.update_su);
        if(this._user){//继续
            this.getUserData(user);
            this._user=undefined;
        }
        this.setState({active:0});
    }
    
    render() {
        let actives=[
            <Login onSuccess={this.loginSuccess}/>,
            <div/>,
            <BindBox onSuccess={this.bindSuccess} user={this._user||null}/>
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


class BindBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.submit = this.submit.bind(this);
        this.change = this.change.bind(this);
    }

    change(val,name){
        this.code=name;
    }

    submit(){
        if(!this.code){
            W.alert(___.code_err);
            return;
        }
        let user=this.props.user;
        let key='authData.'+getOpenIdKey();
        let data={
            access_token:user.access_token,
            _sessionToken:user.session_token
        };
        data[key]=_g.openid;
        Wapi.user.updateMe(res=>{
            let d={};
            d[getOpenIdKey()]=_g.openid;
            user.authData=Object.assign(user.authData,d);
            this.props.onSuccess(user);
        },data);
    }
    render() {
        return (
            <div>
                <VerificationCode 
                    name='valid_code'
                    type={1}
                    account={this.props.user.mobile} 
                    onSuccess={this.change}
                />

                <RaisedButton label={___.ok} primary={true} style={sty.but} onClick={this.submit}/>
            </div>
        );
    }
}