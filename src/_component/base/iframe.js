import React, {Component} from 'react';

import {randomStr} from '../../_modules/tool';

const sty={
    ifr:{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        zIndex: 100000
    }
}
class Iframe extends Component{
    constructor(props, context) {
        super(props, context);
        this.key=randomStr();
        this.close = this.close.bind(this);
    }
    
    close(e){
        if(e.state==this.key){
            this.props.close?this.props.close():null;
        }
    }

    componentDidMount() {
        history.pushState(this.key,'',this.props.name);
        history.pushState('Iframekey','',this.props.name);
        window.addEventListener('popstate',this.close);
    }
    componentWillUnmount() {
        window.removeEventListener('popstate',this.close);
        history.back();
    }
    
    render() {
        return (
            <iframe src={this.props.src} name={this.props.name} style={sty.ifr}/>
        );
    }
}

export default Iframe;