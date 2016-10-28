import React from 'react';
import ReactDOM from 'react-dom';

import Fab from '../_component/base/fab';
import AppBar from '../_component/base/appBar';

import {ThemeProvider} from '../_theme/default';

import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionInfo from 'material-ui/svg-icons/action/info';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import HardwareKeyboard from 'material-ui/svg-icons/hardware/keyboard';

import CarBrand from '../_component/base/carBrand';
import Sonpage from '../_component/base/sonPage';
import CarDevice from '../_component/car_device';
import CarInfo from '../_component/car_info';
import AutoList from '../_component/base/autoList';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const styles={
    main_mobile:{width:'90%',paddingTop:'50px',marginLeft:'5%',marginRight:'5%',},
    bottomBtn:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    iconStyle:{marginRight: '12px'},
    sonpage:{paddingLeft:'1em',paddingRight:'1em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'}
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            vehicles:[],            //所有车辆
            isEditingDriver:false,  //正在编辑驾驶人员，为true则显示'驾驶人员'子页面
            isEditingDevice:false,  //正在编辑设备，为true则显示'设备管理'子页面
            isShowingInfo:false,    //正在显示信息，为true则显示'详细信息'子页面
            curCar:{},              //当前车辆，用于显示'驾驶人员''设备管理'的时候判断当前所选车辆
            drivers:[],             //驾驶人员，当前所选车辆的驾驶人员数组
            did:{},                 //设备id，当前所选车辆绑定的设备id
            fabDisplay:'block',     //feb的display，当显示子页面的时候，设置为'none'以隐藏右下角'添加车辆'按钮

            total:0,                //获取的车辆的总数，用于分页的时候判定是否最后一页
        }
        this.page=1;                //当前页码

        //'设备信息'相关
        this.editDevice=this.editDevice.bind(this);
        this.editDeviceCancel=this.editDeviceCancel.bind(this);
        this.editDeviceSubmit=this.editDeviceSubmit.bind(this);
        //'更多信息'相关
        this.showInfo=this.showInfo.bind(this);
        this.showInfoCancel=this.showInfoCancel.bind(this);
        this.showInfoSubmit=this.showInfoSubmit.bind(this);
    }
    getChildContext(){
        return {
            view:thisView,//用于carBrand的子页面打开
            editDevice:this.editDevice,
            showInfo:this.showInfo
        };
    }

    componentDidMount(){
        this.getVehicles();//初始化时获取所有车辆数据
        let that=this;
        thisView.addEventListener('message',function(e){
            if(e.data=='add_car'){
                that.getVehicles();
            }
        });
    }
    getVehicles(){
        Wapi.vehicle.list(res=>{
            if(res.data.length>0){
                this.setState({
                    vehicles:res.data,
                    total:res.total
                });
            }
        },{
            uid:_user.customer.objectId
        },{
            fields:'objectId,name,uid,departId,brandId,brand,model,modelId,type,typeId,desc,frameNo,engineNo,buyDate,mileage,maintainMileage,insuranceExpireIn,inspectExpireIn,serviceType,feeType,serviceRegDate,serviceExpireIn,did,drivers,managers,deviceType',
            limit:20,
        });
    }
    
    addCar(){
        thisView.goTo('car_add.js');//跳转到新增车辆页面
    }


    editDevice(car){
        let _this=this;
        if(!car.did){
            W.confirm(___.confirm_device_bind,function(b){
                if(b){
                    _this.setState({
                        isEditingDevice:true,
                        fabDisplay:'none',
                        curCar:car,
                    });
                }else{
                    return;
                }
            });
        }else{
            _this.setState({
                isEditingDevice:true,
                fabDisplay:'none',
                curCar:car,
            });
        }
    }
    editDeviceCancel(){
        this.setState({
            isEditingDevice:false,
            fabDisplay:'block',
        });
    }
    editDeviceSubmit(data){
        this.setState({
            isEditingDevice:false,
            fabDisplay:'block',
        });
        curCar.did=data.did;
        curCar.deviceType=data.deviceType;
        // this.getVehicles();
    }
    
    showInfo(car){
        this.setState({
            curCar:car,
            isShowingInfo:true,
            fabDisplay:'none',
        });
    }
    showInfoCancel(){
        this.setState({
            isShowingInfo:false,
            fabDisplay:'block',
        });
    }
    showInfoSubmit(intent,objectId){
        let arr=this.state.vehicles;
        if(intent=='delete'){//如果删除了一个车辆，则更新state
            arr=arr.filter(ele=>ele.objectId!=objectId);
            this.setState({vehicles:arr});
        }
        this.setState({
            isShowingInfo:false,
            fabDisplay:'block',
        });
    }

    loadNextPage(){
        let arr=this.state.vehicles;
        this.page++;
        Wapi.vehicle.list(res=>{
            if(res.data.length>0){
                this.setState({
                    vehicles:arr.concat(res.data),
                    total:res.total
                });
            }
        },{
            uid:_user.customer.objectId
        },{
            fields:'objectId,name,uid,departId,brandId,brand,model,modelId,type,typeId,desc,frameNo,engineNo,buyDate,mileage,maintainMileage,insuranceExpireIn,inspectExpireIn,serviceType,feeType,serviceRegDate,serviceExpireIn,did,drivers,managers,deviceType',
            limit:20,
            page_no:this.page
        });
    }
    goToDevice(){
        thisView.goTo('device_manage.js');
    }

    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.car_manage} 
                        style={{position:'fixed',top:'0px'}}
                        iconElementRight={<IconButton onClick={this.goToDevice}>
                            <HardwareKeyboard style={{
                                width:'32px',
                                height:'32px'
                            }}/>
                        </IconButton>}
                     />
                    <div style={styles.main_mobile} >
                        <Alist 
                            max={this.state.total} 
                            limit={20} 
                            data={this.state.vehicles} 
                            next={this.loadNextPage} 
                        />
                    </div>
                    <Fab sty={{display:this.state.fabDisplay}} onClick={this.addCar}/>
                    
                    <Sonpage open={this.state.isEditingDevice} back={this.editDeviceCancel}>
                        <CarDevice cancel={this.editDeviceCancel} submit={this.editDeviceSubmit} curCar={this.state.curCar}/>
                    </Sonpage>
                    
                    <Sonpage open={this.state.isShowingInfo} back={this.showInfoCancel}>
                        <CarInfo cancel={this.showInfoCancel} submit={this.showInfoSubmit} curCar={this.state.curCar}/>
                    </Sonpage>
                </div>
            </ThemeProvider>
        );
    }
}

