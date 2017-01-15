//我的营销>营销资料
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../../_theme/default';
import AppBar from '../../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import {reCode,getOpenIdKey} from '../../_modules/tool';
import Input from '../../_component/base/input';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.act_data);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('bind_count.js',2);
    thisView.prefetch('scan_count.js',2);
});

const styles = {
    main:{
        // paddingTop:'50px',
        paddingBottom:'20px'
    },
    card:{
        margin:'10px',
        padding:'0px 10px 10px',
        borderBottom:'1px solid #cccccc'
    },
    count:{
        marginRight:'1em'
    },
    line:{
        paddingTop:'0.5em'
    },
    variable:{
        color:'#009688'
    },
    link:{
        color:'#0000cc'
    },
    hide:{
        display:'none',
    },
    content:{
        margin:'15px'
    },
    spans:{
        fontSize:'1em',
        marginRight:'1em',
    },
    search_head:{
        width:'100%',
        display:'block',
        borderBottom:'1px solid #cccccc'
    },
    add_icon:{
        float:'right',
        marginRight:'15px'
    },
    search_box:{
        marginLeft:'15px',
        marginTop:'15px',
        width:'80%',
        display:'block'
    }
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

// 测试用
// W.native={
//     scanner:{
//         start:function(callback){
//             setTimeout(function(){
//                 callback('http://autogps.cn/?s=15');
//             },100);
//         }
//     }
// }
// let isWxSdk=true;

//正式用
let isWxSdk=false;
if(W.native){
    isWxSdk=true;
}else{
    window.addEventListener('nativeSdkReady',()=>{isWxSdk=true;});
}

let qrLinks=[
    {
        name:'第一批二维码',
        act:'806314613238009900',
        sellerId:'001',
        url:'http://www.baidu.com',
        bind:10,
        scan:9,
    },{
        name:'第二批二维码',
        act:'805974631000444900',
        sellerId:'002',
        url:'http://www.qq.com',
        bind:10,
        scan:9,
    },{
        name:'第三批二维码',
        act:'803863722111144000',
        sellerId:'003',
        url:'http://www.sina.com',
        bind:10,
        scan:9,
    },
]
class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            keyword:''
        }
        this.activity={};
        this.originalData=[];
        this.data=[];
        this.national=false;
        this.gotData = false;
        this.search = this.search.bind(this);
        this.getData = this.getData.bind(this);
        this.bindCount = this.bindCount.bind(this);
        this.scanToBind = this.scanToBind.bind(this);
    }
    search(e,value){
        console.log(this.data);
        // this.activities=this.originalActivities.filter(ele=>ele.name.includes(value));
        // this.setState({keyword:value});
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            if(e.params){
                this.activity=e.params;
                this.gotData=true;
                console.log(e.params);
                Wapi.customer.get(res=>{
                    if(res.data.custTypeId==1){
                        this.national=true;
                        this.forceUpdate();
                    }
                },{objectId:e.params.uid});
            }
            this.getData();            
        });
    }
    getData(){
        Wapi.qrLink.aggr(res=>{
            this.originalData=res.data;
            this.data=res.data;
            this.forceUpdate();
        },{
            "group":{
                "_id":{
                    "batchId":"$batchId",
                    "batchName":"$batchName",
                    "type":"$type",
                },
                "bindNum":{
                    "$sum":"$status"
                }
            },
            "sorts":"batchId",
            "sellerId":_user.objectId,
            "act":this.activity.objectId,
        });
    }
    bindCount(data){
        thisView.goTo('bind_count.js',data); 
    }
    scanCount(data){
        // thisView.goTo('scan_count.js',data.act);
    }
    scanToBind(){
        history.replaceState('home.html','home.html','../home.html');
        if(isWxSdk){
            W.native.scanner.start(link=>{//扫码
                console.log(link);

                link=reCode(link);
                let reg=/http:\/\/autogps\.cn\/\?s=.*/;
                if(!reg.test(link)){//判断二维码是否是卫网平台创建的
                    W.alert(___.qrcode_unknown);
                    return;
                }
                let code=link.split('=')[1];
                Wapi.qrDistribution.get(re=>{//判断该二维码是否和当前用户属于同一经销商
                    let canBind=false;
                    let uid=re.data.uid;
                    let batchId=re.data.objectId;
                    let batchName=re.data.name;

                    if(_user.employee && _user.employee.companyId==uid){//如果当前用户为(营销人员|员工),则判断其所属公司id是否和二维码uid相同
                        canBind=true;
                    }
                    if(_user.customer.custTypeId==8 && _user.customer.parentId.includes(uid)){//如果当前用户为经销商，则判断其上一级id是否和二维码uid相同
                        canBind=true;
                    }
                    if(!canBind){
                        W.alert(___.not_belong);
                        return;
                    }

                    Wapi.qrLink.get(res=>{//判断该二维码是否已被创建或绑定
                        if(res.data && res.data.status){//已被绑定
                            W.alert(___.qrcode_bound);
                            return;
                        }

                        let created=false;
                        if(res.data!=null){//未被创建，则需要创建
                            created=true;
                        }

                        let activity=this.activity;                        
                        activity._seller=_user.employee?_user.employee.name:_user.customer.contact;
                        activity._sellerId=_user.employee?_user.employee.objectId:_user.customer.objectId;
                        activity._sellerTel=_user.employee?_user.employee.tel:_user.mobile;

                        let strOpenId='';
                        let idKey=getOpenIdKey();
                        if(_user.authData && _user.authData[idKey]){
                            strOpenId='&seller_open_id='+_user.authData[idKey];
                        }
                        let data={
                            id:code,
                            sellerId:_user.objectId,
                            act:this.activity.objectId,
                            type:1,
                            batchId:batchId,
                            batchName:batchName,
                            status:1,
                            url:WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(activity.url)
                                +'&title='+encodeURIComponent(activity.name)
                                +'&uid='+activity.uid
                                +'&seller_name='+encodeURIComponent(activity._seller)
                                +'&sellerId='+activity._sellerId
                                +'&mobile='+activity._sellerTel
                                +'&agent_tel='+_user.customer.tel
                                +'&wxAppKey='+activity.wxAppKey
                                +'&activityId='+activity.objectId
                                +strOpenId
                                +'&timerstamp='+Number(new Date()),
                        }

                        if(created){
                            data._objectId=res.data.objectId;
                            Wapi.qrLink.update(r=>{//更新二维码
                                console.log(r);
                                W.alert(___.bind_success);

                                data.objectId=data._objectId;
                                delete data._objectId;
                                this.getData();
                            },data);
                        }else{
                            Wapi.qrLink.add(r=>{
                                console.log(r);
                                W.alert(___.bind_success);

                                this.getData();
                            },data);
                        }

                    },{
                        id:code,
                    },{
                        err:true,
                    });

                },{
                    max:'>='+code,
                    min:'<='+code
                });
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    render() {
        let items=this.data.map((ele,i)=>
            <div key={i} style={styles.card}>
                {/*<div style={styles.line}>{ele._id.batchName}</div>*/}
                <div style={styles.line}>
                    <span style={styles.spans}>
                        {___.bind_num+' '}
                        <span onClick={()=>this.bindCount(ele)} style={styles.link}>{ele.bindNum||0}</span>
                    </span>
                    <span style={styles.spans}>
                        {___.scan_count+' '}
                        <span onClick={()=>this.scanCount(ele)} style={styles.variable}>{ele.scan||0}</span>
                    </span>
                </div>
                <div style={styles.line}>
                    <span style={styles.spans}>
                        {(this.national ? ___.national_marketing : ___.regional_marketing)+' '}
                        <span style={styles.variable}>{(this.activity.brand||'')+this.activity.product}</span>
                    </span>
                    <span style={styles.spans}>
                        {___.device_price+' '}
                        <span style={styles.variable}>{(this.activity.price||0).toFixed(2)}</span>
                    </span>
                </div>
            </div>
        );
        let noBinded=<div style={(this.data.length==0&&this.gotData) ? styles.content : styles.hide}>{___.no_bind}</div>
        return (
            <ThemeProvider>
            <div style={styles.main}>
                {/*<AppBar 
                    title={___.act_data} 
                    style={{position:'fixed',top:'0px'}}
                    iconElementRight={<IconButton onClick={this.scanToBind}><ContentAdd/></IconButton>}
                />*/}
                <div style={styles.search_head}>
                    <ContentAdd style={styles.add_icon} onClick={this.scanToBind}/>
                    <div style={styles.search_box}>
                        <Input 
                            style={{height:'36px'}}
                            inputStyle={{height:'30px'}}
                            onChange={this.search} 
                            hintText={___.search}
                            value={this.state.keyword}
                        />
                    </div>
                </div>
                <div>
                    {items}
                    {noBinded}
                </div>
            </div>
            </ThemeProvider>
        );
    }
}
export default App;
