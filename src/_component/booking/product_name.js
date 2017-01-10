import React, {Component} from 'react';

import Iframe from '../base/iframe';

const sty={
    color:{
        color: '#019436'
    }
}
export const color=sty.color;

class ProductName extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            brand:null,
            iframe:false
        }
        this.toggleIframe = this.toggleIframe.bind(this);
    }
    componentDidMount() {
        Wapi.serverApi.getBrand(res=>{
            this.setState({brand:res.data.brand});
        },{
            objectId:this.props.product.id
        });
    }
    toggleIframe(){
        this.setState({iframe:!this.state.iframe});
    }
    render() {
        let name=(this.state.brand||'')+' '+this.props.product.name+' ';
        let iframe=this.state.iframe?<Iframe 
            src={this.props.product.act_url} 
            name='act_url' 
            close={this.toggleIframe}
        />:null;
        let a_sty={color:'rgb(33, 150, 243)'};
        if(this.props.noDetail)
            a_sty.display='none';
        return (
            <p>
                {___.booking_product+"："}
                <span style={sty.color}>
                    {name}
                    <a style={a_sty} onClick={this.toggleIframe}>{___.learn_detail}</a>
                </span>
                {iframe}
            </p>
        );
    }
}

export default ProductName;