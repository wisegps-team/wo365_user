/**
 * 2017-04-21
 */
"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import Wapi from './_modules/Wapi';
import {ThemeProvider} from './_theme/default';

import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import VerificationCode from './_component/base/verificationCode';
import Input from './_component/base/input';
import PhoneInput from './_component/base/PhoneInput';

import SonPage from './_component/base/sonPage';
// import AppBox from './_component/booking/app_box';
// import PayBox from './_component/booking/pay_box';
import QrImg from './_component/base/qrImg';
import {changeToLetter,getOpenIdKey} from './_modules/tool';
// import {getOpenIdKey} from '../_modules/tool';

let sty = {
    img: {width:'100%',height:'210px',display:'block',backgroundColor:'#ffffff'},
    h2: {width:'100%',lineHeight:'50px',display:'block',textAlign:'center'},
    p: {textIndent:'2em',background:'#fff',lineHeight:'30px',margin:'0px',padding:'0px 10px',wordWrap:'break-word',wordBreak:'break-all'}
}

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle('扫码挪车');
thisView.addEventListener('load',function(e){
    ReactDOM.render(<App/>,thisView);
});


// var plate='粤B12345'
class App extends Component {
    constructor(props,context){
        super(props,context)
        this.state ={
            active:0
        }
    }
    componentDidMount() {
        // console.log(11)
        debugger;
        if(_g.did){ //一物一码
            // console.log('11')
            Wapi.serverApi.getMoveCarInfo(res => {
                // this.setState({carCustomer:res.data})
                if(res){
                    this.setState({active:1})
                }else {
                    this.setState({active:0})
                }
            },{
                did:_g.did
            })
        }else { //普通二维码
            // console.log(22)
            if(_g.type == '1'){
                // console.log(33)
                this.setState({active:0})
            }else if(_g.type == '2'){
                // console.log(44)
                this.setState({active:1})
            }else if(_g.plate){ //普通绑定二维码车主自己打印的二维码
                this.setState({active:1})
            }
            
        }
        
    }
    
    render() {
        return (
            <ThemeProvider style={{background:'f7f7f7',minHeight:'100vh'}}>
                {
                    this.state.active ? <MoveCar /> : <BindCar/>
                }
            </ThemeProvider>
        );
    }
}
let pr = ['京','津','沪','渝','冀','豫','云','辽','黑','湘','皖','鲁','新','苏','浙','赣','鄂','桂','甘','晋','蒙','陕','吉','闽','贵','粤','青','藏','川','宁','琼']
class BindCar extends Component {
   constructor(props,context){
        super(props,context)
        this.state = {
            default:'如果我停的位置给您带来不便，非常抱歉，如需挪车，收到通知我立刻过来！',
            open:false,
            vehicle:[],
            account:null,
            showadd:false,
            carplate:null,
            user:null,
            selectCar:null,
            addHeader:"粤",
            subWx:null,
            valid_code:null,
            wordWrap:null
        }
        this.submit = this.submit.bind(this);
        this.editOpen = this.editOpen.bind(this);
        this.editClose = this.editClose.bind(this);
        this.setDefault = this.setDefault.bind(this);
        this.noEdit = this.noEdit.bind(this);
        this.change = this.change.bind(this);
        this.selectCar = this.selectCar.bind(this);
        this.accountChange = this.accountChange.bind(this);
        this.addCar = this.addCar.bind(this);
        this.addHeader = this.addHeader.bind(this);
        this.addPlate = this.addPlate.bind(this);
        // this.success = this.success.bind(this);
        this.close = this.close.bind(this);
        this.value = '如果我停的位置给您带来不便，非常抱歉，如需挪车，收到通知我立刻过来！'
        this.open = false;
        this.formData={
            mobile:null,
            valid_code:null,
            valid_type:1,
            password:null,
        };
    }
    
