"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';

import {ThemeProvider} from './_theme/default';
import FlatButton from 'material-ui/FlatButton';
import Input from './_component/base/input';
import SexRadio from './_component/base/SexRadio';
import Register from './_component/login/Register';


require('./_sass/index.scss');//包含css

window.addEventListener('load',function(){
    ReactDOM.render(<App/>,W('#main'));
});


class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.registerCallback = this.registerCallback.bind(this);
    }
    registerCallback(res){
        W.loading();
        if(!res._code){
            W.alert(___.register_success,()=>location='index.html');
        }else{
            switch (res._code) {
                case 1:
                    W.confirm(___.account_error,b=>b?location='index.html?intent=forget':null);
                    break;
                case 2:
                    W.confirm(___.account_error,b=>b?location='index.html?intent=forget':0);
                    break;
                default:
                    W.alert(___.unknown_err);
                    break;
            }
        }
    }

    render() {
        return (
            <ThemeProvider>
                <div className='login' style={{padding:'10px 10%'}}>
                    <RegisterBox success={this.registerCallback}/>
                    <div style={{
                        textAlign: 'right',
                        marginTop: '10px'
                        }}
                    >
                        <FlatButton label={___.login} primary={true} onClick={()=>location.href='index.html'}/>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}


class RegisterBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.registerSuccess = this.registerSuccess.bind(this);
        this.data={
            sex:1
        };
        this.change = this.change.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.beforRegister = this.beforRegister.bind(this);
    }

    beforRegister(data){
        if(!this.data.name){
            W.alert(___.user_name_empty);
            return false;
        }
        if(!this.data.did){
            W.alert(___.please_input_correct_device_num);
            return false;
        }
        return true;
    }
    
    registerSuccess(res){
        let user=res;
        let that=this;
        Wapi.papi.register(function(){
            let cust=Object.assign({},that.data,{tel:user.mobile});
            delete cust.did;
            Wapi.user.login(function(data){//先登录获取token
                if(data.status_code){
                    if(data.status_code==2&&user.status_code==8){//密码错误且之前已经注册过用户
                        user._code=1;
                        that.props.success(user);
                        return;
                    }
                    W.errorCode(data);
                    return;
                }
                delete data.status_code;
                Object.assign(user,data);//用户信息
                let token=data.access_token;
                cust.access_token=token;
                cust.uid=data.uid;
                if(user.status_code==8)//如果是之前就已经注册过用户则先校验一下有没有添加过客户表
                    Wapi.customer.get(function(cust){//如果有，则不能注册，提示去重置密码
                        if(cust.data){
                            user._code=2;
                            user.customer=cust.data;
                            that.props.success(user);
                        }else
                            addCust();
                    },{uid:cust.uid,access_token:token});
                else
                    addCust();

                function addCust(){//添加客户表资料
                    W.loading(true,___.checking_device);
                    Wapi.device.get(function(dev){
                        if(dev.status_code){
                            W.loading();
                            W.alert(___.dev_err);
                            return;
                        }
                        if(!dev.data){
                            W.loading();
                            W.alert(___.dev_null);
                            return;
                        }
                        if(dev.data.binded){
                            W.loading();
                            W.alert(___.dev_binded);
                            return;
                        }
                        cust.parentId=[dev.data.uid.toString()];
                        Wapi.customer.add(function(res){
                            cust.objectId=res.objectId;
                            user.customer=cust;
                            W.loading(true,___.checking_booking);
                            Wapi.booking.get(function(booking){//判断一下是否预订了
                                if(booking.status_code){
                                    W.alert(___.booking_err,e=>that.props.success(user));
                                    return;
                                }
                                if(booking.data){
                                    Wapi.booking.update(function(res){

                                    },{
                                        _objectId:booking.data.objectId,
                                        status1:1,
                                        resTime:W.dateToString(new Date()),
                                        did:that.data.did
                                    });
                                }
                                
                                W.loading(true,___.adding_car);
                                let vehicle={
                                    access_token:token,
                                    name:(booking.data)?booking.data.carType.car_num:___.default_vehicle,
                                    uid:user.customer.objectId.toString(),
                                    did:dev.data.did,
                                    deviceType:dev.data.model,
                                    err:true  //由回调处理返回错误
                                }
                                Wapi.vehicle.add(function(veh){
                                    if(veh.status_code){
                                        W.alert(___.add_car_err,e=>that.props.success(user));
                                        return;
                                    }
                                    W.loading(true,___.binding_device);

                                    vehicle.objectId=veh.objectId;
                                    that.props.success(user);
                                    Wapi.device.update(function(res){
                                        if(veh.status_code){
                                            W.alert(___.bind_err,e=>that.props.success(user));
                                            return;
                                        }
                                        that.props.success(user);
                                    },{
                                        access_token:token,
                                        binded:true,
                                        bindDate:W.dateToString(new Date()),
                                        vehicleName:vehicle.name,
                                        vehicleId:vehicle.objectId,
                                        err:true  //由回调处理返回错误
                                    });
                                },vehicle);
                                
                            },{
                                mobile:user.mobile,
                                status:0,
                                err:true  //由回调处理返回错误
                            });
                        },cust);
                        
                    },{
                        did:that.data.did,
                        access_token:token,
                        err:true  //由回调处理返回错误
                    });
                    Wapi.user.updateMe(null,{
                        _sessionToken:data.session_token,
                        access_token:token,
                        userType:7,
                        authData:{
                            openId:_g.openid
                        }
                    });
                }
            },{
                account:user.mobile,
                password:user.password
            });
        },{
            mobile:user.mobile,
            password:user.password,
            did:this.data.did
        });
    }

    nameChange(e,val){
        this.data[e.target.name]=val;
    }
    change(val,name){
        this.data.sex=val;
    }
    render() {
        return (
            <div>
                <form>
                    <Input name='name' floatingLabelText={___.person} onChange={this.nameChange}/>
                    <Input name='did' floatingLabelText={___.did} onChange={this.nameChange}/>
                    <SexRadio onChange={this.change}/>
                </form>
                <Register onSuccess={this.registerSuccess} beforRegister={this.beforRegister}/>
            </div>
        );
    }
}