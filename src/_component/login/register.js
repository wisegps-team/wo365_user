/**
 * 注册用户组件
 */
"use strict";

import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import VerificationCode from '../base/verificationCode';
import Input from '../base/input';
import PasswordRepeat from './password';
import sty from './style';

class Register extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            account:null,
            accountType:'phone', //表示是用什么注册
            mobile:null,
            car:[],
            s_num:0,
            s_mob:0
        }
        this.formData=Object.assign({},props.formData);
        this.formData.valid_type=1;
        this.state.mobile=this.formData.mobile;
        if(this.state.mobile)
            this.state.s_mob=1;

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
        if(_g.uid&&_g.access_token){//已有账号，扫码进来
            this.getUser(_g.uid,_g.access_token);
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
            this.setState({s_mob:1,mobile:this.formData.mobile});
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
            Object.assign(res,this.formData,this._login);
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
        if(this.formData.valid_code){
            W.alert(___.code_err);
            return;
        }
        if(!this.state.s_num&&!this._newNum){
            W.alert(___.pls_input_new_car_num);
            return;
        }
        let data=Object.assign({},this.formData);
        if(!data.mobile&&!data.email){
            W.alert('email or mobile'+___.not_null);
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
            this.setState({account:val,accountType:'mobile'}); 
        }
    }
    change(val,name){
        this.formData[name]=val;
    }

    selectMobil(event, index, s_mob){
        let newState={s_mob};
        if(s_mob){
            this.formData.mobile=this.state.mobile;
            newState.car=this._car;
        }else{
            this.formData.mobile='';
            newState.s_num=0;
            newState.car=[];
        }
        this.setState(newState);
    }
    selectNum(event, index, s_num){
        if(s_num){//选择了某辆车
            this._newNum='';
        }
        this.setState({s_num});
    }

    newNumChange(e,val){
        this._newNum=val;
    }

    render() {
        // let dis=this.props.disabled?{display:'none'}:null;
        let mob=[<MenuItem value={0} primaryText={___.add_new_mobile} key={0} />];
        if(this.state.mobile)
            mob.push(<MenuItem value={1} primaryText={this.state.mobile} key={1} />);
        let newUser=this.state.s_mob?null:
        (<div>
            <Input
                name='account'
                hintText={___.input_account}
                floatingLabelText={___.user_mobile}
                onChange={this.accountChange}
                type='tel'
            />
            <VerificationCode 
                name='valid_code'
                type={1}
                accountType={this.state.accountType}
                account={this.state.account} 
                onSuccess={this.change}
                value={this.formData.valid_code}
                clean={this.props.clean}
            />
        </div>);

        let numList=this.state.car.map((e,i)=><MenuItem value={e.objectId} primaryText={e.name} key={i+1} />);
        numList.unshift(<MenuItem value={0} primaryText={___.add_new_car_num} key={0} />);
        let newNum=this.state.s_num?null:
        (<Input 
            name='newNum'
            hintText={___.input_new_car_num}
            floatingLabelText={___.input_new_car_num}
            onChange={this.newNumChange}
        />);
        return (
            <div style={this.props.style}>
                <div>
                    <label>{___.user_mobile}：</label>
                    <DropDownMenu value={this.state.s_mob} onChange={this.selectMobil}>
                        {mob}
                    </DropDownMenu>
                    {newUser}
                </div>
                <div>
                    <label>{___.carNum}：</label>
                    <DropDownMenu value={this.state.s_num} onChange={this.selectNum}>
                        {numList}
                    </DropDownMenu>
                    {newNum}
                </div>
                {/*<Input
                    name='account'
                    hintText={___.input_account}
                    floatingLabelText={___.account}
                    onChange={this.accountChange}
                    value={this.formData.mobile}
                    disabled={this.props.disabled}
                    style={dis}
                    type='tel'
                />
                <VerificationCode 
                    name='valid_code'
                    type={1}
                    accountType={this.state.accountType}
                    account={this.state.account} 
                    onSuccess={this.change}
                    value={this.formData.valid_code}
                    clean={this.props.clean}
                    disabled={this.props.disabled}
                    style={dis}
                />
                <PasswordRepeat 
                    onChange={this.change}
                    name='password'
                    value={this.formData.password}
                    clean={this.props.clean}
                    style={{display:'none'}}
                />*/}
                <RaisedButton label={___.register} primary={true} style={sty.but} onClick={this.submit}/>
            </div>
        );
    }
}

export default Register;