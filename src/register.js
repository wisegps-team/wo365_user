"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';


import {ThemeProvider} from './_theme/default';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Input from './_component/base/input';
import SexRadio from './_component/base/SexRadio';
import Register from './_component/login/Register';
// import MobileChecker from './_component/base/mobileChecker';
import VerificationCode from './_component/base/verificationCode';
import {getOpenIdKey} from './_modules/tool';
import Checkbox from 'material-ui/Checkbox';


require('./_sass/index.scss');//包含css
let sty={
    c:{
        height:'30px',
        // marginBottom:'1em'
    }
}

window.addEventListener('load',function(){
    ReactDOM.render(<App/>,W('#main'));
});

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            active:0,
            booking:null,
            user:null,
            selectBookingId:null
        }
        this.registerCallback = this.registerCallback.bind(this);
        this.haveBooking = this.haveBooking.bind(this);
        this.checkSuccess = this.checkSuccess.bind(this);
    }
    componentDidMount() {
        let d={
            userOpenId:_g.openid,
            status:0,
            installId:_g.installId,
        };
        if(_g.bookingId&&_g.bookingId!='more'){
            d.objectId=_g.bookingId;
        }
            
        Wapi.booking.list(res=>{
            if(res.data&&res.data.length){
                this.haveBooking(res.data);
            }else
                this.setState({active:1});
        },d);
    }
    
    registerCallback(res,device){
        W.loading();
        if(!res._code){
            let user=res;
            Wapi.customer.get(cust=>{
                let remark='注册成功！';
                let link='#';
                if(this.state.selectBookingId){
                    remark='订单'+this.state.selectBookingId+'注册成功！';
                    link=location.origin+'/?loginLocation=%252Fwo365_user%252Forder.html%253FbookingId%253D'+this.state.selectBookingId+'&wx_app_id='+_g.wx_app_id;
                }
                Wapi.serverApi.sendWeixinByTemplate(function(res){
                    if(res.errcode||res.status_code){
                        W.alert(remark)
                    }else
                        W.native.close();
                },{
                    openId:_g.openid,
                    wxAppKey:_g.wx_app_id,
                    templateId:'OPENTM408183089',//安装成功通知'
                    link,
                    data:{
                        "first": {//标题
                            "value": '',
                            "color": "#173177"
                        },
                        "keyword1": {//安装网点
                            "value": cust.data.name,
                            "color": "#173177"
                        },
                        "keyword2": {//型号
                            "value": device.model,
                            "color": "#173177"
                        },
                        "keyword3": {//IMEI
                            "value": device.did,
                            "color": "#173177"
                        },
                        "remark": {
                            "value": remark,
                            "color": "#173177"
                        }
                    }
                });
            },{
                objectId:user.customer.parentId[0],
                access_token:user.access_token
            });
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

    haveBooking(booking,code){
        if(booking){//有预订
            let first=booking[0];
            first._checked=true;
            this.setState({
                booking,
                active:2,
                user:{
                    name:first.userName,
                    mobile:first.userMobile,
                    valid_code:code,
                    password:first.userMobile.slice(-6),
                    valid_type:1
                },
                selectBookingId:first.objectId
            });
        }else
            this.setState({active:2});
    }

    checkSuccess(select){//校验车主手机号成功
        let booking=this.state.booking.map(e=>{
            e._checked=false;
            return e;
        });
        select._checked=true;
        this.setState({booking,selectBookingId:select.objectId});
    }

    render() {
        let boxs=[
            <h2 style={{textAlign:'center'}} key='h2'>{___.searching_booking}</h2>,
            <BookingCheckBox onSuccess={this.haveBooking} key='cb'/>,
            <RegisterBox success={this.registerCallback} user={this.state.user} bookingId={this.state.selectBookingId} key='rb'/>
        ];
        let box=boxs[this.state.active];
        if(this.state.active==2&&this.state.booking&&this.state.booking.length)
            box=[
                <BookingBox booking={this.state.booking} onSuccess={this.checkSuccess} key='bb'/>,
                box
            ];
        return (
            <ThemeProvider>
                <div className='login' style={{padding:'10px 10%'}}>
                    {box}
                </div>
            </ThemeProvider>
        );
    }
}


class RegisterBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            formData:null,
            // to:props.user?0:1
        }
        this.data={
            sex:1,
            did:_g.did
        };
        this.getUser(props);

        this.registerSuccess = this.registerSuccess.bind(this);
        this.beforRegister = this.beforRegister.bind(this);
        // this.onChoose = this.onChoose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.getUser(nextProps,true);
        if(nextProps.user)
            this.setState({to:0});
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.clean)
            this.setState({clean:false});
    }
    

    getUser(props,isMounted){
        if(props.user){
            let user=Object.assign({},props.user);
            this.data.name=user.name;
            delete user.name;
            if(isMounted)
                this.setState({formData:user});
            else
                this.state.formData=user;
        }
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
        let cust=Object.assign({},that.data,{tel:user.mobile,custTypeId:7,custType:'私家车主'});
        delete cust.did;
        cust.appId=WiStorm.config.objectId;

        if(user.status_code&&user.status_code!=8){
            W.errorCode(user);
            return;
        }
        delete user.status_code;
        let token=user.access_token;
        cust.access_token=token;
        cust.uid=user.uid;
        that.addCust(user,cust,token);
    }

    addCust(user,cust,token){//添加客户表资料，如果有则校验parentId,绑定设备
        let that=this;
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
            let parentId=dev.data.uid.toString();
            Wapi.customer.get(cus=>{
                if(cus.data){
                    cust=cus.data;
                    if(!cust.parentId.includes(parentId)){
                        Wapi.customer.update(null,{
                            _objectId:cust.objectId,
                            parentId:'"+'+parentId+'"',
                            access_token:token
                        });
                    }
                    user.customer=cust;
                    that.bind(user,dev);
                }else{
                    cust.parentId=[parentId];
                    Wapi.customer.add(function(res){
                        cust.objectId=res.objectId;
                        user.customer=cust;
                        that.bind(user,dev);
                    },cust);
                }
            },{
                uid:user.uid,
                access_token:token,
                appId:WiStorm.config.objectId
            });
        },{
            did:that.data.did,
            access_token:token,
            err:true  //由回调处理返回错误
        });
        let key=getOpenIdKey();
        let userDate={
            access_token:token,
            _objectId:user.uid,
            userType:7
        }
        userDate['authData.'+key]=_g.openid;
        Wapi.user.update(null,userDate);
    }

    bind(user,dev){//绑定设备，如果有预订则处理预订，预付款到帐，佣金分发，推送模板消息等
        W.loading(true,___.checking_booking);
        let that=this;
        let data={
            did:that.data.did,
            uid:user.customer.objectId,
            openId:_g.openid,
            mobile:user.mobile,
            name:user.customer.name,
        };
        if(user.carId){
            data.carId=user.carId;
        }else
            data.carNum=user.carNum;

        if(this.props.bookingId){//如果有预订
            data.bookingId=this.props.bookingId;
        }
        Wapi.serverApi.addAndBind(function(res){
            W.loading(false);
            if(res.status_code){
                W.alert(___.add_car_err,e=>that.props.success(user,dev.data));
            }
            that.props.success(user,dev.data);
        },data);
    }

    render() {
        return (
            <div style={{marginBottom:'50px'}}>
                <Register 
                    onSuccess={this.registerSuccess} 
                    beforRegister={this.beforRegister}
                    formData={this.state.formData}
                    clean={this.state.clean}
                    disabled={this.state.to==0}
                />
            </div>
        );
    }
}


