import React, {Component} from 'react';

import ActionSearch from 'material-ui/svg-icons/action/search';
import IconInput from '../iconInput';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';

const sty={
    a:{
        boxShadow:'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        verticalAlign: 'bottom',
        marginRight: '1em'
    },
    item:{
        padding: '5px 10px',
        lineHeight: '40px',
        borderBottom:'1px solid #ccc',
        cursor:'pointer'
    }
}

class Select extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            show:0
        }
        this.data={};
        this.brandChange = this.brandChange.bind(this);
        this.serieChange = this.serieChange.bind(this);
        this.typeChange = this.typeChange.bind(this);
        this.back = this.back.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return(nextState.show!=this.state.show);
    }
    
    
    next(){
        let show=this.state.show+1;
        this.setState({show});
        history.pushState
    }

    brandChange(id,name){
        if(this.state.show!=0)return;
        this.data.brandId=id;
        this.data.brand=name;
        this.next();
    }

    serieChange(id,name){
        if(this.state.show!=1)return;
        this.data.serieId=id;
        this.data.serie=name;
        this.next();
    }

    typeChange(id,name){
        if(this.state.show!=2)return;
        if(id){
            this.data.typeId=id;
            this.data.type=name;
        }else{
            delete this.data.typeId;
            delete this.data.type;
        }
        setTimeout(()=>this.setState({show:0}),300);
        this.props.onChange(Object.assign({},this.data));
    }
    back(){
        if(this.state.show){
            let show=this.state.show-1;
            this.setState({show});
        }else{
            this.props.onChange();
        }
    }
    
    render() {
        let dis=[false,false,false];
        dis[this.state.show]=true;
        return (
            <div>
                <AppBar iconElementLeft={<IconButton onClick={this.back}><NavigationArrowBack/></IconButton>}/>
                <Brands onChange={this.brandChange} display={dis[0]}/>
                <Series onChange={this.serieChange} display={dis[1]} serie={true} parent={this.data.brandId}/>
                <Series onChange={this.typeChange} display={dis[2]} serie={false} parent={this.data.serieId}/>
            </div>
        );
    }
}

class Brands extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            brands:[],
            search:false,
            search_brands:[]
        }
        this.change = this.change.bind(this);
        this.search = this.search.bind(this);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.display==this.props.display&&nextState==this.state)
            return false;
        else
            return true;
    }
    
    componentDidMount() {
        let that=this;
        Wapi.base.carBrand(function(res){
            that.data=res.data;
            let brands=that.showBrands(res.data);
            that.setState({brands});
        },{
            lang:navigator.language.split('-')[0].toLowerCase()
        });
    }

    showBrands(data){
        let brands=[],t;
        for(let i=0;i<data.length;i++){
            let ele=data[i]
            if(t!==ele.t_spell){
                t=ele.t_spell;
                brands.push(<div key={t} style={{paddingLeft:'10px',fontSize:'18px',fontWeight: 700,backgroundColor:this.context.muiTheme.palette.primary3Color}}>{t}</div>)
            }
            let imgUrl=(ele.url_icon&&ele.url_icon!='String')?'http://img.wisegps.cn/logo/'+ele.url_icon:'http://h5.bibibaba.cn/baba/wx/img/icon_car_moren.png';
            brands.push(<div 
                onClick={this.change} 
                data-id={ele.id} 
                data-name={ele.name} 
                key={ele.id} 
                style={sty.item}
                onTouchStart={touchStart} 
                onTouchEnd={touchEnd}
            >
                <img src={imgUrl} style={sty.a}/>
                {ele.name}
            </div>);
        }
        return brands;
    }

    change(e){
        let id=parseInt(e.currentTarget.dataset.id);
        let name=e.currentTarget.dataset.name;
        this.props.onChange(id,name);
    }

    search(e,val){
        if(val){
            let search_brands=this.showBrands(this.data.filter(ele=>ele.name.toLowerCase().indexOf(val.toLowerCase())!=-1));
            this.setState({search_brands,search:true});
        }else
            this.setState({search:false});
    }

    render() {
        let dis=this.props.display?'block':'none';
        let serarch_dis=this.state.search?'block':'none';
        let _dis=this.state.search?'none':'block';
        return (
            <div style={{display:dis}}>
                <IconInput name='brand_search' hintText={___.search_car_brand} icon={ActionSearch} onChange={this.search}/>
                <div style={{display:_dis}}>
                    {this.state.brands}
                </div>
                <div style={{display:serarch_dis}}>
                    {this.state.search_brands}
                </div>
            </div>
        );
    }
}

Brands.contextTypes = {
    muiTheme: React.PropTypes.object
};


class Series extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:[{}]
        }
        this.change = this.change.bind(this);
        this.setData = this.setData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.parent)return;
        if(nextProps.parent!=this.props.parent){
            this.setState({data:[]});
            let data={
                pid:nextProps.parent,
                lang:navigator.language.split('-')[0].toLowerCase()
            }
            if(nextProps.serie)
                Wapi.base.carSerie(this.setData,data);
            else
                Wapi.base.carType(this.setData,data);
        }else if(!this.state.data.length){
            this.props.onChange();
        }
    }

    setData(res){
        if(!res||!res.data||!res.data.length){
            this.props.onChange(); 
        }else
            this.setState({data:res.data});
    }
    
    change(e){
        let id=parseInt(e.currentTarget.dataset.id);
        let name=e.currentTarget.dataset.name;
        this.props.onChange(id,name);
    }
    
    render() {
        let items=this.state.data.map(ele=>(<div
            onClick={this.change}
            data-id={ele.id}
            data-name={ele.name}
            key={ele.id}
            style={sty.item}
            onTouchStart={touchStart} 
            onTouchEnd={touchEnd}
        >{ele.name}</div>));
        let dis=this.props.display?'block':'none';
        return (
            <div style={{display:dis}}>
                {items}
            </div>
        );
    }
}



export default Select;

function touchStart(e){
    e.target.style.background='#eee';
}
function touchEnd(e){
    e.target.style.background='#fff';
}