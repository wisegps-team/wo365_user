import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Input from './input';
import FlatButton from 'material-ui/FlatButton';

let sty={
    box:{
        position:'relative'
    },
    b:{
        position: 'absolute',
        right: '0px',
        bottom: '5px'
    },
    input:{
        width:'100%',
        height:'40px',
        fontSize:'16px',
        border:'none',
        outline:'none'
    }
}

class VerificationOrig extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            code_err:null,
            second:0
        }
        this.accountFormat=false;
        this.change = this.change.bind(this);
        this.getCode = this.getCode.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this._time_id);
    }
    componentWillReceiveProps(nextProps) {
        let account=nextProps.account;
        let reg=/^[1][3578][0-9]{9}$/;
        if(reg.test(account)){
            if(this.props.needExist){
                Wapi.user.checkExists((json)=>{//验证是否本平台用户
                    if(json.exist){
                        this.accountFormat=true;
                        this.forceUpdate();
                    }else{
                        W.toast('此号码非本平台用户');
                    }
                },{mobile:account});
            }else{
                this.accountFormat=true;
                this.forceUpdate();
            }
        }else if(this.accountFormat){
            this.accountFormat=false;
            this.forceUpdate();
        }
    }
    change(e){
        let val=e.target.value;
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
        if(this.props.onChange){
            this.props.onChange(val,this.props.name);
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
                <input
                    placeholder={___.verification_code}
                    onChange={this.change}
                    type="tel"
                    style={sty.input}
                />
                <FlatButton 
                    label={this.state.second||___.getCode} 
                    primary={!this.state.second} 
                    disabled={!!this.state.second || !this.accountFormat} 
                    onClick={this.getCode}
                    style={sty.b}
                />
            </div>
        );
    }
}

export default VerificationOrig;