import React, {Component} from 'react';
import Input from '../base/input';

class AccountInput extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            exists:false
        }

        this.change = this.change.bind(this);
        if(props.defaultValue){
            this.change(null,props.defaultValue);
        }
    }
    change(e,val){
        if(/^\d{11}$/.test(val)){
            let that=this;
            Wapi.user.checkExists(function(res){
                that.setState({exists:res.exists});
                if(res.exists===that.props.needExists){
                    that.props.onChange(val,that.props.name);
                }
            },{mobile:val});
        }
    }
    render() {
        let err_text='';
        if(this.state.exists!==this.props.needExists){
            err_text=this.props.needExists?___.no_account:___.phone_registed;
        }
        return (
            <Input
                {...this.props}
                errorText={err_text}
                onChange={this.change}
            />
        );
    }
}

export default AccountInput;