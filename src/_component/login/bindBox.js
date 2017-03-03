import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import sty from './style';
import PhoneInput from '../base/PhoneInput';
import VerificationCode from '../base/verificationCode';
import VerificationOrig from '../base/verificationOrig';

class BindBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.submit = this.submit.bind(this);
        this.change = this.change.bind(this);
        this.success = this.success.bind(this);
        this.accountChange = this.accountChange.bind(this);

        this.state={
            mobile:'',
            code:''
        };
        this.codeRight=false;
    }

    change(val){
        if(val.length==4){
            this.setState({code:val});
        }else{
            this.codeRight=false;
            this.setState({code:''});
        }
    }
    success(){
        this.codeRight=true;
        this.forceUpdate();
    }
    accountChange(e){
        let _mobile=e.target.value;
        this.setState({mobile:_mobile});
        // let _this=this;
        // let reg=/^[1][3578][0-9]{9}$/;
        // if(reg.test(_mobile)){
        //     Wapi.user.checkExists(function(json){//验证是否本平台用户
        //         if(json.exist){
        //             _this.setState({mobile:_mobile});
        //         }else{
        //             W.toast('此号码非本平台用户');
        //         }
        //     },{mobile:_mobile});
        // }else{
        //     _this.setState({mobile:''});
        // }
    }

    submit(){
        if(!this.codeRight){
            W.alert(___.code_err);
            return;
        }
        let data={
            code:this.state.code,
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
                {/*<PhoneInput
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

                <RaisedButton label={___.ok} primary={true} style={sty.but} onClick={this.submit} labelColor='#eee'/>*/}
                
                <div style={{backgroundColor:'#fff'}}>
                    <div style={sty.r}>
                        <input 
                            name='account' 
                            type='tel' 
                            placeholder={___.account} 
                            style={sty.input} 
                            onChange={this.accountChange}
                        />
                    </div>
                    <div style={{display:'flex',alignItems:'flex-end',padding:'3px 10px'}}>
                        <VerificationOrig 
                            name='valid_code'
                            type={1}
                            account={this.state.mobile} 
                            onChange={this.change}
                            onSuccess={this.success}
                            style={{width:'100%'}}
                            needExist={true}
                        />
                    </div>
                </div>
                <div style={sty.b}>
                    <RaisedButton disabled={!this.codeRight} onClick={this.submit} label={___.ok} primary={true} labelColor='#eee'/>
                </div>
            </div>
        );
    }
}

export default BindBox;