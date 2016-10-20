/**
 * 性能比较高，但是没有动画效果的checkBox
 */
import React, {Component} from 'react';

import ToggleCheckBox from 'material-ui/svg-icons/toggle/check-box';
import ToggleCheckBoxOutlineBlank from 'material-ui/svg-icons/toggle/check-box-outline-blank';

const sty={
    none:{
        display:'none'
    }
}

class Checkbox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            checked:props.checked
        }
        this.theme=context.muiTheme.checkbox;
        this.check = this.check.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.checked!=this.state.checked)
            this.setState({
                checked:nextProps.checked
            });
    }
    

    check(e){
        this.props.onCheck(e,!this.state.checked);
        this.setState({checked:!this.state.checked});
    }
    
    render() {
        let s=[Object.assign({},sty.none),Object.assign({},sty.none)];
        this.state.checked?s[0].display='block':s[1].display='block';
        return (
            <span {...this.props} onCheck={null}>
                <ToggleCheckBox onClick={this.check} style={s[0]} color={this.theme.checkedColor}/>
                <ToggleCheckBoxOutlineBlank onClick={this.check} style={s[1]}/>
            </span>
        );
    }
}

Checkbox.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired
};

export default Checkbox;