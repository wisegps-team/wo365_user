import React, {Component} from 'react';

import IconButton from 'material-ui/IconButton';
import LinearProgress from 'material-ui/LinearProgress';
import DateTime from './base/dateTime';
import Slider from 'material-ui/Slider';

import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AvPause from 'material-ui/svg-icons/av/pause';
import AvStop from 'material-ui/svg-icons/av/stop';
import EditorVerticalAlignTop from 'material-ui/svg-icons/editor/vertical-align-top';   
import ContentClear from 'material-ui/svg-icons/content/clear';   

import {getStatusDesc,getAllState} from '../_modules/car_state';

import WMap from '../_modules/WMap';


const sty={
    name:{
        padding:'8px'
    },
    d:{
        display:'flex',
        alignItems: 'center',
        padding:'0 8px'
    },
    l:{
        flexGrow: 0,
        marginRight: '5px'
    },
    r:{
        flexGrow: 2,
        width:'50%'
    },
    s:{
        width:'100%'
    },
    f:{
        fontSize: '0.9em'
    },
    fr:{
        float: 'right',
        padding: 0,
        width: '36px',
        height: '36px'
    },
    lh:{
        lineHeight: '36px'
    }
}
// Object.assign(sty.s,sty.r);

class Playback extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            play:0,//0,默认停止,1暂停，2播放
            completed:0
        }
        this.data={
            speed:600,
            start_time:clearTime(new Date()),
            end_time:new Date()
        };
        this._new_data=true;//标示是否需要重新获取数据'
        this.handlePlay = this.handlePlay.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.time = this.time.bind(this);
        this.move = this.move.bind(this);
        this.back = this.back.bind(this);
        this.speedChange = this.speedChange.bind(this);

        this.marker=props.map.addMarker({
            img:'http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif',
            w:28,
            h:28,
            lon:props.data._device.activeGpsData.lon,
            lat:props.data._device.activeGpsData.lat
        });
        this.linePos=[];
    }
    componentWillUnmount() {
        clearTimeout(this._id);
        this.stop();
        this.props.map.clearOverlays();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data!=this.props.data)
            this._new_data=true;
    }
    
    
    stop(){
        this.linePos=[];
        clearTimeout(this._id);
        this.props.map.removeOverlay(this.polyline); 
        this.polyline=undefined;
        this.i=0;
    }

    move(){
        if(this.i<this.gpsData.length){
            // let map=this.props.map;
            let state=this.setMarker(this.gpsData[this.i]);
            let completed=Math.round((this.i/this.gpsData.length)*100);
            if(this.state.completed!=completed)
                this.setState({completed});
            this.i++;
            this._id=setTimeout(()=>this.move(),this.data.speed);
        }else{
            this.i=0;
            this.setState({play:0,completed:0});
        }
    }
    setMarker(activeGpsData){
        let imgs=[
            'http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif',//停止
            'http://web.wisegps.cn/stylesheets/objects/normal_run_0.gif',//行驶
            'http://web.wisegps.cn/stylesheets/objects/normal_offline_0.gif'//离线
        ];
        let state=getStatusDesc({activeGpsData},3);
        if(!state.state&&!this.stop_pos)//如果是停止状态且没有记录，则记录当前停止地点
            this.stop_pos=activeGpsData;
        if(state.state==1&&this.stop_pos){//如果是行驶状态且有记录停止地点，则添加一个停车标志，并移除记录的停止地点
            this.setStopMarker(activeGpsData);
        }
        state.gps_time=W.dateToString(W.date(activeGpsData.gpsTime));
        let icon=this.marker.getIcon();
        icon.setImageUrl(imgs[state.state]);
        this.marker.setIcon(icon);
        if(activeGpsData.direct)
            this.marker.setRotation(activeGpsData.direct);
        let pos=new WMap.Point(activeGpsData.lon,activeGpsData.lat);
        this.marker.setPosition(pos);
        var bounds = this.props.map.getBounds();
        if (activeGpsData.lon < bounds.getSouthWest().lng || activeGpsData.lon > bounds.getNorthEast().lng ||
            activeGpsData.lat < bounds.getSouthWest().lat || activeGpsData.lat > bounds.getNorthEast().lat) {
            this.props.map.setCenter(pos);
        }
        this.refs.car_state.innerText=state.desc;
        this.refs.gps_time.innerText=state.gps_time;
        this.linePos.push(pos);
        this.setLine();
        return state;
    }
    setStopMarker(end){//给地图上添加一个停车标志,接受一个启动时的位置数据
        let start=this.stop_pos;
        delete this.stop_pos;
        let et=W.date(end.gpsTime);
        let st=W.date(start.gpsTime);
        let time=(et-st)/60/1000;
        if(time>5){//大于5分钟
            let map=this.props.map;
            let marker=map.addMarker({
                img:'http://web.wisegps.cn/stylesheets/MapImages/location.png',
                w:28,
                h:28,
                lon:start.lon,
                lat:start.lat
            });
            let div=document.createElement('div');
            div.innerHTML=W.replace('<h4><%start_time%>：'+W.dateToString(st)+'</h4><h4><%stay_time%>：'+time+'<%m%></h4><p><%position_description%>：<span class="location"></span></p>');
            div.style.fontSize='14px';
            new WMap.Geocoder().getLocation(
                new WMap.Point(start.lon,start.lat),
                res=>div.querySelector('.location').innerText=res?res.address:''
            );
            marker._window=new WMap.InfoWindow(
                div,
                {
                    width : 300,     // 信息窗口宽度
                    height: 150     // 信息窗口高度
                }
            );
            marker._window.setContent(div);
            marker.addEventListener('click',function(){
                this.openInfoWindow(this._window);
            })
        }
    }

    setLine(){
        //重新画一条线，如果性能有问题就改为不断添加直线吧
        let polyline = new WMap.Polyline(
            this.linePos,
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
    

    handlePlay(){
        let play=(this.state.play<2)?2:1;
        switch (this.state.play) {
            case 0://开始播放
                this.stop();
                if(this._new_data){
                    this._new_data=false;
                    let that=this;
                    Wapi.gps.list(function(res){
                        that.gpsData=res.data;
                        that.i=0;
                        that.move();
                    },{
                        gpsTime:W.dateToString(this.data.start_time)+'@'+W.dateToString(this.data.end_time),
                        did:this.props.data.did,
                        map:WiStorm.config.map
                    });
                }else{//重新播放
                    this.i=0;
                    this.move();
                }
                break;
            case 1://恢复播放
                this.move();
                break;
            case 2://暂停播放
                clearTimeout(this._id);
                break;
            default:
                break;
        }
        this.setState({play});
    }
    handleStop(){
        this.stop();
        // this.setState({play:0,completed:0});
        setTimeout(()=>this.setState({play:0,completed:0}),100);
    }
    time(val,name){
        let tem={};
        tem[name]=val;
        this._new_data=true;
        this.data=Object.assign({},this.data,tem);
    }
    speedChange(e,val){
        val=1-val;
        this.data['speed']=val*800+200;
    }
    back(){
        clearTimeout(this._id);
        this.props.map.clearOverlays();
        this.props.order({type:'recovery'});
    }

    render() {
        let icon=this.state.play<2?(<AvPlayArrow/>):(<AvPause/>);
        let stop=this.state.play?(<IconButton onClick={this.handleStop}><AvStop/></IconButton>):null;
        return (
            <div {...this.props} map={null} order={null} data={null}>
                <div style={sty.d}>
                    <label style={sty.l}>{___.carNum+':'}</label>
                    <div style={sty.r}>
                        <span style={sty.lh}>
                            {this.props.data.name}
                        </span>
                        <IconButton onClick={this.back} style={sty.fr}>
                            <ContentClear/>
                        </IconButton>
                    </div>
                </div>
                <div style={sty.d}>
                    <label style={sty.l}>{___.start_time+':'}</label>
                    <DateTime 
                        style={sty.r} 
                        value={this.data.start_time} 
                        name={'start_time'}
                        onChange={this.time}
                    />
                </div>
                <div style={sty.d}>
                    <label style={sty.l}>{___.end_time+':'}</label>
                    <DateTime 
                        style={sty.r} 
                        value={this.data.end_time}
                        name={'end_time'} 
                        onChange={this.time}
                    />
                </div>     
                <div style={sty.d}>
                    <label style={sty.l}>{___.play_speed+':'}</label>
                    <div style={sty.r}>
                        <Slider 
                            defaultValue={0.5} 
                            style={sty.s} 
                            onChange={this.speedChange}
                        />
                    </div>
                </div>   
                <div style={sty.d}>
                    <label style={sty.l}>
                        <IconButton onClick={this.handlePlay}>
                            {icon}
                        </IconButton>
                        {stop}
                    </label>
                    <div style={sty.r}>
                        <div style={sty.f}>
                            <label>{___.car_state+':'}</label>
                            <span ref={'car_state'}></span>
                        </div>
                        <div style={sty.f}>
                            <label>{___.gps_time+':'}</label>
                            <span ref={'gps_time'}></span>
                        </div>
                    </div>
                </div>            
                
                
                <LinearProgress mode="determinate" value={this.state.completed} />
            </div>
        );
    }
}

function clearTime(date){
	let newDate=new Date(date.getTime());
	newDate.setHours(0);
	newDate.setMinutes(0);
	newDate.setSeconds(0);
	newDate.setMilliseconds(0);
	return newDate;
}
export default Playback;