import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import sty from './style';
import PhoneInput from '../base/PhoneInput';
import VerificationCode from '../base/verificationCode';

class BindBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.submit = this.submit.bind(this);
        this.change = this.change.bind(this);
        this.accountChange = this.accountChange.bind(this);

        this.state={
            mobile:''
        };
    }

    change(val,name){
        this.code=val;
    }
    accountChange(val,err){
        this.setState({mobile:val});
    }

    submit(){
        if(!this.code){
            W.alert(___.code_err);
            return;
        }
        let data={
            code:this.code,
            mobile:this.state.mobile,
            openId:this.props.openId
        }
        Wapi.serverApi.bindOpenId(res=>{
            if(res.status_code){
                W.errorCode(res);
                return;
            }
            this.props.onSuccess();
        },data);
    }
    render() {
        return (
            <div>
                <PhoneInput
                    name='account'
                    hintText={___.input_account}
                    floatingLabelText={___.account}
                    onChange={this.accountChange}
                    needExist={true}
                />
                <VerificationCode 
                    name='valid_code'
                    type={1}
                    account={this.state.mobile} 
                    onSuccess={this.change}
                />

                <RaisedButton label={___.ok} primary={true} style={sty.but} onClick={this.submit}/>
            </div>
        );
    }
}

export default BindBox;