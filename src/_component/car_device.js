import React, {Component} from 'react';

import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';

import Input from '../_component/base/input';


const styles={
    bottomBtn:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    sonpage:{paddingLeft:'1em',paddingRight:'1em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'}
}

export default class CarDevice extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            did:'',
            model:'',
            verify:false,
            warnSpeed:'',
            time:'',
            noEdit:false,
            deviceStatus:'null',
        }
        this.edit=this.edit.bind(this);
        this.didChange=this.didChange.bind(this);
        this.verifyChange=this.verifyChange.bind(this);
        this.warnSpeedChange=this.warnSpeedChange.bind(this);
        this.timeChange=this.timeChange.bind(this);
        this.cancel=this.cancel.bind(this);
        this.submit=this.submit.bind(this);
    }
    edit(){
        this.setState({noEdit:false});
    }
    didChange(e,value){
        this.setState({did:value});
        Wapi.device.get(res=>{
            if(res.data==null){
                this.setState({deviceStatus:'null'});
            }else if(res.data.vehicleId&&res.data.vehicleId!=this.props.curCar.objectId){
                alert(___.binded_other_vehicle);
                this.setState({deviceStatus:'binded'});
            }else{
                this.setState({
                    did:value,
                    model:res.data.model,
                    deviceStatus:'ok',
                });
            }
        },{
            did:value,
            uid:_user.customer.objectId
        },{
            fields:'did,uid,status,commType,commSign,model,vehicleId'
        });
    }
    warnSpeedChange(e,value){
        this.setState({warnSpeed:value});
    }
    timeChange(e,value){
        this.setState({time:value});
    }
    verifyChange(e,value){
        this.setState({verify:value});
    }
    cancel(){
        history.back();
        this.props.cancel();
    }
    submit(){
        if(this.state.did==''){
            alert(___.device_id_empty);
            return;
        }
        if(this.state.deviceStatus=='binded'){
            alert(___.please_re_input_device_num);
            return;
        }else if(this.state.deviceStatus=='null'){
            alert(___.please_input_correct_device_num);
            return;
        }

        //更新车辆的设备信息
        Wapi.vehicle.update(res=>{
            
        },{
            _objectId:this.props.curCar.objectId,
            did:this.state.did,
            deviceType:this.state.model,
        });

        //更新设备的信息
        let deviceInfo={
            did:this.state.did,
            deviceType:this.state.model,
        };
        let now=W.dateToString(new Date());
        Wapi.device.update(res=>{
            history.back();
            this.props.submit(deviceInfo);
        },{
            _did:this.state.did,
            bindDate:now,
            vehicleName:this.props.curCar.name,
            vehicleId:this.props.curCar.objectId,
        });

        //发送指令
        let command=false;
        if(command){
            Wapi.device.sendCommand(res=>{
                
            },{
                did:this.state.did,
                cmd_type:a.type,
                params:{}
            });
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.curCar.did){//如果当前选中车辆已绑定终端，则显示其终端编号和终端型号
            this.setState({
                did:nextProps.curCar.did,
                model:nextProps.curCar.deviceType,
                noEdit:true,
            });
        }else{//如果当前选中车辆未绑定终端，则重置其终端编号和终端型号为空
            this.setState({
                did:'',
                model:'',
                noEdit:false,
                verify:false,
            });
        }
    }
    render(){
        let btnRight=<div/>
        if(this.state.noEdit){
            btnRight=<FlatButton
                        label={___.edit}
                        primary={true}
                        onClick={this.edit}
                    />
        }else{
            btnRight=<FlatButton
                        label={___.ok}
                        primary={true}
                        onClick={this.submit}
                    />
        }
        return(
            <div>
                <div style={styles.sonpage}>
                    <Input 
                        name='did' 
                        floatingLabelText={___.device_id} 
                        onChange={this.didChange} 
                        value={this.state.did}  
                        disabled={this.state.noEdit}
                    />
                    <div style={{paddingTop:'10px',paddingBottom:'1em',color:'rgba(0, 0, 0, 0.298039)'}} >
                        <span>{___.device_type+': '}</span><span name='model'>{this.state.model}</span>
                    </div>
                    {/*<Checkbox 
                        name='verify' 
                        label={___.driver_verify} 
                        labelStyle={{color:'rgba(0, 0, 0, 0.298039)'}}
                        onCheck={this.verifyChange} 
                        checked={this.state.verify} 
                        disabled={this.state.noEdit} 
                    />
                    <Input 
                        name='warnSpeed' 
                        floatingLabelText={___.warn_speed} 
                        onChange={this.warnSpeedChange} 
                        value={this.state.warnSpeed}  
                        disabled={this.state.noEdit}
                    />
                    <Input 
                        name='time' 
                        floatingLabelText={___.forbidden_time} 
                        onChange={this.timeChange} 
                        value={this.state.time}  
                        disabled={this.state.noEdit}
                    />*/}
                </div>
                <div style={styles.bottomBtn}>
                    {/*<FlatButton
                        label={___.cancel}
                        primary={true}
                        onClick={this.cancel}
                    />*/}
                    {btnRight}
                </div>
            </div>
        )
    }
}