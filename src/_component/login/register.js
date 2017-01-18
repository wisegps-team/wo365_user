/**
 * 注册用户组件
 */
"use strict";

import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import VerificationCode from '../base/verificationCode';
import Input from '../base/input';
import PasswordRepeat from './password';
import sty from './style';

class Register extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            accountType:'phone', //表示是用什么注册
            mobile:null,
            car:[],
            s_num:0,
            s_mob:1
        }
        this.formData=Object.assign({},props.formData);
        this.formData.valid_type=1;
        this.state.mobile=this.formData.mobile;

        this.change = this.change.bind(this);
        this.accountChange = this.accountChange.bind(this);
        this.submit = this.submit.bind(this);
        this.success = this.success.bind(this);
        this.selectMobil = this.selectMobil.bind(this);
        this.selectNum = this.selectNum.bind(this);
        this.newNumChange = this.newNumChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.formData=Object.assign(this.formData,nextProps.formData);
        if(this.props.clean){
            for(let k in this.formData)
                this.formData[k]='';
            this.formData.valid_type=1;
            this.formData.mobile='';            
        }
    }

    componentDidMount() {
        if(_g.uid&&_g.token){//已有账号，扫码进来
            this.getUser(_g.uid,_g.token);
        }else if(this.state.mobile){
            Wapi.user.login(res=>{//尝试使用手机号后6位作为密码登录
                if(!res.status_code)//如果登录不成功，则无法进行下面的操作
                    this.getUser(res.uid,res.access_token);
            },{
                account:this.state.mobile,
                password:this.state.mobile.slice(-6)
            });
        }
    }

    getUser(uid,token){
        this._login={
            uid,
            access_token:token
        }
        Wapi.user.get(user=>{//获取手机号
            this.formData.mobile=user.data.mobile;
            this.setState({mobile:this.formData.mobile});
            Wapi.customer.get(cust=>{//获取客户表信息
                if(cust.data){
                    Wapi.vehicle.list(ve=>{
                        ve.data=ve.data?ve.data:[];
                        this._car=ve.data;
                        this.setState({car:ve.data});
                    },{
                        access_token:token,
                        uid:cust.data.objectId,
                    });
                }else
                    this._car=[];
            },{
                access_token:token,
                uid:user.data.objectId,
                appId:WiStorm.config.objectId
            })
        },{
            objectId:uid,
            access_token:token
        });
    }
    
    success(res){
        if(!res.status_code||res.status_code==8){
            Object.assign(res,this.formData,this._login,res);
            if(this.state.s_num){
                res.carId=this.state.s_num;
            }else{
                res.carNum=this._newNum;
            }

            if(!res.access_token){
                Wapi.user.login(r=>{
                    Object.assign(res,r);
                    this.props.onSuccess(res);
                },{
                    account:this.formData.mobile,
                    password:this.formData.password
                });
            }else
                this.props.onSuccess(res);
        }else{
            W.loading();
            W.errorCode(res);
        } 
    }
    submit(){
        if(this.formData.mobile&&this.formData.mobile.length==11){
            this.formData.password=this.formData.mobile.slice(-6);
        }else{
            W.alert(___.phone_err);
            return;
        }
        if(!this.formData.valid_code){
            W.alert(___.code_err);
            return;
        }
        if(this.state.s_num<=0&&!this._newNum){
            W.alert(___.pls_input_new_car_num);
            return;
        }

        let data=Object.assign({},this.formData);
        if(!data.mobile&&!data.email){
            W.alert('mobile'+___.not_null);
            return;
        }
        W.loading(true,___.registering);
        if(!this.props.beforRegister||this.props.beforRegister(data))
            Wapi.user.register(this.success,data);
    }

    accountChange(e,val){
        let phoneReg=/^[1][3578][0-9]{9}$/;
        let emailReg=/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        if(phoneReg.test(val)){
            this.formData['mobile']=val;  
            delete this.formData.email;
            this.setState({mobile:val,accountType:'mobile'}); 
        }
    }
    change(val,name){
        this.formData[name]=val;
    }

    selectMobil(s_mob){
        let newState={s_mob};
        if(s_mob==1){
            this.formData.mobile=this.state.mobile;
            this.formData.valid_code=this.props.formData.valid_code
            newState.car=this._car;
        }else{
            this.formData.mobile='';
            this.formData.valid_code='';
            newState.car=[];
        }
        this.setState(newState);
    }
    selectNum(value){
        console.log(value);
        let car=this.state.car.find(e=>e.name==value);
        let s_num=0;
        if(car){
            //已有车辆
            if(this.state.s_mob!=1)return;//如果是新手机注册，不能选择现有车辆
            s_num=car.objectId;
            this._newNum='';
        }else{
            //新车辆
            this.newNumChange(value);
            return;
        }
        this.setState({s_num});
    }

    newNumChange(val){
        this._newNum=val;
    }

    render() {
        let cars=this.state.car||[];

        return (
            <div style={this.props.style}>
                <MobileSelect 
                    value={this.state.s_mob} 
                    onChange={this.selectMobil}
                    onNewChange={this.accountChange}
                    mobile={this.state.mobile}
                />
                <CarNum data={cars} onChange={this.selectNum}/>
                <VerificationCode 
                    name='valid_code'
                    type={1}
                    accountType={this.state.accountType}
                    account={this.formData.mobile} 
                    onSuccess={this.change}
                    value={this.formData.valid_code}
                    clean={this.props.clean}
                />
                <RaisedButton label={___.register} primary={true} style={sty.but} onClick={this.submit}/>
            </div>
        );
    }
}

