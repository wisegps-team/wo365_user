/**
 * 传入一个text，生成二维码
 */
import React, {Component} from 'react';

let jsLoad=function(){};
W.include(WiStorm.root+'wslib/toolkit/qrcode.js',function(){
    jsLoad();
});

class QrImg extends Component {
    constructor(props) {
        super(props);
        
    }
    
    componentDidMount() {
        this.create();
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.data!=this.props.data)
            this.create();
    }

    create(){
        this.refs.main.innerHTML='';
        let text=this.props.data;
        if(typeof QRCode!='undefined')
            new QRCode(this.refs.main,text);
        else
            jsLoad=()=>new QRCode(this.refs.main,text);
    }
    
    render() {
        return (
            <div {... this.props} ref="main"></div>
        );
    }
}

export default QrImg;