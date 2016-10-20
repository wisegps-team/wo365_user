/**
 * 注册用户组件
 */
"use strict";

import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import Input from '../base/input';
import PasswordRepeat from './password';
import sty from './style';

class Register extends Component {
    constructor(props, context) {
        super(props, context);
        this.formData={
            password:null
        };
        this.change = this.change.bind(this);
        this.accountChange = this.accountChange.bind(this);
        this.submit = this.submit.bind(this);
        this.success = this.success.bind(this);
        this.didChange = this.didChange.bind(this);
    }
    success(res){
        if(!res.error){
            Object.assign(this.formData);
            this.props.onSuccess(res);
        }else
            W.alert(res.errormsg);
    }
    submit(){
        for(let k in this.formData){
            if(!this.formData[k]){
                W.alert(k+___.not_null);
                return;
            }
        }
        let data=Object.assign({},this.formData);
        if(!this.props.beforRegister||this.props.beforRegister(data))
            Wapi.papi.register(this.success,data);
    }

    accountChange(e,val){
        let phoneReg=/^[1][3578][0-9]{9}$/;
        if(phoneReg.test(val)){
            this.formData['mobile']=val;  
        }
    }
    change(val,name){
        this.formData[name]=val;
    }
    didChange(e,val){
        this.formData.did=val;
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
                <Input
                    name='did'
                    floatingLabelText={___.did}
                    onChange={this.didChange}
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