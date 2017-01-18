"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Card from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/base/autoList';

import {reCode} from '../_modules/tool';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view


thisView.addEventListener('load',function(){
    ReactDOM.render(
        <AppDeviceManage/>,thisView);
});

//测试用
// W.native={
//     scanner:{
//         start:function(callback){
//             setTimeout(function(){
//                 callback('code,56621886168');
//             },100);
//         }
//     }
// }
// let isWxSdk=true;

let isWxSdk=false;
if(W.native)isWxSdk=true;
else
    window.addEventListener('nativeSdkReady',()=>{isWxSdk=true;});

//测试用数据
// let _device={
//     model:'w13',
//     did:'123456',
//     activedIn:'2016-08-15',
//     carNum:'粤B23333',
//     bindDate:'2016-08-16',
//     status:0,
// }
// let _devices=[];
// for(let i=0;i<20;i++){
//     let device=Object.assign({},_device);
//     device.did+=i;
//     _devices[i]=device;
// }


const op={
    page:'createdAt',
    sorts:'-createdAt',
}
const styles = {
    ta:{textAlign:'center',margin:0},
    main:{width:'90%',paddingTop:'50px',marginLeft:'5%',marginRight:'5%',},
    show:{paddingTop:'50px',width:'750px'},
    hide:{display:'none'},
    scan_input:{color:'#00bbbb',borderBottom:'solid 1px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'20px',width:'150px',overflow:'hidden'},
};


class DumbList extends React.Component{
    shouldComponentUpdate(nextProps, nextState) {
        return !this.props.data;
    }

    render() {
        let item=this.props.data?this.props.data.map(ele=>{
            let isOnline=___.offline;
            let rcvTime='--';
            if(ele.activeGpsData&&ele.activeGpsData.rcvTime){
                let t=W.date(ele.activeGpsData.rcvTime);
                isOnline=((new Date()-t)/1000/60<10)?___.online:___.offline;
                rcvTime=W.dateToString(t);
            }
            let version=ele.params?ele.params.version:'--';
            return (<Card key={ele.did} style={{marginTop:'1em', padding:'0.5em 1em'}} >
                <table>
                    <tbody>
                        <tr>
                            <td style={styles.td_left}>{___.device_type}</td>
                            <td style={styles.td_right}>{ele.model}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.device_id}</td>
                            <td style={styles.td_right}>{ele.did}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.carNum}</td>
                            <td style={styles.td_right}>{ele.vehicleName}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.device_version}</td>
                            <td style={styles.td_right}>{version}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.rcv_time}</td>
                            <td style={styles.td_right}>{rcvTime}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.device_status}</td>
                            <td style={styles.td_right}>{isOnline}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>);
        }):(<h3 style={styles.ta}>{___.loading}</h3>);
        return (
            <div>
                {item}
            </div>
        );
    }
}
let Alist=AutoList(DumbList);

class DeviceList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:[],
            total:-1
        }
        this.page=1;
        this.loadNextPage = this.loadNextPage.bind(this);
    }
    
    componentDidMount() {//初始化数据
        Wapi.device.list(res=>this.setState({data:res.data,total:res.total}),{
            uid:_user.customer.objectId
        },Object.assign(op,{page_no:this.page}));
        window.addEventListener('device_add',e=>{
            this.setState({
                data:[e.params].concat(this.state.data),
                total:this.state.total+1
            })
        });
    }

    loadNextPage(){
        //加载下一页的方法
        let arr=this.state.data;
        let last=arr[arr.length-1];
        this.page++;
        Wapi.device.list(res=>this.setState({data:arr.concat(res.data)}),{
            uid:_user.customer.objectId
        },Object.assign(op,{page_no:this.page}));
    }
    
    render() {
        return (
            <Alist 
                max={this.state.total} 
                limit={20} 
                data={this.state.data} 
                next={this.loadNextPage} 
            />
        );
    }
}

class AppDeviceManage extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            intent:'list',
            devices:[],
            total:0,
        }
        this.page_no=1;
        this.getDevices=this.getDevices.bind(this);
        this.deviceIn=this.deviceIn.bind(this);
        this.toList=this.toList.bind(this);
    }

    componentDidMount(){
        this.getDevices();
    }
    getDevices(){
        Wapi.device.list(res=>{
            if(res.data.length>0)
                this.setState({
                    devices:res.data,
                    total:res.total,
                });
        },{
            uid:_user.customer.objectId
        },{
            limit:20
        });

        //测试用数据
        // this.setState({devices:_devices});
    }

    deviceIn(){
        history.replaceState('home','home','home.html');
        this.setState({intent:'in'});
    }
    toList(){
        this.setState({intent:'list'});
        this.forceUpdate();
    }

    render(){
        return(
            <ThemeProvider>
                <div style={{overflow:'auto'}}>
                    <AppBar 
                        title={___.device_manage} 
                        style={{position:'fixed'}}
                    />
                    <div style={styles.main}>
                        <DeviceList/>
                    </div>
                    <SonPage open={this.state.intent=='in'} back={this.toList}>
                        <DeviceIn toList={this.toList}/>
                    </SonPage>
                </div>
            </ThemeProvider>
        );
    }
}

