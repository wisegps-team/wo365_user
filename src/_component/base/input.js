import React, {Component} from 'react';

import TextField from 'material-ui/TextField';

const sty={
    tf:{
        height:'58px',
        marginTop: '3px'
    },
    tl:{
        top:'24px'
    },
    ti:{
        marginTop:'0px',
        height:'auto',
        top:'22px'
    },
    te:{
        top:'28px'
    }
}
class Input extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            value:props.value
        }
        this.change = this.change.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if(typeof nextProps.value!='undefined'&&this.state.value!=nextProps.value){
            this.setState({value:nextProps.value});
        }
    }
    
    change(e,value){
        this.setState({value});
        this.props.onChange(e,value);
    }
    
    render() {
        return (
            <TextField
                style={sty.tf}
                floatingLabelStyle={sty.tl}
                inputStyle={sty.ti}
                errorStyle={sty.te}
                fullWidth={true}
                {...this.props}
                value={this.state.value}
                onChange={this.change}
            />
        );
    }
}

export default Input;