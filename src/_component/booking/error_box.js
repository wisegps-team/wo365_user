import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';

import ProductName,{color} from './product_name';

class ErrorBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.again = this.again.bind(this);
        this.continue = this.continue.bind(this);
    }
    
    again(){
        this.props.callback(0);
    }
    continue(){
        this.props.callback(1);
    }
    render() {
        let booking=this.props.booking;
        return (
            <div style={{padding: '0 1em'}}>
                <p>
                    {___.booking_date+"："}
                    <span style={color}>{W.dateToString(W.date(booking.createAt))}</span>
                </p>
                <ProductName product={booking.product} noDetail={true}/>
                <p>
                    {___.prepayments+"："}
                    <span style={color}>{parseFloat(booking.payMoney||0).toFixed(2)}</span>
                </p>
                <p>{___.b_err_des}</p>
                <div style={{textAlign:'center'}}>
                    <FlatButton label={___.book_again} primary={true} onClick={this.again}/>
                    <FlatButton label={___.continue_book} primary={true} onClick={this.continue}/>
                </div>
            </div>
        );
    }
}

export default ErrorBox;