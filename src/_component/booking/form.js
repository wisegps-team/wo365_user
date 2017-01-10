import React, {Component} from 'react';

import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import ActionVerifiedUser from 'material-ui/svg-icons/action/verified-user';
import HardwareSmartphone from 'material-ui/svg-icons/hardware/smartphone';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import Input from '../base/input';
import PhoneInput from '../base/PhoneInput';
import VerificationCode from '../base/verificationCode';
import {getOpenIdKey} from '../../_modules/tool';

const sty={
    f:{
        width: '100%'
    },
    r:{
        display:'flex',
        alignItems:'flex-end'
    },
    i:{
        margin:'9px'
    },
    b:{
        width:'100%',
        textAlign:'center',
        padding:'16px 5px 5px 0'
    },
    ex:{
        color:'#999999',
        marginTop:'30px',
        marginLeft:'10px',
        textAlign:'center',
    },
    c:{
        marginLeft: '9px',
        marginTop: '1em'
    },
}

class Form extends Component {
    constructor(props, context) {
        super(props, context);
        this.valid=false;
        this.data={
            sellerId:_g.sellerId,
            sellerName:_g.seller_name,
            uid:_g.uid,
            status:0,
            status0:1,
            status1:0,
            status2:0,
            status3:0,
            name:null,
            mobile:null,
            openId:_g.openid,
            activityId:_g.activityId||'0',
            payStatus:0,
            payMoney:0,
            carType:{
                qrStatus:'0'
            }
        }
        this.change = this.change.bind(this);
        this.changeVerifi=this.changeVerifi.bind(this);
        this.submit = this.submit.bind(this);
    }
    
    change(e,val){
        this.data[e.target.name]=val;
        if(e.target.name=='mobile')
            this.forceUpdate();
    }
    changeVerifi(val){
        this.valid=true;
        this._valid=val;
    }
    submit(){
        if(!this.valid){
            W.alert(___.code_err);
            return;
        }
        let submit_data=Object.assign({},this.data);
        if(this.props.self){//为自己预订，预订人等于自己
            submit_data.userName=submit_data.name;
            submit_data.userMobile=submit_data.mobile;
            submit_data.userOpenId=submit_data.openId;
            submit_data.type=0;
        }else{
            submit_data.userName=submit_data.userName;
            submit_data.userMobile=submit_data.userMobile;
            submit_data.type=1;
        }
        for(let k in submit_data){
            if(submit_data[k]==null||typeof submit_data[k]=='undefined'){
                W.alert(___.data_miss);
                return;
            }
        }

        let ACT=this.props.act;

        //补上数据
        submit_data.activityType=ACT.type;
        submit_data.product={
            name:ACT.product,
            id:ACT.productId,
            price:ACT.price,
            installationFee:ACT.installationFee,
            reward:ACT.reward,
            act_url:ACT.url
        };
        if(ACT.count)
            submit_data.managerId=ACT.principalId;//活动负责人id

        W.loading(true,___.booking_now);
        let _this=this;
        bonkingRegister(submit_data.mobile,this._valid,submit_data.name,submit_data.openId,function(user){
            let uid=user.uid;
            submit_data.userId=uid;
            Wapi.booking.add(function(res){
                submit_data.objectId=res.objectId;
                W.loading();
                _this.props.onSuccess(submit_data,uid);
            },submit_data);
        });
    }
    render() {
        let ACT=this.props.act;
        let tel=(ACT?ACT.tel:'');
        let carowner=this.props.self?null:[
            <div style={sty.r} key={'carowner_name'}>
                <ActionAccountBox style={sty.i}/>
                <Input name='userName' floatingLabelText={___.carowner_name} onChange={this.change}/>
            </div>,
            <div style={sty.r} key={'carowner_phone'}>
                <HardwareSmartphone style={sty.i}/>
                <Input name='userMobile' floatingLabelText={___.carowner_phone} onChange={this.change} type='tel'/>
            </div>
        ];
        let ps={
            color:'#ccc',
            marginLeft: '11px'
        };
        return (
            <div style={sty.f}>
                <p style={ps}>{___.book_id+': '+_g.mobile.slice(-6)}</p>
                <Checkbox label={___.booking_for_self} checked={this.props.self} onCheck={e=>this.props.setSelf(true)} style={sty.c}/>
                <Checkbox label={___.booking_for_else} checked={!this.props.self} onCheck={e=>this.props.setSelf(false)} style={sty.c}/>
                {carowner}
                <div style={sty.r}>
                    <ActionAccountBox style={sty.i}/>
                    <Input name='name' floatingLabelText={___.booking_name} onChange={this.change}/>
                </div>
                <div style={sty.r}>
                    <HardwareSmartphone style={sty.i}/>
                    <Input name='mobile' floatingLabelText={___.booking_phone} onChange={this.change} type='tel'/>
                </div>
                <div style={sty.r}>
                    <ActionVerifiedUser style={sty.i}/>
                    <VerificationCode 
                        name='valid_code'
                        type={1}
                        account={this.data.mobile} 
                        onSuccess={this.changeVerifi}
                    />
                </div>
                <div style={sty.b}>
                    <RaisedButton label={___.submit_booking} primary={true} onClick={this.submit}/>
                </div>

                <div style={sty.ex}>
                    {___.please_consult}
                    <a href={'tel:'+tel}>{tel}</a>
                </div>
            </div>
        );
    }
}

export default Form;

export function bonkingRegister(mobile,valid_code,name,openId,callback){
    let password=mobile.slice(-6);
    Wapi.user.register(function(user){
        if(user.status_code&&user.status_code!=8){
            W.errorCode(user);
            return;
        }
        Wapi.user.login(lo=>{
            if(lo.status_code){
                W.errorCode(lo);
                return;
            }
            let uid=lo.uid;
            let access_token=lo.access_token;
            let data={
                _objectId:uid,
                access_token
            };
            data['authData.'+getOpenIdKey()]=openId;
            Wapi.user.update(null,data);//更新登录的openId
            Wapi.customer.get(cust=>{
                if(!cust.data){
                    Wapi.customer.add(null,{
                        uid,
                        appId:WiStorm.config.objectId,
                        access_token,
                        name,
                        tel:mobile,
                        custType:'私家车主',
                        custTypeId:7
                    });
                }
            },{
                uid,
                appId:WiStorm.config.objectId,
                access_token
            });
            callback(lo);
        },{
            password,
            account:mobile
        });
    },{
        mobile,
        valid_code,
        password,
        valid_type:1
    });
}