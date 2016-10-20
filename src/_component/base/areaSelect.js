import React, {Component} from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


const styles={
    select:{
        overflow:'hidden',
        width: '33.33333%',
        verticalAlign: 'bottom',
        textAlign:'left',
    },
    babel:{
        paddingRight:'20px'
    },
    menuItem:{
        paddingLeft:'5px'
    }
}
const _op={
    fields:'id,name,parentId,level'
}

export default class AreaSelect extends Component{
    constructor(props,context) {
        super(props,context);
        this.state={
            provinces:[],
            province:'',
            provinceId:-1,

            cities:[],
            city:'',
            cityId:-1,

            areas:[],
            area:'',
            areaId:-1
        };
    }
    componentDidMount() {
        let _this=this;
        Wapi.area.list(function(res){
            if(res.status_code!=0||res.data.length==0)return;
            let prs=res.data;
            let province_options=res.data.map(ele=><MenuItem innerDivStyle={styles.menuItem} value={ele.id} key={ele.id} primaryText={ele.name} />);
            province_options.unshift(<MenuItem innerDivStyle={styles.menuItem} value={-1} key={-1} primaryText={___.province} />);
            _this.province_options=province_options;
            _this.setState({
                provinces:res.data
            });
        },{level:1},_op);
        if(this.props.value){
            this.setValue(this.props.value);
        }
    }
    componentWillReceiveProps(newProps){
        if(newProps.value){
            this.setValue(newProps.value);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        for(let k in this.state){
            if(this.state[k]!=nextState[k])
                return true;
        }
        return false;
    }
    
    setValue(value){
        let e=true;
        for(let k in value){
            if(this.state[k]!=value[k])
                e=false;
        }
        if(e)return;

        let that=this;
        if(value.provinceId!=this.state.provinceId&&value.provinceId!=-1){
            Wapi.area.list(res=>{
                if(res.status_code!=0||res.data.length==0)return;
                that.setState({cities:res.data});
            },{parentId:value.provinceId},_op);
        }else
            this.setState({cityId:value.cityId});
            
        if(value.cityId!=this.state.cityId&&value.cityId!=-1){
            Wapi.area.list(res=>{
                if(res.status_code!=0||res.data.length==0)return;
                that.setState({areas:res.data});
            },{parentId:value.cityId},_op);
        }else
            this.setState({areaId:value.areaId});
            

        this.setState({
            province:value.province,
            provinceId:value.provinceId*1,
            city:value.city,
            cityId:value.cityId*1,
            area:value.area,
            areaId:value.areaId*1
        });
    }
    
    provinceChange(e,i,value){
        let areaId=value;
        if(areaId==-1){
            this.setState({
                province:'',
                provinceId:-1,

                cities:[],
                city:'',
                cityId:-1,

                areas:[],
                area:'',
                areaId:-1
            });
        }else{
            this.setState({
                province:this.state.provinces.find(ele=>ele.id==areaId).name,
                provinceId:areaId,
                cityId:-1,
                areaId:-1,
                areas:[]
            });
            let _this=this;
            Wapi.area.list(res=>this.setState({cities:res.data}),{parentId:areaId},_op);
        }
    }
    cityChange(e,i,value){
        let areaId=value;
        if(areaId==-1){
            this.setState({
                city:'',
                cityId:-1,

                areas:[],
                area:'',
                areaId:-1
            });
        }else{
            this.setState({
                city:this.state.cities.find(ele=>ele.id==areaId).name,
                cityId:areaId,
                areaId:-1,
            });
            let _this=this;
            Wapi.area.list(function(res){
                if(res.status_code!=0||res.data.length==0)return;
                let ads=res.data;
                if(ads.length==0){
                    let data={
                        province:this.state.province,
                        provinceId:this.state.provinceId,
                        cityId:this.state.cityId,
                        city:this.state.city,
                    }
                    _this.props.onChange(data,_this.props.name);
                }else{
                    _this.setState({areas:ads});
                }
            },{parentId:areaId},_op);
        }
    }
    areaChange(e,i,value){
        let areaId=value;
        if(areaId==-1){
            this.setState({
                area:'',
                areaId:-1
            });
        }else{
            let name=this.state.areas.find(ele=>ele.id==areaId).name;
            this.setState({
                area:name,
                areaId:areaId
            });
            let data={
                provinceId:this.state.provinceId,
                province:this.state.province,
                cityId:this.state.cityId,
                city:this.state.city,
                area:name,
                areaId:areaId
            }
            this.props.onChange(data,this.props.name);
        }
    }
    render(){
        let city_options=[];
        if(this.state.cities.length>0)
            city_options=this.state.cities.map(ele=><MenuItem innerDivStyle={styles.menuItem} value={ele.id} key={ele.id} primaryText={ele.name} />);
        city_options.unshift(<MenuItem innerDivStyle={styles.menuItem} value={-1} key={-1} primaryText={___.city} />);

        let area_options=[];
        if(this.state.areas.length>0)
            area_options=this.state.areas.map(ele=><MenuItem innerDivStyle={styles.menuItem} value={ele.id} key={ele.id} primaryText={ele.name} />);
        area_options.unshift(<MenuItem innerDivStyle={styles.menuItem} value={-1} key={-1} primaryText={___.area} />);
        return(
            <div>
                <SelectField
                    value={this.state.provinceId}
                    onChange={this.provinceChange.bind(this)}
                    style={styles.select}
                    labelStyle={styles.babel}
                >
                    {this.province_options}
                </SelectField>

                <SelectField
                    value={this.state.cityId}
                    onChange={this.cityChange.bind(this)}
                    style={styles.select}
                    labelStyle={styles.babel}
                >
                    {city_options}
                </SelectField>

                <SelectField
                    value={this.state.areaId}
                    onChange={this.areaChange.bind(this)}
                    style={styles.select}
                    labelStyle={styles.babel}
                >
                    {area_options}
                </SelectField>
            </div>
        )
    }
}