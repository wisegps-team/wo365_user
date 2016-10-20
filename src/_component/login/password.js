/**
 * 输入重复密码，校验两次输入的密码是否相同
 */
import React, {Component} from 'react';
import Input from '../base/input';

class PasswordRepeat extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            err:false,//密码不符合格式
            pwdErr:false,
            pwd:''
        }
        this.change = this.change.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return(nextState!==this.state);
    }
    componentDidUpdate(prevProps, prevState) {
        if(!this.state.err&&!this.state.pwdErr&&this.state.pwd)
            this.props.onChange(this.state.pwd,this.props.name);
        else
            this.props.onChange('',this.props.name);
    }
    
    

    change(e,val){
        if(!val)return;
        let name=e.currentTarget.name;
        let newState={};
        if(name=='password'){
            //校验密码是否符合格式
            this.pwd=val;
        }else{
            //校验两次密码是否一致
            this._pwd=val;
        }
        let r=new RegExp(this.props.regExp||'^[a-zA-Z0-9]{6,}$');
        if(r.test(this.pwd)){
            newState.err=false;
            newState.pwd=this.pwd;
        }else{
            newState.err=true;
            newState.pwd='';
        }
        if(this._pwd==this.pwd){
            newState.pwdErr=false;
        }else{
            newState.pwdErr=true;
        }
        this.setState(newState);
    }
    
    render() {
        let errorText=this.state.err?___.pwd_input_err:'';
        let pwdErr=this.state.pwdErr?___.two_pwd_err:''
        return (
            <div {...this.props} onChange={null}>
                <Input
                    name='password'
                    type='password'
                    hintText={___.input_pwd}
                    floatingLabelText={___.pwd}
                    errorText={errorText}
                    onChange={this.change}
                />
                <Input
                    name='pass'
                    type='password'
                    disabled={this.state.err}
                    hintText={___.input_pwd}
                    floatingLabelText={___.pwd}
                    errorText={pwdErr}
                    onChange={this.change}
                />
            </div>
        );
    }
}

export default PasswordRepeat;