    componentDidMount() {
        if(_g.status_code==0){
            if(_g.openid){
                //判断openId是否有绑定登录账号
                debugger;
                let key = getOpenIdKey();
                Wapi.user.list(res => { //获取用户信息
                    if(res.data.length){
                        this.setState({subWx:res.data[0]})//获取用户是否关注过公众号
                        Wapi.customer.get(cus => { //获取用户信息
                            if(cus.data){
                                if(cus.data.other){
                                    if(cus.data.other.message){
                                        this.setState({default:cus.data.other.message})
                                    }
                                }
                                this.setState({user:cus.data})
                                Wapi.vehicle.list(veh => { //获取车辆列表
                                    this.setState({vehicle:veh.data})
                                },{
                                    uid:cus.data.objectId
                                })
                            }
                        },{
                            uid:res.data[0].objectId
                        })
                    }
                },{
                    ['authData.'+key]:_g.openid
                },{
                    fields:'subWx,authData,mobile,objectId'
                })
            }
        }
            
        
    }
    //打开修改留言
    editOpen(){
        this.setState({open:true})
    }
    //取消修改留言
    noEdit(){
        // this.value = this.state.default
        this.setState({open:false})
        // this.setState({default:this.value})        
    }
    //确定修改留言
    editClose(){
        this.setState({open:false})
        this.setState({default:this.value})
    }
    //修改默认留言
    setDefault(e,val){
        if(val.length>41){
            this.setState({wordWrap:true})
        }else{
            this.setState({wordWrap:false})
            this.value=val;
        }
    }
    //输入手机号码
    accountChange(e,val){
        // console.log(reg.test(val))
        // let reg=/^[1][3578][0-9]{9}$/;
        var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(n15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
        console.log(reg.test(val))
        if(reg.test(val)){
            console.log(true)
            this.formData['mobile']=val;  
            this.setState({account:val}); 
        }else{
            this.setState({account:null}); 
            if(val.length == 11){
                // console.log(1)
                W.alert('请输入正确的手机号码')
            }
        }
    }
    //输入验证码
    change(val,name){
        console.log(val,name)
        if(val){
            this.setState({valid_code:val})
        }else{
            this.setState({valid_code:null})
        }
        this.formData[name]=val;
    }
    //选择车牌号码
    selectCar(e,v,i){
        this.setState({selectCar:i})
        // this.setState({showadd:true})
        if(i != 'add'){
            this.setState({showadd:false})
            this.setState({carplate:null})
        }else if(i == 'add'){
            this.setState({showadd:true})
        }
    }
    //选择车牌号码前面一位
    addHeader(e,v,i){
        this.setState({addHeader:i})
        
    }
    //是否显示输入新增车牌号码
    addCar(){
        this.setState({showadd:true})
    }
    //输入新增车牌号码
    addPlate(e,value){
        if(value.length == 6){
            Wapi.serverApi.checkVehicleExists(res =>{
                if(res.data){
                    W.alert('车牌已存在，请从新输入')
                }else{
                     this.setState({carplate:value})
                }
            },{
                name:this.state.addHeader+value
            })
        }else {
            if(value.length>6) W.alert('请输入正确的车牌号码')
             this.setState({carplate:null})
        }
    }
    
    //点击绑定
    submit(){
        // this.open = true;
        // this.forceUpdate();

        let plate = null;//车牌号
        console.log(this.state.subWx,'wx')
        if(this.state.vehicle.length){
            plate = this.state.vehicle[0].name
        }
        if(this.state.selectCar){
            if(this.state.selectCar != 'add'){
                plate = this.state.selectCar
            }else if(this.state.selectCar == 'add'){
                plate = this.state.addHeader + this.state.carplate
            }
        }else if(this.state.carplate){
            plate = this.state.addHeader + this.state.carplate
        }
         
        let mobile = this.state.user?this.state.user.tel:null
        if(_g.status_code == 0){
            if(mobile){//已存在车主平台用户    
                Wapi.customer.update(res => {//添加留言
                    console.log('添加留言成功',res)
                },{
                    _objectId:this.state.user.objectId,
                    'other.message':this.state.default
                })
                Wapi.comm.voiceBind(json => {
                    // console.log(json,'用于后台统计数据')
                },0x9000,{
                        openid: _g.openid,
                        did: _g.did?_g.did:'',
                        mobile: mobile,
                        plate: plate,
                        uid: _g.creator,
                        distributionId:_g.distributionId?_g.distributionId:''
                });
                if(this.state.subWx.subWx.indexOf(_g.wx_app_id) != -1){ //发送模板消息
                    let value = '挪车卡绑定成功，他人扫码挪车时平台将通过拨打'+mobile+'通知您！';
                    let title = '绑定成功通知'
                    sendTemplate(plate,value,null,title);
                    // history.back();
                    W.alert('绑定成功',()=>{wx.closeWindow();})
                }else {
                    this.open = true;
                    this.forceUpdate();
                }
                if(_g.did){//绑定一物一码
                     Wapi.qrDistribution.update(qrUp => { //
                        console.log('添加批量绑定次数成功',qrUp)
                    },{
                        _objectId:_g.distributionId,
                        bind_num:'+1'
                    })
                    Wapi.customer.update(cust => { //总绑定次数
                        console.log('添加总绑定次数成功',cust)
                    },{
                        _objectId:_g.creator,
                        onecar_bind:'+1'
                    })
                
                    Wapi.qrLink.add(re=>{ //新建挪车短链
                        console.log('一物一码qrlink挪车短链',re)
                    },{
                        id:_g.did,
                        type:2,
                        url:'http://'+WiStorm.config.domain.user+'/wo365_user'+'/movecar.html?intent=logout'
                        +'&creator='+_g.creator
                        +'&did='+_g.did
                        +'&distributionId='+_g.distributionId
                        +'&driver_openid='+_g.openid+'&needOpenId=true'
                        +'&plate='+plate
                        +'&message='+this.state.default
                        +'&mobile='+mobile
                        +'&wx_app_id='+_g.wx_app_id
                    }); 
                    if(this.state.carplate){//如果新增车牌
                        Wapi.vehicle.add(veh => { //绑定新增车辆
                            console.log('一物一码新增车辆',veh)
                        },{
                            uid:this.state.user.objectId,
                            mid:_g.did,
                            name:this.state.addHeader + this.state.carplate,
                            access_token:_g.access_token
                        })
                    }else if(this.state.selectCar.objectId){ //选择某辆车绑定
                        Wapi.vehicle.update(veh => {
                            console.log('一物一码选择车辆',veh)
                        },{
                            _objectId:this.state.selectCar.objectId,
                            mid:_g.did
                        })
                    }
                }else{//如果是普通二维码
                    if(this.state.carplate){//如果新增车牌
                        Wapi.vehicle.add(veh => { //绑定新增车辆
                            console.log('普通二维码新增车辆',veh)
                        },{
                            uid:this.state.user.objectId,
                            name:this.state.addHeader + this.state.carplate
                        })
                    }
                    Wapi.qrLink.add(re=>{ //普通绑定二维码先创建短码再绑定 //用于车主自己打印二维码
                        console.log('普通二维码创建短链',re)
                        let _id=changeToLetter(re.autoId);
                        Wapi.qrLink.update(json=>{
                            console.log('普通二维码创建短链',json)
                        },{
                            _objectId:re.objectId,
                            id:_id
                        })
                    },{
                        i:1,
                        type:2,
                        url:'http://'+WiStorm.config.domain.user+'/wo365_user'+'/movecar.html?intent=logout&needOpenId=true'
                            +'&plate='+plate
                            +'&driver_openid='+_g.openid
                            +'&message='+this.state.default
                            +'&mobile='+mobile
                            +'&wx_app_id='+_g.wx_app_id

                    });  
                    
                    Wapi.customer.update(cust => {
                        console.log('普通挪车卡绑定次数',cust)
                    },{
                        _objectId:_g.creator,
                        car_bind:'+1'
                    })
                }
            }
        }else {
            let data = Object.assign({},this.formData)
            data.password = data.mobile.slice(-6)
            let password =  data.mobile.slice(-6)
            let that = this;
            // let data = Object.assign({},this.formData)
            let key = getOpenIdKey();
             //注册成为本平台用户
            let value;
            let title = "绑定成功通知";
            //  let authData = 'authData'+WiStorm.config.domain.user.split('.').join('_')+'_openid'
            Wapi.user.register(reg => {
                console.log('注册',reg)
                if(reg.status_code == 0||reg.status_code == 8){
                     Wapi.user.login(r=>{
                        Wapi.user.update(res => {
                            console.log('更新openid',res)
                        },{
                            _objectId:reg.uid,
                            access_token:r.access_token,
                            ['authData.'+key]:_g.openid
                        })
                        Wapi.comm.voiceBind(json => {
                            // console.log(json,'用于后台统计数据')
                        },0x9000,{
                                openid: _g.openid,
                                did: _g.did?_g.did:'',
                                mobile: data.mobile,
                                plate: plate,
                                uid: _g.creator,
                                distributionId:_g.distributionId?_g.distributionId:''
                        });
                        debugger;
                        if(!_g.did){  //添加统计和创建普通二维码短码
                            Wapi.qrLink.add(re=>{ //普通绑定二维码先创建短码再绑定 //用于车主自己打印二维码
                                console.log('普通二维码创建短链',re)
                                let _id=changeToLetter(re.autoId);
                                Wapi.qrLink.update(json=>{
                                    console.log('普通二维码创建短链',json)
                                },{
                                    _objectId:re.objectId,
                                    access_token:r.access_token,
                                    id:_id
                                })
                            },{
                                i:1,
                                type:2,
                                access_token:r.access_token,
                                url:'http://'+WiStorm.config.domain.user+'/wo365_user'+'/movecar.html?intent=logout&needOpenId=true'
                                    +'&plate1='+plate
                                    +'&driver_openid='+_g.openid
                                    +'&message='+that.state.default
                                    +'&mobile='+data.mobile
                                    +'&wx_app_id='+_g.wx_app_id
                            });  
                            
                            Wapi.customer.update(cust => {
                                console.log('普通挪车卡绑定次数',cust)
                            },{
                                _objectId:_g.creator,
                                access_token:r.access_token,
                                car_bind:'+1',
                            })
                        }
                        if(_g.did){ //添加绑定次数和一物一码挪车短链
                            Wapi.qrDistribution.update(qrUp => { //
                            console.log('添加批量绑定次数成功',qrUp)
                            },{
                                _objectId:_g.distributionId,
                                access_token:r.access_token,
                                bind_num:'+1'
                            })
                            Wapi.customer.update(cust => { //总绑定次数
                                console.log('添加总绑定次数成功',cust)
                            },{
                                _objectId:_g.creator,
                                access_token:r.access_token,
                                onecar_bind:'+1',
                            })
                        
                            Wapi.qrLink.add(re=>{ //新建挪车短链
                                console.log('一物一码qrlink挪车短链',re)
                            },{
                                id:_g.did,
                                type:2,
                                access_token:r.access_token,
                                url:'http://'+WiStorm.config.domain.user+'/wo365_user'+'/movecar.html?intent=logout'
                                +'&creator='+_g.creator
                                +'&did='+_g.did
                                +'&distributionId='+_g.distributionId
                                +'&driver_openid='+_g.openid+'&needOpenId=true'
                                +'&mobile='+data.mobile
                                +'&message='+that.state.default
                                +'&plate='+plate
                                +'&wx_app_id='+_g.wx_app_id

                            });  
                        }

                        Wapi.user.get(us => {
                            Wapi.customer.get(csg => {
                                if(csg.data){
                                    Wapi.customer.update(cup => {
                                        if(_g.did){//一物一码
                                            Wapi.vehicle.add(veh => { //绑定新增车辆
                                                console.log('一物一码新增车辆',veh)
                                                //推送模板消息
                                                if(us.data.subWx.indexOf(_g.wx_app_id) != -1){
                                                    value = '挪车卡绑定成功，他人扫码挪车时平台将通过拨打'+data.mobile+'通知您！';
                                                    
                                                    sendTemplate(plate,value,null,title);
                                                    // history.back();
                                                    wx.closeWindow();
                                                }else {
                                                    that.open = true;
                                                    that.forceUpdate();
                                                }
                                            },{
                                                uid:csg.data.objectId,
                                                mid:_g.did,
                                                name:that.state.addHeader + that.state.carplate,
                                                access_token:r.access_token,
                                            })
                                        }else{ //普通绑定二维码
                                            Wapi.vehicle.add(veh => { //绑定新增车辆
                                                console.log('普通二维码新增车辆',veh)
                                                if(us.data.subWx.indexOf(_g.wx_app_id) != -1){
                                                    value = '挪车卡绑定成功，他人扫码挪车时平台将通过拨打'+data.mobile+'通知您！';
                                                   
                                                    sendTemplate(plate,value,null,title);
                                                    // history.back();
                                                    wx.closeWindow();
                                                }else {
                                                    that.open = true;
                                                    that.forceUpdate();
                                                }
                                            },{
                                                uid:csg.data.objectId,
                                                name:that.state.addHeader + that.state.carplate,
                                                access_token:r.access_token,
                                            })
                                        }
                                    },{
                                        _objectId:csg.data.objectId,
                                        'other.message':that.state.default,
                                        access_token:r.access_token,
                                    })
                                }else{
                                    Wapi.customer.add(cus => { //注册成为私家车主
                                        console.log('新增私家车主',cus)
                                        if(cus.objectId){
                                            if(_g.did){//一物一码
                                                Wapi.vehicle.add(veh => { //绑定新增车辆
                                                    console.log('一物一码新增车辆',veh)
                                                    //推送模板消息
                                                    if(us.data.subWx.indexOf(_g.wx_app_id) != -1){
                                                        value = '挪车卡绑定成功，他人扫码挪车时平台将通过拨打'+data.mobile+'通知您！';
                                                        sendTemplate(plate,value,null,title);
                                                        // history.back();
                                                        wx.closeWindow();
                                                    }else {
                                                        that.open = true;
                                                        that.forceUpdate();
                                                    }
                                                },{
                                                    uid:cus.objectId,
                                                    mid:_g.did,
                                                    name:that.state.addHeader + that.state.carplate,
                                                    access_token:r.access_token,
                                                })
                                            }else{ //普通绑定二维码
                                                Wapi.vehicle.add(veh => { //绑定新增车辆
                                                    console.log('普通二维码新增车辆',veh)
                                                    if(us.data.subWx.indexOf(_g.wx_app_id) != -1){
                                                        value = '挪车卡绑定成功，他人扫码挪车时平台将通过拨打'+data.mobile+'通知您！';
                                                        sendTemplate(plate,value,null,title);
                                                        // history.back();
                                                        wx.closeWindow();
                                                    }else {
                                                        that.open = true;
                                                        that.forceUpdate();
                                                    }
                                                },{
                                                    uid:cus.objectId,
                                                    name:that.state.addHeader + that.state.carplate,
                                                    access_token:r.access_token,
                                                })
                                            }
                                        }
                                    },{
                                        custType:'私家车主',
                                        custTypeId:7,
                                        tel:data.mobile,
                                        uid:reg.uid,
                                        name:data.mobile,
                                        appId:WiStorm.config.objectId,
                                        access_token:r.access_token,
                                        other:{'message':that.state.default}
                                    })
                                }
                            },{
                                uid:us.data.objectId
                            })
                        },{
                            objectId:reg.uid,
                            access_token:r.access_token,
                        },{
                            fields:'subWx,authData,mobile,objectId'
                        })

                    },{
                        account:data.mobile,
                        password:password
                    });
                        
                }
            },data)
        }


    }



    close(){
        this.open = false;
        this.forceUpdate()
    }
    render(){
        console.log(this.formData)
        console.log(this.state.valid_code,'valid')
        console.log(this.state.vehicle,'vehicle')
        console.log(this.state.carplate)
        // let first = null
        // if(this.state.vehicle.length){
        //     first = this.state.vehicle[0].name
        // }
        let items = this.state.vehicle.map((ele,index) => {
            return(<MenuItem value={ele.name} key={index} primaryText={ele.name}/>)
        })
        let item = pr.map((ele,index) => {
            return(<MenuItem value={ele} key={index} primaryText={ele}/>)
        })
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.noEdit}
            />,
            <FlatButton
                label="确定"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.editClose}
            />,
        ];
        // console.log(this.state.account)
        console.log(this.state.user)
        console.log(this.state.selectCar)
        let mobile = this.state.user?this.state.user.tel:null
        let data = {}
        let first = null
        if(this.state.vehicle.length){
            first = this.state.vehicle[0].name
        }
        //已绑定openid
        if(mobile){
            data.tel = mobile;
        }else { //未绑定openId
            if(this.state.account){
                data.tel = this.state.account;
            }
        }
        if(this.state.selectCar){ //已有车辆选择
            if(this.state.selectCar != 'add'){//选择车辆
                data.plate = this.state.selectCar
            }else if(this.state.selectCar == 'add'){//选择绑定新车辆
                if(this.state.carplate){
                     data.plate = this.state.addHeader + this.state.carplate
                }   
            }
        }else if(this.state.carplate){ //新车辆
            data.plate = this.state.addHeader + this.state.carplate
        }else if(first){
            data.plate = first;
        }
        // console.log(this.state.selectCar,'dd')
        let showbutton = true;
        // if()
        let valid = this.formData.valid_code?true:false;
        if(mobile){
            if(data.tel&&data.plate)  showbutton = false;
        }else{
            if(data.tel&&data.plate&&this.state.valid_code) showbutton = false;
        }
        console.log(showbutton,'showb')
        return(
            <div style={{backgroundColor:'#f7f7f7',minHeight:'100vh'}}>
                <div style={{width:'100%',height:'210px',display:'block',backgroundColor:'#ffffff'}}>
                    <img src='img/movecar.png' style={{width:'100%',height:'100%'}}/>
                </div>
                <div style={{width:'100%',lineHeight:'50px',display:'block',textAlign:'center'}}>
                    {'绑定挪车卡'}
                </div>
                {/*如果openId有登录账号就直接显示电话号码否则就输入手机号码并验证*/}

                {/*如果有车辆信息就显示车辆列表并绑定新车牌 否则就输入车辆信息并绑定新车牌*/}
                {
                    items.length?
                    <div style={{background:'#fff',padding:'0 10px'}}>
                        <SelectField
                            value={this.state.selectCar?this.state.selectCar:first}
                            maxHeight={200}
                            style={{width:'100%'}}
                            onChange={this.selectCar}
                        >
                            {items}
                            {/*<MenuItem value='add' children={<FlatButton label={'绑定新车牌'}  labelStyle={{paddingLeft:0}} primary={true} onClick={this.addCar} />}/>*/}
                            <FlatButton label={'绑定新车牌'} labelStyle={{paddingLeft:24}} primary={true} onClick={this.addCar} value='add'/>                            
                        </SelectField>
                    </div>
                    :
                    <div style={{background:'#fff',padding:'0 10px',height:'48px'}}>
                        <SelectField
                            value={this.state.addHeader}
                            maxHeight={200}
                            style={{width:'12%'}}
                            onChange={this.addHeader}
                        >
                            {/*<MenuItem value={0} key={0} primaryText={'粤'}/>*/}
                            {item}
                        </SelectField>
                        <TextField hintText={'输入车牌号码'}  onChange={this.addPlate} style={{width:'88%',top:'-4px'}} />
                    </div>
                }
                {/*点击新增车牌号码显示*/}
                {
                    this.state.showadd ? 
                    <div style={{background:'#fff',padding:'0 10px',height:'48px'}}>
                        <SelectField
                            value={this.state.addHeader}
                            maxHeight={200}
                            style={{width:'12%'}}
                            onChange={this.addHeader}
                        >
                            {/*<MenuItem value={0} key={0} primaryText={'粤'}/>*/}
                            {item}
                        </SelectField>
                        <TextField hintText={'请输入车牌号码'}  onChange={this.addPlate} style={{width:'88%',top:'-4px'}} />
                    </div>
                    :
                    null
                }
                {/*<div style={{background:'#fff',padding:'0 10px'}}>
                    <TextField hintText={mobile} disabled={true} style={{width:'100%'}} />
                </div>*/}
                {
                    mobile ? 
                    null
                    :
                    <div style={{background:'#fff',padding:'0 10px'}}>
                        <Input
                            name='account'
                            hintText={'输入接收挪车回复的手机号码，不会显示给他人。'}
                            floatingLabelText={___.phone_num}
                            onChange={this.accountChange}
                            type='tel'
                        />
                        <VerificationCode 
                            name='valid_code'
                            type={3}
                            account={this.state.account} 
                            onSuccess={this.change}
                            onChange={this.change}
                        />
                    </div>
                }
               
                <div style={{background:'#fff',padding:'0 10px',height:'40px'}}>
                    <span style={{display:'inline-block',float:'left',lineHeight:'40px',color:'#ccc'}}>{'他人扫码挪车时显示的车主留言'}</span>
                    <FlatButton label={'修改'} primary={true} onClick={this.editOpen} style={{float:'right',minWidth:'50px'}} labelStyle={{paddingRight:'16px'}}/>
                </div>
                <Dialog
                    title="修改留言"
                    titleStyle={{fontSize:'16px'}}
                    actions={actions}
                    open={this.state.open}
                    onRequestClose={this.editClose}
                    >
                    <TextField 
                        name={'留言'} 
                        hintText={this.state.default}  
                        style={{width:'100%',minHeight:100}} 
                        onChange={this.setDefault}
                        multiLine={true}
                        rows={1}
                        rowsMax={4}
                        errorText={this.state.wordWrap?'字数超出限制':null}
                    />
                </Dialog>
                <p style={{textIndent:'2em',background:'#fff',lineHeight:'30px',margin:'0px',padding:'5px 10px'}}>{this.state.default}</p>
                {/*<TextField hintText="Hint Text"/>*/}
                <div style={{width:'100%',display:'block',textAlign:'center'}}>
                    <RaisedButton label={'绑定'}  disabled={showbutton} primary={true} onClick={() => {this.submit()}} style={{backgroundColor:'#f7f7f7',margin:'20px 0'}}/>
                </div>
                <SonPage open={this.open} back={this.close}>
                    <ShowBin data={data}/>
                </SonPage>
            </div>
            
        )
    }
}

