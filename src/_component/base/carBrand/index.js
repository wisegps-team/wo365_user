import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../../_theme/default';

import Input from '../input';
import carBrandAction from './action';

import Select from './select';

const sty={
    box:{
        position: 'relative',
        height: '58px'
    },
}

class CarBrand extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            name:''
        }
        if(props.value){
            this.state.name=CarBrand.getName(props.value);
        }
        this.callSelect = this.callSelect.bind(this);
        this.action=new carBrandAction();
    }
    componentDidMount() {
        let that=this;
        this.action.on('change',function(e){//监听change
            let val=e.params;
            that.setState({name:CarBrand.getName(val)});
            that.props.onChange(e.params);
        });
        loadBrand(this.context.view);
    }

    componentWillUnmount() {
        this.action.clearEvent();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value){
            let name=CarBrand.getName(nextProps.value);
            if(name!=this.state.name)
                this.setState({name});
        } 
    }

    callSelect(e){
        this.action.emit('select',{event:e,key:this.action.key});//触发选择事件，发送自身的key
        if(WiStorm.agent.mobile)
            this.context.view.goTo('#carBrand');
        else;//pc端会监听select事件自己展示
    }

    render() {
        let s=Object.assign({},sty.box,this.props.style);
        let ls=(this.state.name)?{transition:'none',transform: 'scale(0.75) translate(0px, -50px)',color:'rgba(0, 0, 0, 0.498039)'}:
            {top:'24px',transition:'none'};
        return (
            <div style={s} onClick={this.callSelect}>
                <Input floatingLabelText={___.select_car} floatingLabelStyle={ls} children={<span>{this.state.name}</span>} />
            </div>
        );
    }
}

CarBrand.contextTypes = {
    muiTheme: React.PropTypes.object,
    view: React.PropTypes.object
};

CarBrand.getName=function(val){
    if(val.brandId)
        return val.brand+' '+val.serie+' '+(val.type||'');
    else
        return '';
}

export default CarBrand;

function loadBrand(thisView){
    let view=WiStorm.agent.mobile?thisView.prefetch('#carBrand',3):getPcView();
    ReactDOM.render(<App view={view}/>,view);
}

class App extends Component{
    constructor(props, context) {
        super(props, context);
        this.change = this.change.bind(this);
    }
    
    componentDidMount() {
        this.action=new carBrandAction();
        let that=this;
        this.action.on('select',function(e){
            that.action.key=e.params.key;
            if(!WiStorm.agent.mobile)//pc则自己显示
                that.show(e.params.event);
        });
    }

    componentWillUnmount() {
        this.action.clearEvent();
    }

    show(e){
        let h=e.clientY/window.screen.height;
        let w=window.screen.width-e.clientX;
        let s={
            top:'auto',
            botton:'auto',
            left:'auto',
            right:'auto',
            transform: 'scale(1, 1)',
            transformOrigin: '',
        }
        let or='';
        if(w<300){
            s.right=w+'px';
            s.transformOrigin='right ';
        }else{
            s.left=e.clientX+'px';
            s.transformOrigin='left ';
        } 

        if(h<0.2){
            s.top=e.clientY+'px';
            s.transformOrigin+='top ';
        }else if(h>0.8){
            s.botton=(window.screen.height-e.clientY)+'px';
            s.transformOrigin+='botton ';
        }else{
            if(h<0.5){
                s.top='20%';
                s.transformOriginr+='top ';
            }else{
                s.botton='20%';
                s.transformOrigin+='botton ';
            }
        }
        Object.assign(this.props.view.style,s);
    }

    change(res){
        if(res)
            this.action.emit('change',res);
        if(WiStorm.agent.mobile)
            history.back();
        else{
            this.props.view.style.transform='scale(0, 0)';
        }
    }
    render() {
        return (
            <ThemeProvider>
                <Select onChange={this.change}/>
            </ThemeProvider>
        );
    }
}

function getPcView(){//pc端直接创建一个div
    let div=document.createElement('div');
    div.id='a'+carBrandAction.getkey();//获得随机字符串

    let style={
        width:'300px',
        maxHeight: '80%',
        overflowY:'auto',
        overflowX: 'hidden',
        color: 'rgba(0, 0, 0, 0.870588)',
        transition: 'transform 250ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 250ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        boxSizing: 'border-box',
        webkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
        borderRadius: '2px',
        opacity: 1,
        transform: 'scale(0, 0)',
        transformOrigin: 'right top 0px',
        position: 'fixed',
        zIndex: 2100,
        backgroundColor: 'rgb(255, 255, 255)',
    }
    Object.assign(div.style,style);
    document.body.appendChild(div);
    return div;
}
