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
            start:false
        }
        this.registerCallback = this.registerCallback.bind(this);
        this.haveBooking = this.haveBooking.bind(this);
        this.checkSuccess = this.checkSuccess.bind(this);
    }
    componentDidMount() {
        let d={
            userOpenId:_g.openid
        };
        if(_g.bookingId)
            d.objectId=_g.bookingId;
        Wapi.booking.get(res=>{
            if(res.data){
                if(res.data.status!=0)
                    W.alert(___.device_register_s,res=>W.native.close());
                else
                    this.setState({
                        active:2,
                        booking:res.data
                    });
            }else
                this.setState({active:1});
        },d);
    }
    
    registerCallback(res,device){
        W.loading();
        if(!res._code){
            // W.alert(___.register_success,()=>location='index.html');
            let user=res;
            Wapi.customer.get(cust=>{
                let remark='注册成功！';
                Wapi.serverApi.sendWeixinByTemplate(function(res){
                    if(res.errcode||res.status_code){
                        W.alert(remark)
                    }else
                        W.native.close();
                },{
                    openId:_g.openid,
                    wxAppKey:_g.wx_app_id,
                    templateId:'OPENTM408183089',//安装成功通知'
                    link:'#',
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

    haveBooking(booking){
        if(booking){//有预订
            this.setState({active:2,booking});
        }else
            this.setState({active:3});
    }

    checkSuccess(code){//校验车主手机号成功
        let booking=this.state.booking;
        let newState={
            active:3,
            user:{
                name:booking.userName,
                mobile:booking.userMobile,
                valid_code:code,
                password:booking.userMobile.slice(-6),
                valid_type:1
            }
        };
        newState.start=(_g.bookingId==this.state.booking.objectId);//带bookingId进来的，直接注册
        this.setState(newState);
    }

    render() {
        let boxs=[
            <h2 style={{textAlign:'center'}}>{___.searching_booking}</h2>,
            <BookingCheckBox onSuccess={this.haveBooking}/>,
            <BookingBox booking={this.state.booking} onSuccess={this.checkSuccess}/>,
            <RegisterBox success={this.registerCallback} user={this.state.user} start={this.state.start}/>
        ];
        let box=boxs[this.state.active];
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
            to:props.user?0:1
        }
        this.data={
            sex:1,
            did:_g.did
        };
        this.getUser(props);

        this.registerSuccess = this.registerSuccess.bind(this);
        this.change = this.change.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.beforRegister = this.beforRegister.bind(this);
        this.onChoose = this.onChoose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.getUser(nextProps);
        if(nextProps.user)
            this.setState({to:0});
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.clean)
            this.setState({clean:false});
    }
    

    getUser(props){
        if(props.user){
            let user=Object.assign({},props.user);
            this.data.name=user.name;
            delete user.name;
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
        // Wapi.papi.register(function(){
            let cust=Object.assign({},that.data,{tel:user.mobile,custTypeId:7,custType:'私家车主'});
            delete cust.did;
            cust.appId=WiStorm.config.objectId;
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
                    },{
                        uid:cust.uid,
                        access_token:token,
                        appId:WiStorm.config.objectId
                    });
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
                            Wapi.serverApi.addAndBind(function(res){
                                W.loading(false);
                                if(res.status_code){
                                    W.alert(___.add_car_err,e=>that.props.success(user,dev.data));
                                }
                                that.props.success(user,dev.data);
                            },{
                                did:that.data.did,
                                uid:cust.objectId,
                                openId:_g.openid,
                                mobile:user.mobile,
                                name:user.name
                            });
                        },cust);
                        
                    },{
                        did:that.data.did,
                        access_token:token,
                        err:true  //由回调处理返回错误
                    });
                    let key=getOpenIdKey();
                    let userDate={
                        _sessionToken:data.session_token,
                        access_token:token,
                        userType:7,
                        authData:{
                            openId:_g.openid
                        }
                    }
                    userDate.authData[key]=_g.openid;
                    Wapi.user.updateMe(null,userDate);
                }
            },{
                account:user.mobile,
                password:user.password
            });
        // },{
        //     mobile:user.mobile,
        //     password:user.password,
        //     did:this.data.did
        // });
    }

    nameChange(e,val){
        this.data[e.target.name]=val;
    }
    change(val,name){
        this.data.sex=val;
    }
    onChoose(to){
        let state={to};
        if(to==0){//按预订信息注册
            this.getUser(this.props);
        }else{//注册到新车主
            this.data.name='';
            state.formData=null;
            state.clean=true;
        }
        this.setState(state);
    }
    render() {
        let p=null,choose=null;
        if(this.props.user){
            let rt=(<span>
                {___.register_to_user}
                <span style={{color:'rgb(33, 150, 243)'}}>{this.props.user.mobile}</span>
            </span>);
            
            p=(<p className="center">{___.r_des2}</p>);
            choose=[
                <Checkbox label={___.register_to_new} checked={this.state.to==1} onCheck={e=>this.onChoose(1)} style={sty.c} key={1}/>,                
                <Checkbox label={rt} checked={this.state.to==0} onCheck={e=>this.onChoose(0)} style={sty.c} key={0}/>
            ]
        };
        let dis={
            display:this.props.start?'none':''
        };
        let idis=this.state.to==0?{display:'none'}:null;
        return (
            <div style={dis}>
                <form>
                    {choose}
                    <Input 
                        name='name' 
                        floatingLabelText={___.person_name} 
                        onChange={this.nameChange} 
                        value={this.data.name}
                        disabled={this.state.to==0}
                        style={idis}
                    />
                    <SexRadio onChange={this.change} style={{display:'none'}}/>
                </form>
                <Register 
                    onSuccess={this.registerSuccess} 
                    beforRegister={this.beforRegister}
                    formData={this.state.formData}
                    clean={this.state.clean}
                    start={this.props.start}
                    disabled={this.state.to==0}
                />
                {p}
            </div>
        );
    }
}