// let pr = ['新','粤']
var i = 5
class MoveCar extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            default:'',
            default1:'您的爱车挡住路啦，麻烦挪一下吧！',
            open:false,
            account:null,
            plate:null,
            addplateCar:"粤",
            addplate:null,
            user:null,
            carMobile:null,
            customer:null,
            driver_openid:null,
            wordWrap:null,
            plateValue:null
        }
        this.editClose = this.editClose.bind(this);
        this.noEdit = this.noEdit.bind(this);
        this.editOpen = this.editOpen.bind(this);
        this.setDefault = this.setDefault.bind(this);
        this.change = this.change.bind(this);
        this.accountChange = this.accountChange.bind(this);
        this.submit = this.submit.bind(this);
        this.close = this.close.bind(this);
        this.selectCar = this.selectCar.bind(this);
        this.addPlate = this.addPlate.bind(this);
        this.updateColum = this.updateColum.bind(this)
        this.open = false;
        this.formData={
            mobile:null,
            valid_code:null,
            password:null,
            valid_type:1
        };
    }
    componentDidMount() {   
        let plate =  W.getCookie('plate')
        let head = plate.slice(0,1);
        if(head){
            this.setState({addplateCar:head})
        }
        if(plate){
            Wapi.serverApi.getMoveCarInfo(res => {
                if(res){
                    this.setState({default:res.message})
                    this.setState({carMobile:res.mobile})
                    if(!_g.driver_openid){
                        this.setState({driver_openid:res.openid})
                    }
                }
            },{
                plate:plate
            })
        }
        this.setState({plate:plate});        
        // let driver_openid = W.getCookie('driver_openid')
        // let plate = W.getCookie('plate')
        // let message = W.getCookie('message')
        // let carMobile =W.getCookie('carMobile')
        // this.setState({default:message});
        // this.setState({carMobile:carMobile})
        // if(!_g.driver_openid){
        //     this.setState({driver_openid:driver_openid})
        // }
        if(_g.did){ //一物一码获取车牌号码和车主信息(车主)
            // debugger;
            this.setState({plate:_g.plate});
            this.setState({carMobile:_g.mobile})
            this.setState({default:_g.message})
           
        }
        if(_g.plate1){ //车主自己打印的二维码(车主)

            this.setState({plate:_g.plate1});
            this.setState({carMobile:_g.mobile})
            this.setState({default:_g.message})

        }

        if(_g.status_code == 0){
        
            if(_g.openid){
                //判断openId是否有绑定登录账号/用户接收公众推送消息(扫码用户)
                // debugger;
                let key = getOpenIdKey();
                Wapi.user.list(res => { //获取扫码用户信息
                    // console.log(res.data,'data')
                    this.setState({user:res.data[0]})
                    if(res.data.length){
                        Wapi.customer.get(cus => {
                            this.setState({customer:cus.data})
                            if(cus.data.other){
                                if(cus.data.other.message1){
                                    this.setState({default1:cus.data.other.message1})
                                }
                            }
                        },{
                            uid:res.data[0].objectId
                        })
                    }
                },{
                    ['authData.'+key]:_g.openid
                },{
                    fields:'subWx,authData,mobile,objectId'
                })
            }
        }
    
    }
    //选择车辆号首位例如‘粤’
    selectCar(e,v,i){
        this.setState({addplateCar:i})
    }
    //输入后面的车牌序号
    addPlate(e,v){
        // console.log(v,'value')
        // console.log(v.length,'dd')
        this.setState({plate:null})
        this.setState({plateValue:v})
        let plate = this.state.addplateCar + v
        if(v.length == 6){
            Wapi.serverApi.getMoveCarInfo(res => {
                if(res){
                    this.setState({addplate:v})
                    this.setState({default:res.message})
                    this.setState({driver_openid:res.openid})
                    this.setState({carMobile:res.mobile})
                }else {
                    W.alert('请输入正确的车牌号')
                }
            },{
                plate:plate
            })
           
        }
    }
     //打开修改留言
    editOpen(){
        this.setState({open:true})
    }
    //取消修改留言
    noEdit(){
        // this.value = this.state.default1
        this.setState({open:false})
        // this.setState({default1:this.value})        
    }
    //确定修改留言
    editClose(){
        this.setState({open:false})
        this.setState({default1:this.value})
    }
    //修改默认留言
    setDefault(e,val){
        // console.log(e,val,'dd')
        if(val.length>41){
            // W.alert('字数超出限制')
            this.setState({wordWrap:true})
        }else{
            this.setState({wordWrap:false})
            this.value=val;
        }
    }
    //输入手机号码并验证
    accountChange(e,val){
        let reg=/^[1][3578][0-9]{9}$/;
        if(reg.test(val)){
            this.formData['mobile']=val;  
            this.setState({account:val}); 
        }
    }
    //输入验证码
    change(val,name){
        this.formData[name]=val;
        this.forceUpdate()
    }
    //呼叫车主挪车
    submit(){
        // this.state.user         扫码用户user信息
        // this.state.customer     扫码用户customer信息
        // this.state.carCustomer  车主用户customer信息
        // this.state.carMobile      车主用户user信息
        // this.state.default      车主留言
        let openid = null;     //车主的openid
        if(_g.driver_openid){
            openid = _g.driver_openid
        }else {
            openid = this.state.driver_openid
        }
        //判断手机是否输入正确
        // console.log(this.formData.mobile,'mobile')
        
        // console.log(this.formData.mobile)
       if(this.formData.mobile){
            if(this.formData.mobile.length==11){
                this.formData.password=this.formData.mobile.slice(-6);
            }else{
                W.alert(___.phone_err);
                return;
            }
       }
       let data = Object.assign({},this.formData)
        // this.open = true;
        // this.forceUpdate()
        let plate = null;
        
        if(this.state.addplate){
           plate = this.state.addplateCar+this.state.addplate
        }else if(_g.plate1){
            plate = _g.plate1
        }else if(_g.plate){
            plate = _g.plate
        }else if(this.state.plate){
            plate = this.state.plate
        }
        W.setCookie('plate',plate,-30) //存车牌号码
        // W.setCookie('message',this.state.default,-30) //存留言
        // W.setCookie('driver_openid',openid,-30)
        // W.setCookie('carMobile',this.state.carMobile,-30)
        // // this.state.carMobile//车主手机号码
        //更新挪车次数
       
        //发送给车主的模板消息
        // if(this.state.carMobile){
            // let mes = '对方留言:'+this.state.default1
            // let title = "挪车通知"
            // sendTemplate(plate,mes,openid,title); //发送给车主
        // }

        let mobile = this.state.user//（扫码用户）
        let tel = null   //车主号码
        // if(this.state.carMobile){
        //   tel = this.state.carMobile.substring(0,3)+"****"+this.state.carMobile.substring(7,this.state.carMobile.length)
        // }
        if(_g.status_code == 0){
             this.updateColum()
             if(mobile){ //(扫码用户)
                let value ;
                Wapi.customer.update(cup => {

                },{
                    _objectId:this.state.customer.objectId,
                    'other.message1':this.state.default1,
                })
                if(this.state.user.subWx.indexOf(_g.wx_app_id) != -1){
                    Wapi.comm.voiceCall(json => {
                        // history.back();
                        W.alert('正在通知车主挪车',()=>{wx.closeWindow();})
                        // wx.closeWindow();
                    },0x9001,{
                            openid: _g.openid,
                            driver_openid: openid,
                            did: _g.did?_g.did:'',
                            mobile: this.state.carMobile,
                            plate: plate,
                            message: '对方留言：'+this.state.default1,
                            wxAppKey: _g.wx_app_id,
                            uid: _g.creator,
                    })
                }else {
                    this.open = true;
                    this.forceUpdate()
                }  
            } 
        }else{//注册用于接收公众号推送消息（扫码用户）
            if(this.formData.mobile){
                let that = this
                let value;
                let key = getOpenIdKey();
                let op = Object.assign({},data);
                let password = data.mobile.slice(-6)
                Wapi.user.register(reg => {
                    if(reg.status_code == 0||reg.status_code == 8){
                        Wapi.user.login(r => {
                            Wapi.user.update(res => {
                                console.log('更新openid',res)
                            },{
                                _objectId:reg.uid,
                                access_token:r.access_token,
                                ['authData.'+key]:_g.openid
                            })
                            this.updateColum(r.access_token)
                            Wapi.customer.get(res => {
                                if(!res.data){
                                    Wapi.customer.add(cus => { //扫码用户
                                        console.log('添加扫码用户成为私家车主',cus)
                                    },{
                                        custType:'私家车主',
                                        access_token:r.access_token,
                                        custTypeId:7,
                                        tel:data.mobile,
                                        uid:reg.uid,
                                        name:data.mobile,
                                        appId:WiStorm.config.objectId,
                                        other:{'message1':that.state.default1}
                                    })
                                }else{
                                    Wapi.customer.update(cus => {

                                    },{
                                        access_token:r.access_token,
                                        _objectId:res.data.objectId,
                                        'other.message1':that.state.default1
                                    })
                                }
                            },{
                                access_token:r.access_token,
                                uid:reg.uid
                            })
                            Wapi.user.get(ress => {
                                console.log('获取是否关注公众号',ress)
                                if(ress.data.subWx.indexOf(_g.wx_app_id) != -1){
                                    Wapi.comm.voiceCall(json => {
                                        // history.back();
                                        W.alert('正在通知车主挪车',()=>{wx.closeWindow();})
                                        // wx.closeWindow();
                                    },0x9001,{
                                            openid: _g.openid,
                                            driver_openid: openid,
                                            did: _g.did?_g.did:'',
                                            mobile: that.state.carMobile,
                                            plate: plate,
                                            message: '对方留言：'+that.state.default1,
                                            wxAppKey: _g.wx_app_id,
                                            uid: _g.creator,
                                    })
                                }else {
                                    that.open = true;
                                    that.forceUpdate();
                                }
                            },{
                                mobile:data.mobile,
                                access_token:r.access_token
                            },{
                                fields:'subWx,authData,mobile,objectId'
                            })
                        },{
                            account:data.mobile,
                            password:password
                        })   
                    }
                },op)

            }
        } 
    }

    updateColum(access_token){
        if(access_token){
            if(_g.did){ //一物一码
                Wapi.qrDistribution.update(res => {
                    console.log('更新一物一码qr挪出次数',res)
                },{
                    _objectId:_g.distributionId,
                    access_token:access_token,
                    move_num:'+1'
                })
                Wapi.customer.update(re => {
                    console.log('更新一物一码cus挪出次数',re)
                },{
                    _objectId:_g.creator,
                    access_token:access_token,
                    onecar_move:'+1'
                })
            }else {//普通二维码
                Wapi.customer.update(re => {
                    console.log('更新普通二维码cus挪出次数',re)
                },{
                    _objectId:_g.creator,
                    access_token:access_token,
                    car_move:'+1'
                })
            }
        }else{
            if(_g.did){ //一物一码
                Wapi.qrDistribution.update(res => {
                    console.log('更新一物一码qr挪出次数',res)
                },{
                    _objectId:_g.distributionId,
                    move_num:'+1'
                })
                Wapi.customer.update(re => {
                    console.log('更新一物一码cus挪出次数',re)
                },{
                    _objectId:_g.creator,
                    onecar_move:'+1'
                })
            }else {//普通二维码
                Wapi.customer.update(re => {
                    console.log('更新普通二维码cus挪出次数',re)
                },{
                    _objectId:_g.creator,
                    car_move:'+1'
                })
            }
        }
        
    }
    //隐藏二维码
    close(){
        this.open = false;
        this.forceUpdate();
    }
    
    render() {
        // let pr = ['新','粤']
        console.log(this.state.addplate,'plate')
        console.log(this.state.addplateCar)
        let plate = null;
        let plateValue = null;
        if(this.state.addplate){
            plate = this.state.addplateCar+this.state.addplate
            // dd = addplate
        }else if(_g.plate){
            plate = _g.plate
        }else if(_g.plate1){
            plate = _g.plate1
        }else if(this.state.plate){
            plate = this.state.plate;
            plateValue = this.state.plate.substring(1,8);
        }
        if(this.state.plateValue){
            plateValue = this.state.plateValue;
        }
        console.log(plate,'plate')
        let items = pr.map((ele,index) => {
            return(<MenuItem value={ele} key={index} primaryText={ele}/> )
        })
        console.log(this.state.plate,_g.plate,'trueorfaluse')
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.noEdit}
            />,
            <FlatButton
                label="确定"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.editClose}
            />,
        ];
        let mobile = this.state.user?this.state.user.mobile:null //扫码用户
        let op = {}
        console.log(this.state.carMobile,'user')
        if(this.state.carMobile){ //一物一码或者普通二维码车牌获取到的车主信息
            op =  {
                plate:plate,
                mobile:this.state.carMobile
            }   
            console.log(this.state.carMobile)
        }
        op.tel = mobile? mobile : this.state.account  //扫码用户
        op.driver_openid = this.state.driver_openid
        op.message = this.state.default1
        // let dd = plate.toString()
        let showbutton = true;
        if(mobile){
            if(this.state.plate){
                showbutton = false;
            }else if(this.state.addplate){
                showbutton = false;
            }else {
                showbutton = true;
            }
        }else{
            if(plate&&this.formData.mobile&&this.formData.valid_code){
                showbutton = false;
            }else {
                showbutton = true;
            }
        }
        
        return (
            <div style={{backgroundColor:'#f7f7f7',minHeight:'100vh'}}>
                <div style={sty.img}>
                    <img src='img/movecar.png' style={{width:'100%',height:'100%'}}/>
                </div>
                <div style={sty.h2}>
                    {'恶意通知车主挪车的用户将被关入小黑屋哦!'}
                </div>
                {/*如果是普通挪车卡输入车牌号码*/}
                {
                    (_g.plate||_g.plate1)?
                    null
                    :
                    <div style={{background:'#fff',padding:'0 10px',height:'48px'}}>
                        <SelectField
                            value={this.state.addplateCar}
                            maxHeight={200}
                            style={{width:'12%'}}
                            onChange={this.selectCar}
                        >
                            {items}
                        </SelectField>
                        <TextField hintText={'请输入车牌号码'}  value={plateValue} onChange={this.addPlate} style={{width:'88%',top:'-4px'}} />
                    </div>
                    
                }

                {/*如果是普通挪车卡显示车主留言，如果是一物一码显示车牌号码加车主留言*/}
               { this.state.addplate?
                    <div style={{background:'#fff'}}>
                        <div style={{background:'#fff',padding:'0 10px',height:'30px'}}>
                            <span style={{display:'inline-block',float:'left',lineHeight:'30px'}}>{'车主留言'}</span>
                        </div>
                        <p style={sty.p}>{this.state.default}</p>
                        <hr style={{margin:'0 10px',marginTop:10,border:0,borderBottom:'1px solid #e0e0e0'}}/>
                    </div>
                    :(
                        (_g.plate||_g.plate1)?
                        <div style={{background:'#fff'}}>
                            <div style={{background:'#fff',padding:'0 10px',height:'30px'}}>
                                <span style={{display:'inline-block',float:'left',lineHeight:'30px'}}>{plate+'车主留言'}</span>
                            </div>
                            <p style={sty.p}>{this.state.default}</p>
                            <hr style={{margin:'0 10px',marginTop:10,border:0,borderBottom:'1px solid #e0e0e0'}}/>
                        </div>
                        :
                        (this.state.plate?
                            <div style={{background:'#fff'}}>
                                <div style={{background:'#fff',padding:'0 10px',height:'30px'}}>
                                    <span style={{display:'inline-block',float:'left',lineHeight:'30px'}}>{'车主留言'}</span>
                                </div>
                                <p style={sty.p}>{this.state.default}</p>
                                <hr style={{margin:'0 10px',marginTop:10,border:0,borderBottom:'1px solid #e0e0e0'}}/>
                            </div>
                            :
                            null
                        )
                    )
                    
               }
                {/*如果openId绑定有登录账号直接显示手机号码否则输入手机号验证*/}
                {
                    !mobile ? 
                    <div style={{background:'#fff',padding:'0 10px'}}>
                        <Input
                            name='account'
                            hintText={'输入接收挪车回复的手机号码,不会显示给车主。'}
                            onChange={this.accountChange}
                            type='tel'
                        />
                        <VerificationCode 
                            name='valid_code'
                            type={4}
                            account={this.state.account} 
                            onSuccess={this.change}
                            onChange={this.change}
                        />
                    </div>
                    :
                    null
                }
               { /*<div style={{background:'#fff',padding:'0 10px'}}>
                    <TextField hintText={mobile} disabled={true} style={{width:'100%'}} />
                </div>*/}
                <div style={{background:'#fff',padding:'0 10px',height:'40px'}}>
                    <span style={{display:'inline-block',float:'left',lineHeight:'40px',color:'#ccc'}}>{'我给车主留言'}</span>
                    <FlatButton label={'修改'} primary={true} onClick={this.editOpen} style={{float:'right',minWidth:'50px'}} labelStyle={{paddingRight:'16px'}}/>
                </div>
                <Dialog
                    title="修改留言"
                    titleStyle={{fontSize:'16px'}}
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.editClose}
                    >
                    <TextField name={'留言'} 
                        hintText={this.state.default1}  
                        style={{width:'100%',minHeight:100}} 
                        onChange={this.setDefault}
                        errorText={this.state.wordWrap?'字数超出限制':null}
                        multiLine={true}
                        rows={1}
                        rowsMax={4}
                    /> 
                </Dialog>
                <p style={sty.p}>{this.state.default1}</p>
                {/*<TextField hintText="Hint Text"/>*/}
                <div style={{width:'100%',display:'block',textAlign:'center'}}>
                    <RaisedButton label={'通知车主挪车'} disabled={showbutton} primary={true} onClick={() => {this.submit()}} style={{backgroundColor:'#f7f7f7',margin:'20px 0'}}/>
                </div>
                <SonPage open={this.open} back={this.close}>
                    <ShowMove data={Object.assign({},op)}/>
                </SonPage>
            </div>
        );
    }
}