class DeviceIn extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            brands:[],
            types:[],
            brand:'',
            type:'',
            brandId:'',
            typeId:'',
            product_ids:[],
        }
        this.data={}
        this.brandChange=this.brandChange.bind(this);
        this.typeChange=this.typeChange.bind(this);
        this.addId=this.addId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
    }
    componentDidMount(){
        this.setState({
            brands:[],
            types:[],
            brand:' ',
            type:' ',
        });
    }
    brandChange(value){
        this.setState({brand:value.brand,brandId:value.brandId,type:value.product,typeId:value.productId});
    }
    typeChange(e,value){
        this.setState({type:value});
    }
    addId(){
        let _this=this;
        if(isWxSdk){
            W.native.scanner.start(function(res){//扫码，did添加到当前用户
                let code=reCode(res);
                let arr=_this.state.product_ids;
                arr[arr.length]=code;
                _this.setState({product_ids:arr});

                let uid_pre;
                Wapi.device.get(function(res_pre){//更新之前获取之前获取上一个用户的uid
                    uid_pre=res_pre.data.uid;
                    Wapi.customer.get(function(res_preUser){//获取上一个用户的信息
                        if(res_preUser.data.custTypeId==4){//判断上一个用户是否为普通用户。如果是，则不能分配到当前用户
                            W.alert(___.error[6]);
                            return;
                        }
                        Wapi.product.get(function(product){
                            let MODEL={
                                brand:product.data.brand,
                                brandId:product.data.brandId,
                                model:product.data.name,
                                modelId:product.data.objectId.toString()
                            }
                        
                            Wapi.device.update(function(res_device){//更新设备的uid
                                res_pre.data.uid=_user.customer.objectId;
                                //添加出入库记录
                                let log={
                                    did:[code],
                                    from:res_preUser.data.objectId,
                                    fromName:res_preUser.data.name,
                                    to:_user.customer.objectId,
                                    toName:_user.customer.name,
                                    status:2,//状态为1，表示 已发货待签收，发货流程未完整之前暂定为1
                                }
                                let popLog={//出库
                                    uid:log.from,
                                    type:0,
                                    inCount:0,
                                    outCount:1,
                                };
                                let pushLog={//下级的入库
                                    uid:log.to,
                                    type:1,
                                    inCount:1,
                                    outCount:0,
                                };
                                Object.assign(popLog,log,MODEL);
                                Object.assign(pushLog,log,MODEL);
                                Wapi.deviceLog.add(function(res){//给上一级添加出库信息
                                    W.alert(___.import_success);
                                    W.emit(window,'device_add',res_pre.data);
                                },popLog);
                                Wapi.deviceLog.add(function(res_log){//给下一级添加入库信息
                                    //个人的入库不怎么重要
                                },pushLog);
                            },{
                                _did:code,
                                uid:_user.customer.objectId,
                            });
                        },{objectId:'code'})
                    },{
                        objectId:uid_pre
                    });

                },{
                    did:code
                });
                
                
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        this.setState({
            brand:' ',
            type:' ',
            product_ids:[]
        });
        this.props.toList();
        
    }
    submit(){
        this.cancel();
    }

    render(){
        let brands=this.state.brands.map(ele=><MenuItem value={ele.id} key={ele.id} primaryText={ele.brand_name}/>);
        let types=this.state.types.map(ele=><MenuItem value={ele.id} key={ele.id} primaryText={ele.type}/>);
        return(
            <div style={styles.input_page}>
                <h3>{___.device_in}</h3>
                <ScanGroup product_ids={this.state.product_ids} addId={this.addId} cancel={this.cancel} submit={this.submit} />
            </div>
        )
    }
}

class ScanGroup extends React.Component{
    constructor(props,context){
        super(props,context);
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
            <div>
                {productItems}
                <div style={styles.ids_box}>
                    <a onClick={this.props.addId} style={styles.scan_input}>{___.scan_input}</a>
                </div>
                <RaisedButton style={{marginTop:'1em'}} onClick={this.props.submit} label={___.ok} primary={true}/>
            </div>
        )
    }
}

