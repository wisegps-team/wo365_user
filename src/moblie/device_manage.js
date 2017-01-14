"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
// import AppBar from '../_component/base/appBar';
import {List,ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Card from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import STORE from '../_reducers/main';
import BrandSelect from'../_component/base/brandSelect';
import SonPage from '../_component/base/sonPage';
import DeviceLogList from '../_component/device_list';
import ProductLogList from '../_component/productlog_list';
import {reCode} from '../_modules/tool';
import UserSearch from '../_component/user_search';


const styles = {
    main:{paddingBottom:'20px'},
    list_item:{marginTop:'1em',padding:'0.5em',borderBottom:'1px solid #999999'},
    card:{margin:'1em',padding:'0.5em'},
    show:{paddingTop:'50px'},
    hide:{display:'none'},
    a:{position: 'absolute',width:'100%',bottom:'10px'},
    box:{position:'relative',paddingBottom:'60px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em',marginBottom:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    w:{width:'100%'},
    to:{horizontal: 'right', vertical: 'top'},
    c:{color:'#fff'},
    variable:{color:'#009688'},
    link:{color:'#0000cc'}
};


var thisView=window.LAUNCHER.getView();//第一句必然是获取view
var curView=thisView;

var pushPage=thisView.prefetch('#push',3);
pushPage.setTitle(___.push);
var popPage=thisView.prefetch('#pop',3);
popPage.setTitle(___.pop);
var didsPage=thisView.prefetch('#didList',3);

thisView.setTitle(___.device_manage);
thisView.addEventListener('load',function(){
    ReactDOM.render(<AppDeviceManage/>,thisView);

    ReactDOM.render(<DeviceIn/>,pushPage);

    ReactDOM.render(<DeviceOut/>,popPage);

    ReactDOM.render(<DidList/>,didsPage);
});

// 测试用
// let testNum=10;
// W.native={
//     scanner:{
//         start:function(callback){
//             setTimeout(function(){
//                 callback(testNum.toString());
//                 // testNum++;
//             },100);
//         }
//     }
// }
// let isWxSdk=true;

//正式用
let isWxSdk=false;
if(W.native)isWxSdk=true;
else
    window.addEventListener('nativeSdkReady',()=>{isWxSdk=true;});


class AppDeviceManage extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            intent:'list',
            data:[],
        }
        this.deviceIn=this.deviceIn.bind(this);
        this.deviceOut=this.deviceOut.bind(this);
        this.toList=this.toList.bind(this);
    }

    componentDidMount(){
    }

    deviceIn(){
        // history.replaceState('home','home','home.html');
        // this.setState({intent:'in'});
        curView=pushPage;
        thisView.goTo('#push');
    }

    deviceOut(){
        // history.replaceState('home','home','home.html');
        // this.setState({intent:'out'});
        curView=popPage;
        thisView.goTo('#pop');
    }

    toList(){
        this.refs.list.getProduct();
        this.setState({intent:'list'});
    }

    render(){
        let isBrandSeller=(_user.customer.custTypeId==0||_user.customer.custTypeId==1);
        // let isBrandSeller=true;//测试用
        let rightIcon=isBrandSeller?
            (<IconMenu
                iconButtonElement={
                    <IconButton style={{border:'0px',padding:'0px',margin:'0px',width:'24px',height:'24px'}}>
                        <MoreVertIcon/>
                    </IconButton>
                }
                targetOrigin={styles.to}
                anchorOrigin={styles.to}
                >
                <MenuItem primaryText={___.push} onTouchTap={this.deviceIn}/>
                <MenuItem primaryText={___.pop} onTouchTap={this.deviceOut}/>
            </IconMenu>):(<MoreVertIcon onTouchTap={this.deviceOut}/>);
        let items=this.state.data.map((ele,i)=><ListItem key={i}  style={styles.MenuItem} children={<ItemDevice key={i} data={ele}/>}/>);
        return(
            <ThemeProvider>
                <div>
                    {/*<AppBar 
                        title={___.device_manage} 
                        style={{position:'fixed'}} 
                        iconElementRight={rightIcon}
                    />*/}
                    <div name='list' style={styles.main}>
                        <ProductLogList ref={'list'} isBrandSeller={isBrandSeller} thisView={thisView}/>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

class ItemDevice extends Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        let data=this.props.data;
        return(
            <div>
                <table>
                    <thead>
                        {data.type}
                    </thead>
                    <tbody style={{color:'#999999',fontSize:'0.8em'}}>
                        <tr>
                            <td style={{width:'33vw'}}>{___.inNet_num+data.inNet}</td>
                            <td style={{width:'33vw'}}>{___.register_num+data.register}</td>
                            <td style={{width:'33vw'}}>{___.onLine_num+data.onLine}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

class DeviceIn extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            brand:'',
            model:'',
            brandId:'',
            modelId:'',
            product_ids:[],
        }
        this.data={}
        this.brandChange=this.brandChange.bind(this);
        this.addId=this.addId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
    }
    componentDidMount() {
        popPage.addEventListener('show',e=>{
            history.replaceState('home','home','home.html');
        })
    }
    brandChange(value){
        this.setState({
            brand:value.brand,
            brandId:value.brandId,
            model:value.product,
            modelId:value.productId
        });
    }
    addId(){
        let _this=this;
        let ids=_this.state.product_ids;
        if(!this.state.modelId){
            W.alert('请先选择品牌型号');
            return;
        }
        if(isWxSdk){
            W.native.scanner.start(function(res){//扫码，did添加到当前用户
                res=reCode(res);
                if(ids.includes(res)){//队列中已有此编号
                    W.alert(___.device_repeat);
                    return;
                }
                Wapi.device.get(re=>{//检查设备是否存在
                    if(!re.data){//如果不存在，则完善设备信息（uid设为'0'），并将设备号存入state
                        let params={
                            did:res,
                            uid:'0',
                            
                            status: 0,
                            commType: 'GPRS',
                            commSign: '',
                            model: _this.state.model,
                            modelId: _this.state.modelId,
                            binded: false,
                        };
                        Wapi.device.add(function(res_device){
                            //添加设备信息完成,（此时设备uid均为'0')
                        },params);

                        ids[ids.length]=res;
                        _this.setState({product_ids:ids});
                    }else if(re.data && re.data.uid=='0'){//data存在且设备不属于其他用户，将设备号存入state
                        let ids=_this.state.product_ids;
                        ids[ids.length]=res;
                        _this.setState({product_ids:ids});
                    }else if(re.data && re.data.uid==_user.customer.objectId){//data存在且设备已属于当前用户，弹出警告，不存入state
                        W.alert(___.device_repeat_own);
                    }else if(re.data && re.data.uid!=_user.customer.objectId){//data存在且设备已属于其他用户，弹出警告，不存入state
                        W.alert(___.deivce_other_own);
                    }
                },{did:res});
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        this.setState({
            product_ids:[]
        });
        history.back();
    }
    submit(){
        let ids=this.state.product_ids;
        if(ids.length==0){
            history.back();
            return;
        }else{
            W.loading(true,___.ining);
            let that=this;
            Wapi.device.update(res_device=>{//把设备的uid改为当前用户id
                let pushLog={
                    uid:_user.customer.objectId,
                    did:ids,
                    type:1,
                    from:'0',
                    to:_user.customer.objectId,
                    fromName:'0',
                    toName:_user.customer.name,
                    brand:this.state.brand,
                    brandId:this.state.brandId,
                    model:this.state.model,
                    modelId:this.state.modelId,
                    inCount:ids.length,
                    outCount:0,
                    status:1,//状态为1，表示 已发货待签收，发货流程未完整之前暂定为1
                };
                Wapi.deviceLog.add(function(res){
                    pushLog.objectId=res.objectId;
                    W.emit(window,'device_log_add',pushLog);
                    W.loading();
                    that.cancel();
                },pushLog);
            },{
                _did:ids.join('|'),
                uid:_user.customer.objectId
            });
        }
    }

    render(){
        return(
            <ThemeProvider>
            <div style={styles.input_page}>
                {/*<h3>{___.device_in}</h3>*/}
                <div style={{width:'80%',marginLeft:'10%',textAlign:'left'}}>
                    <h4>{___.device_type}:</h4>
                    <BrandSelect onChange={this.brandChange}/>
                </div>
                <ScanGroup product_ids={this.state.product_ids} addId={this.addId} cancel={this.cancel} submit={this.submit} />
            </div>
            </ThemeProvider>
        )
    }
}

class DeviceOut extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            cust_id:0,
            cust_name:'',
            product_ids:[],
            brand:'',
            brandId:'',
            model:'',
            modelId:'',
            wxAppKey:null
        }
        this.custChange=this.custChange.bind(this);
        this.addId=this.addId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
    }
    componentDidMount() {
        popPage.addEventListener('show',e=>{
            history.replaceState('home','home','home.html');
        })
    }    
    custChange(cust){
        this.setState({
            cust_id:cust.objectId,
            cust_name:cust.name,
            wxAppKey:cust.wxAppKey
        });
    }
    addId(){
        let _this=this;
        let ids=_this.state.product_ids;
        function get(res){//扫码，did添加到所选用户
            res=reCode(res);
            if(ids.includes(res)){//队列中已有此编号
                W.alert(___.device_repeat);
                return;
            }
            ids=ids.concat(res);
            _this.setState({
                product_ids:ids,
            });
            W.native.scanner.start(get);
        }
        if(isWxSdk){
            W.native.scanner.start(get);
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        this.setState({
            brand:'',
            brandId:'',
            model:'',
            modelId:'',
            product_ids:[]
        });
        history.back();
    }
    submit(){
        let ids=this.state.product_ids;
        if(ids.length==0){
            history.back();
            return;
        }

        if(!this.state.cust_id){
            W.alert(___.customer_null);
            return;
        }
        let dids=ids.join('|');
        let _this=this;
        W.loading(true,___.outing);

        //检查设备id
        Wapi.deviceLog.list(function(log){//检查是否有已经被出库的设备
            if(log.data&&log.data.length){
                let logs=log.data;
                // let _ids=[];
                logs.forEach(l=>{
                    ids=ids.filter(id=>!l.did.includes(id));
                    // _ids=ids.filter(id=>l.did.includes(id));
                });
                _this.setState({product_ids:ids});
                W.loading();
                W.alert(___.device_repeat_out);
                return;
            }
            Wapi.device.list(function(devs){//检查是否都是当前用户的设备
                if(!devs.data||devs.data.length!=ids.length){//都不是你的设备
                    let devices=devs.data;
                    // let _ids=[];
                    // _ids=ids.filter(id=>!devices.find(d=>(d.did==id)));
                    ids=devices.map(d=>d.did);
                    _this.setState({product_ids:ids});
                    W.loading();
                    W.alert(___.deivce_not_own);
                    return;
                }
                let dev=devs.data[0];
                Wapi.product.get(pro=>{
                    if(!pro.data){
                        W.loading();
                        W.alert(___.model_error);
                        return;
                    }
                    let MODEL={
                        brand:pro.data.brand,
                        brandId:pro.data.brandId,
                        model:pro.data.name,
                        modelId:pro.data.objectId,
                    };
                    _this.save(ids,MODEL);
                },{
                    objectId:dev.modelId
                });
            },{
                did:dids,
                uid:_user.customer.objectId,
            },{limit:-1});
        },{
            did:dids,
            uid:_user.customer.objectId,
            type:0
        },{limit:-1});
    }

    save(ids,MODEL){//真正执行出库
        W.loading();
        let _this=this;
        let text=___.check_out_ok.replace('%d',ids.length.toString());
        let device={
            _did:ids.join('|'),
            uid:this.state.cust_id,
        }
        if(this.state.wxAppKey)device.serverId=device.uid
        W.alert(text,()=>{
            W.loading(true,___.outing);
            Wapi.device.update(function(res_device){//把设备的uid改为分配到的客户的id
                let popLog={//出库
                    uid:_user.customer.objectId,
                    did:ids,
                    type:0,
                    from:_user.customer.objectId,
                    fromName:_user.customer.name,
                    to:_this.state.cust_id,
                    toName:_this.state.cust_name,
                    inCount:0,
                    outCount:ids.length,
                    status:1,//状态为1，表示 已发货待签收，发货流程未完整之前暂定为1
                };
                let pushLog={//下级的入库
                    uid:_this.state.cust_id,
                    did:ids,
                    type:1,
                    from:_user.customer.objectId,
                    fromName:_user.customer.name,
                    to:_this.state.cust_id,
                    toName:_this.state.cust_name,
                    inCount:ids.length,
                    outCount:0,
                    status:1,//状态为1，表示 已发货待签收，发货流程未完整之前暂定为1
                };
                Object.assign(popLog,MODEL);
                Object.assign(pushLog,MODEL);
                Wapi.deviceLog.add(function(res){//给上一级添加出库信息
                    Wapi.deviceLog.add(function(res_log){//给下一级添加入库信息
                        popLog.objectId=res.objectId;
                        W.emit(window,'device_log_add',popLog);
                        W.loading();
                        W.alert(___.out_success,_this.cancel);
                    },pushLog);
                },popLog);
            },device);
        });
    }

    render(){
        return(
            <ThemeProvider>
            <div style={styles.input_page}>
                {/*<h3>{___.device_out}</h3>*/}
                <table style={styles.w}>
                    <tbody>
                        <tr>
                            <td style={{whiteSpace:'nowrap',paddingTop:'14px'}}>{___.cust}</td>
                            <td>
                                <UserSearch onChange={this.custChange} data={{parentId:_user.customer.objectId}}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ScanGroup product_ids={this.state.product_ids} addId={this.addId} cancel={this.cancel} submit={this.submit} />
            </div>
            </ThemeProvider>
        )
    }
}

var _dids=[];
class ScanGroup extends Component{
    constructor(props,context){
        super(props,context);
        this.toDidList = this.toDidList.bind(this);
    }
    toDidList(){
        // _dids=this.props.product_ids;
        // curView.goTo('#didList');
    }
    render(){
        let productItems=[];
        let product_ids=this.props.product_ids;
        let len=product_ids.length;
        for(let i=0;i<len;i++){
            productItems.push(
                <div key={i} style={styles.ids_box}>
                    {___.device_id} <span style={styles.product_id}>{product_ids[i]}</span>
                </div>
            )
        }
        return(
            <div style={styles.box}>
                <div>{___.num+'：'}<span onClick={this.toDidList} style={styles.variable}>{len}</span></div>
                {productItems}
                <div style={styles.a}>
                    <RaisedButton onClick={this.props.submit} label={___.ok} secondary={true} style={{marginRight:'10px'}}/>
                    <RaisedButton onClick={this.props.addId} label={___.scan_input} primary={true}/>
                </div>
            </div>
        )
    }
}


class DidList extends Component {
    constructor(props,context){
        super(props,context);
    }
    
    render() {
        let items=_dids.map((ele,i)=><p key={i}>{ele}</p>);
        return (
            <div>
                {items}
            </div>
        );
    }
}
