"use strict";
import React, {Component} from 'react';

import WMap from '../_modules/WMap';
import {getStatusDesc,getAllState} from '../_modules/car_state';
import Playback from './playback';

const sty={
    pb:{
        position: 'absolute',
        zIndex: 1,
        background: '#fff'
    },
    w:{ 
        width: '100%'
    }
}

class Map extends Component {
    constructor(props){
        super(props);
        this.state={
            clear:false,
            cars:[],
            playback:{}
        }
        this.mapinit = this.mapinit.bind(this);
        this.order = this.order.bind(this);
    }

    componentDidMount() {
        if(typeof WMap!='undefined'&&WMap.ready){//已经加载好
            this.mapinit();
        }else{
            window.addEventListener('W.mapready',this.mapinit);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (!this.state.clear||!nextState.clear);
    }

    componentWillReceiveProps(nextProps) {
        //过滤掉没有绑定设备或者还没有定位数据的车辆
        let cars=nextProps.cars.filter(car=>(!!car._device&&!!car._device.activeGpsData));
        this.setState({cars});
    }
    

    componentDidUpdate(prevProps, prevState) {
        if(this.state.cars.length!=prevState.cars.length&&this.map){
            let view=this.state.cars.map(function (ele) {
                return new WMap.Point(ele._device.activeGpsData.lon, ele._device.activeGpsData.lat);
            });
            this.map.setViewport(view);//设置合适的层级大小
        }
    }
    
    
    mapinit(){
        this.map=new WMap.Map(this.props.id);
        if(WiStorm.agent.mobile){
            this.map.addControl(new WMap.NavigationControl({type:BMAP_NAVIGATION_CONTROL_ZOOM,anchor:BMAP_ANCHOR_BOTTOM_RIGHT,offset: new WMap.Size(5, 20)}));//添加缩放控件
        }else
            this.map.enableScrollWheelZoom();//启用滚轮放大缩小
        this.map.infoWindow=new WMap.InfoWindow('',{
            width : 350,     // 信息窗口宽度
            height: 200     // 信息窗口高度
        });
        let div=document.createElement('div');
        this.map.infoWindow.setContent(div);
        this.map.infoWindow._div=div;
        this.map.infoWindow._close=function(){};
        this.map.infoWindow.addEventListener('close',function(){
            if(this._close)
                this._close();
        })
        this.forceUpdate();
    }

    order(action){
        //子组件命令父组件执行的命令
        switch (action.type) {
            case 'clear':
                //清除所有车辆
                this.map.clearOverlays();
                this.map.closeInfoWindow();
                this.setState({clear:true,playback:action.data});
                break;
            case 'recovery':
                this.setState({clear:false});
                break;
            default:
                break;
        }
    }

    render() {
        let children=this.state.clear?(<Playback style={sty.pb} map={this.map} order={this.order} data={this.state.playback}/>):null;
        if(this.map&&!this.state.clear){
            let windowOpen=false;
            children=[];
            this.state.cars.forEach(function (ele) {
                windowOpen=(this.props.active==ele.objectId);
                children.push(<Car 
                    key={ele.objectId}
                    map={this.map}
                    data={ele} 
                    carClick={this.props.carClick} 
                    open={windowOpen}
                    order={this.order}
                />);
            },this);
        }
        return (
            <div style={sty.w}>
                {children}
                <div {...this.props}></div>
            </div>
        );
    }
}

class Car extends Component{
    constructor(props){
        super(props);
        this.openWindow = this.openWindow.bind(this);
        this.state={
            tracking:false
        };
    }
    componentDidMount(){
        let data=this.props.data._device;
        this.marker=this.props.map.addMarker({
            img:'http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif',
            w:28,
            h:28,
            lon:data.activeGpsData.lon,
            lat:data.activeGpsData.lat
        });
        this.marker.addEventListener("click",this.openWindow);
        
        if(this.props.open){//打开infowindow
            this.marker.openInfoWindow(this.getWindow());
        }
        this.setMarker();
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.open&&!this.props.open){
            this.marker.openInfoWindow(this.getWindow());
        }
        let pos=new WMap.Point(nextProps.data._device.activeGpsData.lon,nextProps.data._device.activeGpsData.lat);
        this.marker.setPosition(pos);
        if(this.state.tracking){
            //跟踪当中
            let tracking_line=this.state.tracking_line.concat(pos);
            this.setState(Object.assign({},this.state,{tracking_line}));
        }

