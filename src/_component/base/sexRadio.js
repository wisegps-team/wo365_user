import React, {Component} from 'react';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const sty={
    width:'auto',
    display:'inline-block',
    marginRight:'15px'
}

class SexRadio extends Component {
    constructor(props, context) {
        super(props, context);
        this.change = this.change.bind(this);
    }
    
    change(event,val){
        if(this.value==val)return;
        this.value=val;
        this.props.onChange(val);
    }
    render() {        
        return (
            <RadioButtonGroup {...this.props} name="sex" defaultSelected={(typeof this.props.value)!='undefined'?this.props.value.toString():'1'} onChange={this.change}>
                <RadioButton
                    value='1'
                    label={___.man}
                    style={sty}
                />
                <RadioButton
                    value='0'
                    label={___.woman}
                    style={sty}
                />
            </RadioButtonGroup>
        );
    }
}

export default SexRadio;