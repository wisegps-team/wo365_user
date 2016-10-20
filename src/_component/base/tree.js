import React, {Component} from 'react';

import IconButton from 'material-ui/IconButton';
// import Checkbox from 'material-ui/Checkbox';
import ContentAdd from 'material-ui/svg-icons/content/add';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';

import Checkbox from './checkbox';

const sty={
    ch:{
        paddingLeft:'29px'
    },
    self:{
        lineHeight:'24px',
        display: 'flex',
        padding: '5px 0',
        alignItems: 'center'
    },
    b:{
        marginRight: '5px',
        flex: '0 0 24px'
    },
    c:{
        marginRight:'3px'
    },
    none:{
        display:'none'
    }
}

export function MakeTreeComponent(TreeComponent){
    class Tree extends Component {
        constructor(props, context) {
            super(props, context);
            this.state={
                open:props.data.open,
                checked:props.data.checked
            };
            this.setChildren(props.data,props.data.checked);
            this.handlOpen = this.handlOpen.bind(this);
            this.check = this.check.bind(this);
        }
        componentWillReceiveProps(nextProps) {
            this.setChildren(nextProps.data,nextProps.data.checked);
            this.setState({
                checked:nextProps.data.checked
            });
        }
        
        setChildren(data,checked){
            if(data.children){
                data.children.forEach(e=>e.checked=checked);
            }
        }
        
        handlOpen(){
            this.setState({open:!this.state.open});
        }
        check(e,checked){
            this.setState({checked});
            this.setChildren(this.props.data,checked);
            this.props.data.checked=checked;
            if(this.context.onSelect){
                this.context.onSelect(this.props.data);
            }
        }

        render() {
            let children=(this.props.data.children&&this.props.data.children.length)?this.props.data.children.map((e,i)=>(<Tree data={e} key={i} check={this.props.check}/>)):null;
            let styC=Object.assign({},sty.ch);
            let icon=null;
            let self=sty.self;
            if(children){
                icon=this.state.open?(
                    <NavigationExpandLess onClick={this.handlOpen} style={sty.b}/>
                ):(
                    <NavigationExpandMore onClick={this.handlOpen} style={sty.b}/>
                );
            }else{
                self=Object.assign({},sty.self);
                self.paddingLeft='29px';
            }

            let check=this.props.check?(<Checkbox 
                            style={sty.c} 
                            checked={this.state.checked}
                            onCheck={this.check}
                        />):null;
            styC.display=this.state.open?'block':'none';
            return (
                <div>
                    <div style={self}>
                        {icon}
                        {check}
                        <TreeComponent data={this.props.data}/>
                    </div>
                    <div style={styC}>
                        {children}
                    </div>
                </div>
            );
        }
    }
    Tree.contextTypes={
        onSelect:React.PropTypes.func,
    }

    return Tree;
}


class Span extends Component{
    render() {
        return (
            <span>{this.props.data.name}</span>
        );
    }
}

let Tree=MakeTreeComponent(Span);

export default Tree;