App.childContextTypes={
    view: React.PropTypes.object,//用于carBrand的子页面打开
    editDevice:React.PropTypes.func,
    showInfo:React.PropTypes.func
}

class DumbList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        let vehicleItems = this.props.data.map(ele=>
            <Card key={ele.objectId} style={{marginTop:'1em',padding:'0.5em 1em'}} >
                <table >
                    <tbody >
                        <tr>
                            <td style={styles.td_left}>{___.carNum}</td>
                            <td style={styles.td_right}>{ele.name}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.car_model}</td>
                            <td style={styles.td_right}>{ele.brand+' '+ele.model}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.device_type}</td>
                            <td style={styles.td_right}>{ele.deviceType}</td>
                        </tr>
                    </tbody>
                </table>
                <Divider style={{marginTop:'1em'}}/>
                <div style={styles.bottomBtn}>
                    <DeviceBtn data={ele} onClick={this.context.editDevice} />
                    <InfoBtn data={ele} onClick={this.context.showInfo}/>
                </div>
            </Card>);
        return(
            <div style={{paddingBottom:'70px'}}>
                {vehicleItems}
            </div>
        );
    }
}
 DumbList.contextTypes={
    editDevice: React.PropTypes.func,
    showInfo: React.PropTypes.func
};
let Alist=AutoList(DumbList);

const _driver={
    name:'123',
    status:'0',
    distributeTime:'2016-08-22',
    syncTime:'今天',
    bindTime:'明天',
    stopTime:'后天',
}
const _drivers=[];
for(let i=0;i<9;i++){
    _drivers[i]=_driver;
}
const _statuses=['status0','status1','status2'];

class DeviceBtn extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <ActionSettings style={styles.iconStyle} onClick={this.handleClick.bind(this)} />
        )
    }
}

class InfoBtn extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <ActionInfo style={styles.iconStyle} onClick={this.handleClick.bind(this)} />
        )
    }
}

