import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';



let sty={
    verticalAlign: 'bottom',
}

class TypeSelect extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value:props.value,
      types:context.custType
    };
  }
  componentDidMount() {
    this.unsubscribe = STORE.subscribe(() =>
        this.setState({types:STORE.getState().custType})
    )
  }
  componentWillUnmount() {
    this.unsubscribe();//注销事件
  }
  

  handleChange(event, index, value){
    this.setState({value:value});
    console.log(value);
    this.props.onChange(value);
  }
  componentWillReceiveProps(nextProps){
    let types;
    let value=parseInt(nextProps.value);
    if(nextProps.type=='cust_manage'){
      types=this.context.custType.filter(ele=>(ele.id!=4));
    }else{
      types=this.context.custType.filter(ele=>(ele.id==4));
    }
    value=(!value||isNaN(value))?types[0].id:value;
    this.setState({value,types});
  }

  render() {
    let items=[];
    this.state.types.map(ele=>{
      items.push(<MenuItem value={ele.id} key={ele.id} primaryText={ele.name}/>)
    });
    return (
      <SelectField style={sty} value={this.state.value} onChange={this.handleChange.bind(this)}>
        {items}
      </SelectField>
    );
  }
}

// 必须指定context的数据类型
TypeSelect.contextTypes={
    custType: React.PropTypes.array
}

export default TypeSelect;