//展示预订信息，校验预订车主手机号
class BookingBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.checkSuccess = this.checkSuccess.bind(this);
        this.select = this.select.bind(this);
    }

    componentDidMount() {
        let bookings=this.props.booking;
        if(bookings&&bookings.length)
            Wapi.serverApi.getBrand(res=>{
                bookings.forEach(e=>e.product.brand=res.data.brand);
                this.forceUpdate();
            },{objectId:_g.modelId});
    }

    checkSuccess(code){
        this._code=code;
    }

    select(select){
        this.props.onSuccess(select);
    }
    render() {
        let bookings=this.props.booking;

        let item=bookings.map(e=><BookingItem data={e} key={e.objectId} onClick={this.select} border={true}/>);
        let des={
            name:bookings[0].userName,
            install:bookings[0].install,
            count:bookings.length
        }
        return (
            <div>
                <p style={{borderBottom:'1px solid #ccc',margin:'0px',padding:'1em 0'}}>
                    {W.replace(___.reg_des0,des)}
                </p>
                {item}
            </div>
        );
    }
}

class BookingItem extends Component{
    constructor(props, context) {
        super(props, context);
        this.success = this.success.bind(this);
    }
    
    success(){
        if(this.props.onClick){
            this.props.onClick(this.props.data);
        }
    }
    render() {
        let b=this.props.data;
        let sty={
            display:'block'
        };
        let checkbox=null;
        if(this.props.border){
            sty.borderBottom='1px solid #ccc';
            sty.padding='1em 0';
            checkbox=<Checkbox 
                labelPosition="left"
                style={{width:'124px'}} 
                labelStyle={{color:'#000'}}
                label={___.register_now} 
                onCheck={this.success}
                checked={b._checked}
            />;
        }
        
        return (
            <label style={sty} className={'p'}>
                <label>{___.booking_p+'：'}</label><span>{(b.product.brand||'获取中')+' '+b.product.name}</span><br/>
                <label>{___.booking_pay+'：'}</label><span>{parseFloat(b.payMoney).toFixed(2)}</span><br/>
                {checkbox}
            </label>
        );
    }
}

//展示说明，获取是否有预订
class BookingCheckBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.change = this.change.bind(this);
        this.success = this.success.bind(this);
        this.checkSuccess = this.checkSuccess.bind(this);

        this.state={
            mobile:''
        }
    }
    
    change(e,mobile){
        this._mobile=mobile;
        if(this._mobile.length==11)
            this.setState({mobile});
    }
    success(){
        if(this._mobile&&this._code)
            Wapi.booking.list(res=>{
                if(res.data&&res.data.length)
                    this.props.onSuccess(res.data,this._code);
                else
                    W.alert(___.b_null);
            },{
                userMobile:this._mobile,
                status:0,
                installId:_g.installId
            });
        else
            this.props.onSuccess(null);
    }
    checkSuccess(code){
        this._code=code;
    }
    render() {
        return (
            <div>
                <p>{___.r_des3}</p>
                <Input floatingLabelText={___.b_user_mobile} onChange={this.change} type="tel" />
                <VerificationCode 
                    name='valid_code'
                    type={1}
                    account={this.state.mobile} 
                    onSuccess={this.checkSuccess}
                />
                <div className="center">
                    <RaisedButton label={___.ok} primary={true} onClick={this.success}/>
                </div>
            </div>
        );
    }
}