//挪车模板通知
function sendTemplate(plate,value,openid,title){
    let car_openid=null;
    if(openid){
        car_openid = openid
    }else{
        car_openid = _g.openid
    }

    Wapi.serverApi.sendWeixinByTemplate(send=>{   //发送给扫码用户
        // console.log('第二次呼叫失败推送扫码用户模板消息',send);
    },{
        openId:car_openid,   //车主的openid
        wxAppKey:_g.wx_app_id,
        templateId:'OPENTM202521861',
        type:'0',
        data:{
            "first": {//标题
                "value": title,
                "color": "#173177"
            },
            "keyword1": {//车牌号
                    "value": plate,
                    "color": "#173177"
            },
            "keyword2": {//通知时间
                "value": W.dateToString(new Date()),
                "color": "#173177"
            },
            "remark": {
                "value": value,
                "color": "#173177"
            }
        }
    });
}



// var fn = null
function getResult(call,callback){
    Wapi.call.get(re => {
        if(re.data.result){
            i = -1;
            callback(re.data.result)
        }else {
            if(i>0){
                setTimeout(() =>{i--;getResult(call,callback)},15000)
            }else {
                callback({result:-1})
            }
        }
    },{
        callid:call
    })
}


// 绑定之后展示公众号二维码
class ShowBin extends Component {
    constructor(props,context){
        super(props,context)
        this.data = {}
        this.state ={
            url:'',
            plate:null
        }
    }
    componentWillReceiveProps(nextprops){
        if(nextprops.data){
            this.setState({plate:nextprops.data.plate})
            let did = _g.did || '';
            let op = {
                    did: did,
                    mobile: nextprops.data.tel,
                    plate:nextprops.data.plate,
                    uid:_g.creator
                }
            Wapi.serverApi.getAnyQrcode(res=>{//获取二维码
                if(res.status_code){
                    W.alert(res.err_msg);
                    return;
                }
                this.setState({url:res.url});
            },{
                type:1002,//扫码绑定
                data:JSON.stringify(op),
                wxAppKey:_g.wx_app_id
            });
        }
    }
    render(){
        console.log(this.props.data,'data')
        let height = window.screen.height;
        let plate = this.state.plate;
        return(
            <div style={{textAlign:'center',padding:'70px 0',backgroundColor:'#f7f7f7',height:height, background:'url(img/device.jpg) no-repeat',backgroundSize:'100% 50%'}}>
                {/*<h4>绑定挪车卡</h4>
                <p>{'车牌号码:'+this.props.data.plate}</p>
                <p>{'车主手机:'+this.props.data.tel}</p>*/}
                {/*<QrImg data={this.state.url} style={{display:'inline-block',marginTop:'10px'}}/>*/}
                <div style={{marginTop:'70%'}}>
                    <img style={{width:'128px',height:'128px'}} src={this.state.url}/>
                    <p style={{fontWeight:600}}>{''+plate+'绑定成功'}</p>                    
                    <p>{'['+'长按识别二维码，关注公众号接收挪车通知!'+']'}</p>
                </div>
            </div>
        )
    }
}

