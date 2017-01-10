import React, {Component} from 'react';

import AppBox from './app_box';
import MobileChecker from '../base/mobileChecker';
import RaisedButton from 'material-ui/RaisedButton';
import QrBox from './qr_box';
import {bonkingRegister} from './form';

const sty={
    color:{
        color:'#2196f3'
    },
    b:{
        width:'100%',
        textAlign:'center',
        padding:'16px 5px 5px 0'
    },
    p:{
        padding:'0 1em'
    },
    c:{
        textAlign:'center',
        width: '100%'
    }
}

class CheckApp extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            booking:null,
            success:false
        }
        this.success = this.success.bind(this);
    }
    componentDidMount() {
        Wapi.booking.get(res=>this.setState({booking:res.data}),{
            objectId:_g.bookingId
        })
    }
    
    success(){
        W.loading(true);
        Wapi.booking.update(res=>{
            this.setState({success:true});
            W.loading();
        },{
            _objectId:this.state.booking.objectId,
            userOpenId:_g.openid
        })
    }

    render() {
        let content=this.state.booking?(<CheckBox onSuccess={this.success} data={this.state.booking}/>):(<p style={sty.c}>正在获取预订信息</p>);
        if(this.state.success)
            content=(<QrBox 
                url={this.state.booking.carType.qrUrl}
                product={this.state.booking.product}
                prepayments={this.state.booking.payMoney}
            />);
        return (
            <AppBox>
                {content}
            </AppBox>
        );
    }
}

class CheckBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.submit = this.submit.bind(this);
        this.success = this.success.bind(this);
    }
    
    success(val,name){
        this.code=val;
        let booking=this.props.data;
        bonkingRegister(booking.userMobile,val,booking.userName,_g.openid,e=>e);//注册车主
    }

    submit(){
        if(this.code){
            this.props.onSuccess();
        }else{
            W.alert(___.code_err);
        }
    }

    render() {
        let date=W.dateToString(W.date(this.props.data.createdAt)).slice(0,-3);
        let mobile=this.props.data.userMobile;
        return (
            <div style={sty.p}>
                <p style={{textIndent:'2em'}}>
                    <span style={sty.color}>{this.props.data.name}</span>
                    {" 于 "}
                    <span>{date}</span>
                    {___.b_des.replace('xxx',mobile.replace(mobile.slice(-8,-4),'****'))}
                </p>
                <MobileChecker mobile={mobile} onSuccess={this.success}/>
                <div style={sty.b}>
                    <RaisedButton label={___.ok} primary={true} onClick={this.submit}/>
                </div>
            </div>
        );
    }
}

export default CheckApp;