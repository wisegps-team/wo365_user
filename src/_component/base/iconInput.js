import React, {Component} from 'react';

import Input from './input';


const sty={
    p:{
        paddingLeft: '24px',
        top:'22px',
        height:'auto'
    }
}

class IconInput extends Component {
    render() {
        let Icon=this.props.icon;
        return (
            <div style={{position: 'relative'}}>
                <Icon style={{position: 'absolute',bottom: '12px'}}/>
                <Input {...this.props} icon='' hintText={this.props.hintText} hintStyle={sty.p} inputStyle={sty.p}/>
            </div>
        );
    }
}

export default IconInput;