// 呼叫挪车之后展示公众号二维码
class ShowMove extends Component {
    constructor(props,context){
        super(props,context)
        this.data = {}
        this.state ={
            url:'',
            plate:props.data.plate
        }
    }
    componentWillReceiveProps(nextprops){
         console.log(nextprops.data,'111')
         
        if(nextprops&&nextprops.data){
            this.setState({plate:nextprops.data.plate})
            console.log('11')
            var did = _g.did || '';
            var driver_openid = _g.driver_openid?_g.driver_openid:nextprops.data.driver_openid
            let op = {
                did: did,
                mobile: nextprops.data.mobile,
                plate:nextprops.data.plate,
                uid:_g.creator,
                driver_openid: driver_openid,
                message:'对方留言：'+nextprops.data.message
            }
            console.log(op,'p[p')
            Wapi.serverApi.getAnyQrcode(res=>{//获取二维码
                if(res.status_code){
                    W.alert(res.err_msg);
                    return;
                }
                console.log(res.url,'url')
                this.setState({url:res.url});
            },{
                type:1003,//扫码挪车
                data: JSON.stringify(op),
                wxAppKey:_g.wx_app_id
            });
        }
    }
    render(){
        console.log(this.props.data,'showcall')
        this.data = this.props.data        
        let mobile = this.data.mobile
        // console.log(this.pr)
        let plate = this.state.plate
        let tel = null
        if(mobile){
          tel = mobile.substring(0,3)+"****"+mobile.substring(7,mobile.length)
        }
        return(
            <div style={{textAlign:'center',padding:'70px 0',backgroundColor:'#f7f7f7',minHeight:'100vh' ,background:'url(img/device.jpg) no-repeat',backgroundSize:'100% 50%'}}>
                {/*<h4>{'扫码挪车'}</h4>
                <p style={{padding:'0 50px'}}>{'平台正在拨打'+this.data.plate+'车主预留的联系电话'+tel+'通知挪车,请稍等!'}</p>*/}
                {/*<QrImg data={this.state.url} style={{display:'inline-block',marginTop:'10px'}}/>*/}
                <div style={{marginTop:'70%'}}>
                    <img style={{width:'128px',height:'128px'}} src={this.state.url}/>
                    <h4 style={{fontWeight:600}}>{'平台正在拨打'+plate+'预留电话...'}</h4>                    
                    <p>{'['+'长按识别二维码，关注公众号接收挪车回复!'+']'}</p>
                </div>
            </div>
        )
    }
}
function changeNum(str){
    var data = [];
    data = str.split('').join(' ');
    return data;
}