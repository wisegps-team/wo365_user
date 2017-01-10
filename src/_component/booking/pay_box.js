import React, {Component} from 'react';

import FlatButton from 'material-ui/FlatButton';

import ProductName,{color} from './product_name';

const sty={
    ex:{
        color:'#999999',
        marginTop:'30px',
        marginLeft:'10px',
        textAlign:'center',
    }
}
class PayBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.pay = this.pay.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    
    pay(){
        let act=this.props.act;
        let booking=this.props.booking;
        let payData={
            uid:this.props.uid,
            order_type:1,
            amount:booking.payMoney,
            attach:booking.objectId,
            remark:act.product+___._deposit,
            title:___.prepayments            
        }
        if(this.props.self){
            booking.payMoney=act.deposit;
            booking.payStatus=1;
        }else{
            booking.payMoney=act.price+act.installationFee;
            booking.payStatus=2;
            payData.remark=act.product+___.all_price;
        }
        payData.amount=booking.payMoney;
        W.setLS('booking',booking);
        Wapi.pay.wxPay(payData,_g.activityId);
    }
    cancel(){//选择不要赠品
        W.loading(true,___.loading);
        Wapi.booking.update(res=>{
            W.loading();
            this.props.onCancel();
        },{
            _objectId:this.props.booking.objectId,
            'carType.noPay':'1'
        });
    }
    render() {
        let act=this.props.act;
        let booking=this.props.booking;
        let tel=(act?act.tel:'');
        let des=this.props.self?___.booking_success+'，'+___.pay_deposit_now.replace('XX',act.deposit)+'，'+act.offersDesc:
            ___.booking_success+'，'+W.replace(___.pan_all,act)+'，'+act.offersDesc;
        return (
            <div style={{padding: '0 1em'}}>
                <ProductName product={booking.product}/>
                <p style={{}}>
                    {___.product_price+"："}
                    <span style={color}>{parseFloat(booking.product.price).toFixed(2)}</span>
                </p>
                <p style={{textIndent: '2em'}}>{des}</p>
                <div style={{textAlign:'center'}}>
                    <FlatButton label={___.not_gifts} primary={true} onClick={this.cancel}/>
                    <FlatButton label={___.wxPay} primary={true} onClick={this.pay}/>
                </div>
                <div style={sty.ex}>
                    {___.please_consult}
                    <a href={'tel:'+tel}>{tel}</a>
                </div>
            </div>
        );
    }
}

export default PayBox;