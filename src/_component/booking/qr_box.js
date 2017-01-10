import React, {Component} from 'react';
import ProductName,{color} from './product_name';

const sty={
    img:{
        width:window.screen.width*0.75-48+'px',
        height:window.screen.width*0.75-48+'px'
    },
    qr:{
        padding:'10px',
        textAlign:'center',
        margin: 'auto'
    },
}

class QrBox extends Component {
    render() {
        return ( 
            <div style={sty.qr}>
                <div>
                    <ProductName product={this.props.product}/>
                    <p>
                        {___.prepayments+"："}
                        <span style={color}>{parseFloat(this.props.prepayments).toFixed(2)}</span>
                    </p>
                </div>
                <img style={sty.img} src={this.props.url}/>
                <p>{'[ '+___.press+' ]'}</p>
                <h4>{___.booking_qr}</h4>
            </div>
        );
    }
}

export default QrBox;