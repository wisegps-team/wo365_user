import React, {Component} from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

const sty={
    w:{
        width:'50%'
    },
    f:{display: 'flex'},
    tf:{
        width:'100%'
    }
}

class DateTime extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            value:this.clearS(props.value)
        }

        this.dateChange = this.dateChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value){
            let value=this.clearS(nextProps.value);
            if(value.getTime()!=this.state.value.getTime())
                this.setState({value});
        }
    }
    
    dateChange(e,value){
        let val=this.state.value;
        if(val){
            value.setHours(val.getHours());
            value.setMinutes(val.getMinutes());
        }
        value=this.clearS(value);
        this.setState({value});
        this.props.onChange(value,this.props.name);
    }
    timeChange(e,value){
        let val=this.state.value;
        if(val){
            value.setFullYear(val.getFullYear());
            value.setMonth(val.getMonth());
            value.setDate(val.getDate());
        }
        value=this.clearS(value);
        this.setState({value});
        this.props.onChange(value,this.props.name);
    }
    clearS(date){
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }
    
    render() {
        return (
            <div {...this.props} onChange={null} value={null} style={Object.assign({},sty.f,this.props.style)} >
                <DatePicker 
                    style={sty.w} 
                    hintText={___.select_date} 
                    textFieldStyle={sty.tf} 
                    value={this.state.value} 
                    onChange={this.dateChange}
                />
                <TimePicker 
                    style={sty.w} 
                    hintText={___.select_time} 
                    format="24hr" 
                    textFieldStyle={sty.tf} 
                    value={this.state.value} 
                    onChange={this.timeChange}
                />
            </div>
        );
    }
}

export default DateTime;