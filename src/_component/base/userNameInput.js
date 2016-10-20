import React, {Component} from 'react';
import Input from './input';
import Wapi from '../../_modules/Wapi/index';

class UserNameInput extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            code_err:''
        }
    }
    
    change(e,val){
        this._val=val;
        let that=this;
        Wapi.user.checkExists(function(res){
            if(that._val!==val)return;//说明用户输入已经改了
            if(res.status_code){
                W.errorCode(res);
            }else{
                if(res.exist){
                    that.setState({code_err:___.user_name_err});
                }else{
                    that.props.onChange(val,that.props.name);
                    that.setState({code_err:''});
                }
            }
        },{
            username:val
        })
    }
    render() {
        return (
            <Input
                {...this.props}
                errorText={this.state.code_err}
                onChange={this.change.bind(this)}
                defaultValue={this.state.value||this.props.value}
            />
        );
    }
}

export default UserNameInput;