        this.setMarker();
    }
    componentWillUpdate(nextProps, nextState){
        if(nextState.tracking){//跟踪状态
            if(!this.state.tracking||nextState.tracking_line.length!=this.state.tracking_line.length){//开始跟踪
                let polyline = new WMap.Polyline(
                    nextState.tracking_line,
                    {
                        strokeColor:"blue", 
                        strokeWeight:5, 
                        strokeOpacity:0.5
                    }
                );
                if(this.polyline)this.props.map.removeOverlay(this.polyline);
                this.props.map.addOverlay(polyline); 
                this.polyline=polyline;
            }
        }else if(this.polyline){
            this.props.map.removeOverlay(this.polyline); 
            this.polyline=undefined;
        }
    }
    componentWillUnmount() {//移除
        if(this.props.open){
            this.props.map.infoWindow._close=null;
        }
        this.props.map.removeOverlay(this.marker);
        this.marker=undefined;
        if(this.polyline){
            this.props.map.removeOverlay(this.polyline);
            this.polyline=undefined;
        }
    }

    openWindow(){
        console.log('打开窗口')
        this.props.carClick(this.props.data.objectId);
    }
    getWindow(){
        var div=this.props.map.infoWindow._div;
        let new_div=info(this.props.data,this);
        if(div._content)
            div.replaceChild(new_div,div._content);
        else
            div.appendChild(new_div);
        div._content=new_div;
        this.props.map.infoWindow._close=null;
        setTimeout(()=>this.props.map.infoWindow._close=()=>this.props.carClick(0),500);//避免从一个车点到另一个车会触发这个方法

        return this.props.map.infoWindow;
    }
    setMarker(){
        let imgs=[
            'http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif',//停止
            'http://web.wisegps.cn/stylesheets/objects/normal_run_0.gif',//行驶
            'http://web.wisegps.cn/stylesheets/objects/normal_offline_0.gif'//离线
        ];
        let state=getStatusDesc(this.props.data._device,2);
        let icon=this.marker.getIcon();
        icon.setImageUrl(imgs[state.state]);
        this.marker.setIcon(icon);
        if(this.props.data._device.activeGpsData.direct)
            this.marker.setRotation(this.props.data._device.activeGpsData.direct);
    }
    track(start){//开始跟踪或者取消
        if(start){
            let pos=new WMap.Point(this.props.data._device.activeGpsData.lon,this.props.data._device.activeGpsData.lat);
            this.setState({
                tracking:true,
                tracking_line:[pos]
            });
        }else if(this.state.tracking){           
            this.setState({
                tracking:false,
                tracking_line:[]
            });
        }
    }

    playback(){
        //回放
        this.props.order({type:'clear',data:this.props.data});
        // this.props.map;
    }


    render(){
        return null;
    }
}

function info(data,thisCar) {
    let g,gt;
    if(data._device.activeGpsData.gpsFlag==2){
        g='_g',gt=___.gps_location;
    }else{
        g='',gt=___.no_gps_location;
    }
    // let model=(data.call_phones.length&&data.call_phones[0].obj_model)?'('+data.call_phones[0].obj_model+')':'';
    let desc=getAllState(data._device);

    let div=document.createElement('div');
    div.style.fontSize='14px';
    div.innerHTML=W.replace('<p><span><font style="font-size: 15px; font-weight:bold; font-family:微软雅黑;">'+data.name+'</font></span><img src="http://web.wisegps.cn/images/wifi'+desc.signal_l+'.png" title="<%signal%>'+desc.singal_desc+'"/><img src="http://web.wisegps.cn/images/gps'+g+'.png" title="'+gt+'"/></p><table style="width: 100%;"><tbody><tr><td><font color="#244FAF"><%car_state%>：</font>'+desc.desc+'</td><td><font color="#244FAF"><%state%>：</font>'+desc.status_desc+'</td></tr><tr><td colspan="2"><font color="#244FAF"><%gps_time%>：'+desc.gps_time+'</font></td></tr><tr><td colspan="2"><font color="#244FAF"><%position_description%>：</font><span class="location"><%getting_position%></span></td></tr></tbody></table>');
    
    let b=document.createElement('button');
    b.innerText=thisCar.state.tracking?___.untrack:___.track;
    b.addEventListener('click',function(){
        thisCar.track(!thisCar.state.tracking);
        this.innerText=thisCar.state.tracking?___.untrack:___.track;
    });
    let c=document.createElement('button');
    c.addEventListener('click',function(){
        thisCar.playback();
    });
    c.innerText=___.playback;
    div.appendChild(b);
    div.appendChild(c);

    let geo=new WMap.Geocoder();
    geo.getLocation(new WMap.Point(data._device.activeGpsData.lon,data._device.activeGpsData.lat),function(res){
        if(res)
            div.querySelector('.location').innerText=res.address;
    });
    return div;
}




















export default Map;