//展示预订信息，校验预订车主手机号
class BookingBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.checkSuccess = this.checkSuccess.bind(this);
        this.success = this.success.bind(this);
    }

    componentDidMount() {
        document.title=___.booking_data;
    }

    checkSuccess(code){
        this._code=code;
    }

    success(){
        if(this._code)
            this.props.onSuccess(this._code);
        else
            W.alert(___.code_err);
    }
    render() {
        let b=this.props.booking;
        return (
            <div>
                <p>
                    <label>{___.carowner_info+'：'}</label><span>{b.userName}</span><br/>
                    <label>{___.order_no+'：'}</label><span>{b.objectId}</span><br/>
                    <label>{___.booking_date+'：'}</label><span>{W.dateToString(W.date(b.createdAt)).slice(0,-3)}</span><br/>
                    <label>{___.booking_p+'：'}</label><span>{b.product.name}</span><br/>
                    <label>{___.booking_pay+'：'}</label><span>{parseFloat(b.payMoney).toFixed(2)}</span><br/>
                </p>
                <VerificationCode 
                    name='valid_code'
                    type={1}
                    account={b.userMobile} 
                    onSuccess={this.checkSuccess}
                />
                <div className="center">
                    <RaisedButton label={___.ok} primary={true} onClick={this.success}/>
                </div>
                <p className="center">
                    {___.r_des1.replace('xxx',b.userMobile.replace(b.userMobile.slice(-8,-4),'****'))}
                </p>
            </div>
        );
    }
}

//展示说明，获取是否有预订
class BookingCheckBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.change = this.change.bind(this);
        this.success = this.success.bind(this);
    }
    
    componentDidMount() {
        document.title=___.device_register;
    }
    change(e,value){
        this.mobile=value;
    }
    success(){
        if(this.mobile)
            Wapi.booking.get(res=>{
                if(res.data)
                    this.props.onSuccess(res.data);
                else
                    W.alert(___.b_null);
            },{
                userMobile:this.mobile,
                status:0
            });
        else
            this.props.onSuccess(null);
    }
    render() {
        return (
            <div>
                <p>{___.r_des3}</p>
                <Input floatingLabelText={___.b_user_mobile} onChange={this.change} type="tel" />
                <div className="center">
                    <RaisedButton label={___.ok} primary={true} onClick={this.success}/>
                </div>
            </div>
        );
    }
}


//选择使用原预订车主信息注册，还是选择使用新车主信息注册
class ChooseBox extends Component{
    componentDidMount() {
        document.title=___.device_register;
    }
    render() {
        return (
            <div>
                <p className="center">
                    {___.r_des4}<br/>
                    {___.r_des5}
                </p>
                <div className="center">
                    <FlatButton label={___.register_to_user} primary={true} onClick={e=>this.props.onChoose(0)}/><br/><br/>
                    <FlatButton label={___.register_to_new} primary={true} onClick={e=>this.props.onChoose(1)}/>
                </div>
            </div>
        );
    }
}