let styles={
    box:{
        position:'relative'
    },
    b:{
        position: 'absolute',
        right: '0px',
        bottom: '8px'
    },
    more:{
        color:'rgb(33, 150, 243)',
        position:'absolute',
        left: '5em',
        top: 0,
        lineHeight: '56px',
        pointerEvents: 'none'
    }
}

//选择车牌号组件
class CarNum extends Component {
    constructor(props) {
        super(props);
        this.state={
            getNew:false,
            value:this.props.data.length?this.props.data[0].name:''
        }

        this.getNew = this.getNew.bind(this);
        this.change = this.change.bind(this);
    }
    componentDidMount() {
        this.props.onChange(this.state.value);
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.state.value!=prevState.value)
            this.props.onChange(this.state.value);
    }
    componentWillReceiveProps(nextProps) {
        if(!this.props.data.length&&nextProps.data.length)
            this.setState({value:nextProps.data[0].name});
    }
    
    getNew(){
        let newState={getNew:!this.state.getNew};
        if(!newState.getNew)
            newState.value=this.props.data[0].name;
        this.setState(newState);
    }
    change(e,value){
        this.setState({value});
    }

    render() {
        let cars=this.props.data;
        let select=null;
        let b=Object.assign({},styles.b);
        if(cars.length){
            b.bottom='2px';
            let item=cars.map((e,i)=><MenuItem value={e.name} primaryText={e.name} key={e.objectId}/>);
            let more=cars.length>1?<span style={styles.more} key='span'>{___.more}</span>:null;
            select=[
                <DropDownMenu 
                    value={this.state.value} 
                    onChange={(e,i,v)=>this.change(e,v)} 
                    style={{width:'100%'}} 
                    labelStyle={{padding:'0px'}}
                    underlineStyle={{margin:'0px'}}
                    key='menu'
                >
                    {item}
                </DropDownMenu>,
                more,
                <FlatButton 
                    label={___.bind_new_car} 
                    primary={true} 
                    onClick={this.getNew}
                    style={b}
                    key='btn'
                />
            ];
        }else{
            select=<Input
                floatingLabelText={___.input_new_car_num}
                onChange={this.change}
            />;
        }
        if(this.state.getNew){//选择绑定新车辆，输入车牌号码
            select=[
                <Input
                    floatingLabelText={___.input_new_car_num}
                    onChange={this.change}
                    key='input'
                />,
                <FlatButton 
                    label={___.register_old_car} 
                    primary={true} 
                    onClick={this.getNew}
                    style={styles.b}
                    key='btn1'
                />
            ];
        }
        return (
            <div style={styles.box}>
                {select}
            </div>
        );
    }
}


class MobileSelect extends Component{
    constructor(props) {
        super(props);
        this.state={
            getNew:props.value==1?false:true,
            value:''
        };

        this.getNew = this.getNew.bind(this);
        this.change = this.change.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let getNew=nextProps.value==1?false:true;
        this.setState({getNew});
    }
    
    
    getNew(){
        let newState=!this.state.getNew?0:1;
        this.props.onChange(newState);
        if(newState)
            this.setState({value:''});
    }
    change(e,value){
        this.setState({value});
        this.props.onNewChange(e,value);
    }
    render() {
        let label=this.state.getNew?___.use_booking_mobile:___.add_new_mobile;
        let disabled=this.props.mobile&&!this.state.getNew;
        let val=this.state.getNew?this.state.value:this.props.mobile||'';
        let btn=this.props.mobile?(<FlatButton 
            label={label} 
            primary={true} 
            onClick={this.getNew}
            style={styles.b}
        />):null;
        return (
            <div style={styles.box}>
                <Input
                    floatingLabelText={disabled?'':___.input_account}
                    value={val}
                    onChange={this.change}
                    disabled={disabled}
                    underlineDisabledStyle={{
                        borderBottom: '1px solid rgba(0, 0, 0, 0.25)'
                    }}
                    inputStyle={{color:'#000'}}
                />
                {btn}
            </div>
        );
    }
}















export default Register;