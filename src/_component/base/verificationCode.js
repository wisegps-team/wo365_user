import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Input from './input';

let sty={
    box:{
        display: 'flex',
        alignItems: 'center'
    },
    b:{
        flexShrink: 0
    }
}

class VerificationCode extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            code_err:null,
            second:0
        }
        this.change = this.change.bind(this);
        this.getCode = this.getCode.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this._time_id);
    }
    

    change(e,val){
        let that=this;
        if(val.length==(this.props.length||4)){
            let data={
                valid_type:this.props.type,
   				valid_code:val
            }
            data[this.props.accountType||'mobile']=this.props.account;
            Wapi.comm.validCode(function(res){
                if(res.status_code){
                    W.errorCode(res);
                    return;
                }
                if(res.valid){
                    that.setState({code_err:null});
                    that.props.onSuccess(val,that.props.name);
                }else{
                    that.setState({code_err:___.code_err});
                }
            },data);
        }
    }
    getCode(){
        if(!this.props.account){
            W.alert(___.phone_empty);
            return;
        }
        let that=this;
        that.setState({second:60});
        that._time_id=setInterval(function(){
            if(that.state.second>0)
                that.setState({second:that.state.second-1});
            else
                clearInterval(that._time_id);
        },1000);

        let send=(this.props.accountType&&this.props.accountType=='email')?'sendEmail':'sendSMS';
        Wapi.comm[send](function(res){
            if(res.status_code){
                clearInterval(that._time_id);
                that.setState({second:0});
                W.errorCode(res);
                return;
            }
        },this.props.account,this.props.type);
    }
    
    render() {
        let box=Object.assign({},sty.box,this.props.style);
        return (
            <div style={box}>
                <Input
                    floatingLabelText={___.input_code}
                    errorText={this.state.code_err}
                    onChange={this.change}
                />
                <RaisedButton 
                    label={this.state.second||___.getCode} 
                    primary={!this.state.second} 
                    disabled={!!this.state.second} 
                    onClick={this.getCode}
                    style={sty.b}
                />
            </div>
        );
    }
}

export default VerificationCode;