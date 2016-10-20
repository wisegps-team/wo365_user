/**
 * 忘记密码
 */
import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import VerificationCode from '../base/verificationCode';
import PhoneInput from '../base/PhoneInput';
import PasswordRepeat from './password';
import sty from './style';

class Forget extends Component {
constructor(props, context) {
        super(props, context);
        this.state={
            account:null
        }
        this.formData={
            account:null,
            valid_code:null,
            password:null,
            valid_type:1
        };
        this.change = this.change.bind(this);
        this.submit = this.submit.bind(this);
        this.success = this.success.bind(this);
    }
    success(res){
        Object.assign(res,this.formData);
        this.props.onSuccess(res);
    }
    submit(){
        for(let k in this.formData){
            if(!this.formData[k]){
                W.alert(k+___.not_null);
                return;
            }
        }
        if(this.props.user){
            let update={
                access_token:this.props.user.access_token,
                mobileVerified:true,
                _sessionToken:this.props.user.session_token
            }
            let that=this;
            Wapi.user.resetPassword((res)=>Wapi.user.updateMe(this.success,update),Object.assign({},this.formData));
        }else
            Wapi.user.resetPassword(this.success,Object.assign({},this.formData));
    }
    change(val,name){
        if(name){
            if(name=='password'||name=='valid_code')
                this.formData[name]=val;
        }else if(!name){
            this.formData['account']=val;
            this.setState({account:val}); 
        }
    }

    render() {
        return (
            <div {...this.props}>
                <PhoneInput
                    name='account'
                    hintText={___.input_account}
                    floatingLabelText={___.account}
                    onChange={this.change}
                    needExist={true}
                />
                <VerificationCode 
                    name='valid_code'
                    type={2}
                    account={this.state.account} 
                    onSuccess={this.change}
                />
                <PasswordRepeat 
                    onChange={this.change}
                    name='password'
                />
                <RaisedButton label={___.reset_pwd} primary={true} style={sty.but} onClick={this.submit}/>
            </div>
        );
    }
}

export default Forget;