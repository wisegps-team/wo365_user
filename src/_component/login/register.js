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
            accountType:'phone' //表示是用什么注册
        }
        this.formData={
            valid_code:null,
            password:null,
            valid_type:1
        };
        this.change = this.change.bind(this);
        this.accountChange = this.accountChange.bind(this);
        this.submit = this.submit.bind(this);
        this.success = this.success.bind(this);
    }
    success(res){
        if(!res.status_code||res.status_code==8){
            Object.assign(res,this.formData);
            this.props.onSuccess(res);
        }else
            W.errorCode(res);
    }
    submit(){
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
        return (
            <div {...this.props}>
                <Input
                    name='account'
                    hintText={___.input_account}
                    floatingLabelText={___.account}
                    onChange={this.accountChange}
                />
                <VerificationCode 
                    name='valid_code'
                    type={1}
                    accountType={this.state.accountType}
                    account={this.state.account} 
                    onSuccess={this.change}
                />
                <PasswordRepeat 
                    onChange={this.change}
                    name='password'
                />
                <RaisedButton label={___.register} primary={true} style={sty.but} onClick={this.submit}/>
            </div>
        );
    }
}

export default Register;