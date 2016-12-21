/**
 * 注册用户组件
 */
"use strict";

import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';

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
        }
        this.formData=Object.assign({},props.formData);
        this.formData.valid_type=1;

        this.change = this.change.bind(this);
        this.accountChange = this.accountChange.bind(this);
        this.submit = this.submit.bind(this);
        this.success = this.success.bind(this);
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
        if(this.props.start)
            this.submit();
    }
    
    success(res){
        if(!res.status_code||res.status_code==8){
            Object.assign(res,this.formData);
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
        for(let k in this.formData){
            if(!this.formData[k]){
                W.alert(k+___.not_null);
                return;
            }
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
        }else if(emailReg.test(val)){
            //邮箱注册
            // this.formData['email']=val;
            // delete this.formData.mobile;
            // this.setState({account:val,accountType:'email'}); 
        }
    }
    change(val,name){
        this.formData[name]=val;
    }

    render() {
        let dis=this.props.disabled?{display:'none'}:null;
        return (
            <div style={this.props.style}>
                <Input
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
                />
                <RaisedButton label={___.register} primary={true} style={sty.but} onClick={this.submit}/>
            </div>
        );
    }
}

export default Register;