//我的营销,20161227改名为'推荐有礼'
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
// import AppBar from '../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';

import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/base/autoList';
import EditActivity from '../_component/editActivity';
import Iframe from '../_component/base/iframe';
import Input from '../_component/base/input';
import {getOpenIdKey,changeToLetter} from '../_modules/tool';


const styles = {
    main:{paddingTop:'0px',paddingBottom:'0px'},
    appbody:{padding:'10px'},
    // card:{marginTop:'5px',padding:'10px',borderBottom:'1px solid #cccccc'},
    card:{marginTop:'15px',width:'100%',backgroundColor:'#ffffff'},//170118
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    line:{marginTop:'0.5em'},
    top_btn_right:{width:'100%',display:'block',textAlign:'right'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    count:{marginRight:'1em',float:'left'},
    variable:{color:'#009688'},
    link:{color:'#0000cc'},
    table:{paddingTop:'12px',paddingBottom:'10px',paddingLeft:'3px',marginRight:'120px'},
    spans:{marginBottom:'10px',fontSize:'0.8em',paddingLeft:'5px',marginBottom:'15px',display:'block',width:'100%',height:'15px'},
    share_page:{width:'100%',height:window.innerHeight+'px',display:'block',backgroundColor:'#ffffff',position:'fixed',top:'0px',left:'0px'},
    share_content:{width:'90%',marginLeft:'5%',marginTop:'20px'},
    hide:{display:'none'},
    detail:{float:'right',paddingTop:'12px',paddingRight:'12px',color:'#0000cc'},
    search_head:{width:'100%',display:'block'},
    add_icon:{float:'right',marginRight:'15px'},
    search_box:{marginLeft:'15px',marginTop:'15px',width:'80%',display:'block'},
    table_left:{width:window.innerWidth*0.62+'px',height:'125px',padding:'0px',backgroundColor:'#ffffff'},
    table_right:{width:window.innerWidth*0.38+'px'}
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}


var thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.recommend);
thisView.style.backgroundColor='#eeeeee';
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('booking_list.js',2);
    thisView.prefetch('./myMarketing/marketing_data.js',2);
});

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isEdit:false,
            isShare:false,
            curActivity:null,
            isCarownerSeller:false,
            noEdit:true,
            activityName:'',
            reward:0,

            keyword:''
        }
        this.limit=20;
        this.page_no=1;
        this.total=-1;
        this.originalActivities=[];
        this.activities=[];
        this.booking=[];
        this.strType='';

        this.search = this.search.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.add = this.add.bind(this);
        this.addSubmit = this.addSubmit.bind(this);
        this.share = this.share.bind(this);
        this.shareBack = this.shareBack.bind(this);
        this.edit = this.edit.bind(this);
        this.editBack = this.editBack.bind(this);
        this.editSubmit = this.editSubmit.bind(this);
    }
    search(e,value){
        this.activities=this.originalActivities.filter(ele=>ele.name.includes(value));
        this.setState({keyword:value});
    }
    getChildContext(){
        return {
            edit:this.edit,
            share:this.share
        };
    }
    componentDidMount() {
        let par={
            "group":{
                "_id":{"activityId":"$activityId"},
                "status0":{"$sum":"$status0"},
                "status1":{"$sum":"$status1"},
                "status2":{"$sum":"$status2"},
                "status3":{"$sum":"$status3"}
            },
            "sorts":"activityId",
            sellerId:_user.employee?_user.employee.objectId:_user.customer.objectId,
        }
        Wapi.booking.aggr(resAggr=>{
            this.booking=resAggr.data;
            var _custIds = [];
            if(_user.customer &&_user.customer.parentId){
                _custIds = _user.customer.parentId;
            }
            if(_user.customer && _user.customer.objectId){
                _custIds.push(_user.customer.objectId);
            }
            Wapi.customer.list(res=>{
                console.log(res,'res2')
                this._parents=res.data||[];
                this.getData();
            },{
                objectId:_custIds.join('|')
            });
        },par);
        // this.getData();
    }
    nextPage(){
        // this.page_no++;
        // this.getData();
    }
    getData(){
        if(_user.employee && _user.employee.type==1){
            //兼职营销账号，显示所属公司的集团营销活动。
            let par0={
                uid:_user.employee.companyId,
                sellerTypeId:_user.employee.departId,
                status:1,
                type:1,
            }
            Wapi.activity.list(res=>{
                this.total=res.total;
                let activities=res.data;
                
                activities.forEach(ele=>{
                    let booking=this.booking.find(item=>item._id.activityId==ele.objectId);
                    if(booking){
                        ele.status0=booking.status0;
                        ele.status1=booking.status1;
                        ele.status2=booking.status2;
                        ele.status3=booking.status3;
                    }else{
                        ele.status0=0;
                        ele.status1=0;
                        ele.status2=0;
                        ele.status3=0;
                    }
                });
                this.originalActivities=this.originalActivities.concat(activities);
                this.activities=this.activities.concat(activities);
                this.forceUpdate();
            },par0,{
                sorts:'-createdAt',
                limit:-1,
            });

        }else if(_user.customer.custTypeId==8||_user.customer.custTypeId==5){//经销商和代理商账号，显示上一级创建的渠道营销活动。

            let parents=_user.customer.parentId.join('|');
            let par1={
                uid:_user.customer.objectId + '|' + parents,
                status:1,
                type:3
            }
            Wapi.activity.list(res=>{//type=3 渠道营销
                this.total=res.total;
                let activities=res.data;
                
                activities.forEach(ele=>{
                    let booking=this.booking.find(item=>item._id.activityId==ele.objectId);
                    if(booking){
                        ele.status0=booking.status0;
                        ele.status1=booking.status1;
                        ele.status2=booking.status2;
                        ele.status3=booking.status3;
                    }else{
                        ele.status0=0;
                        ele.status1=0;
                        ele.status2=0;
                        ele.status3=0;
                    }
                    // if(_user.customer.wxAppKey){
                    //     ele.wxAppKey=_user.customer.wxAppKey;
                    //     ele.uid=_user.customer.objectId;
                    // }
                });
                this.originalActivities=this.originalActivities.concat(activities);
                this.activities=this.activities.concat(activities);
                this.forceUpdate();
            },par1,{
                sorts:'-createdAt',
                limit:-1,
            });

        }
        // else if(_user.customer.custTypeId==5){//如果是代理商账号，显示type=2，员工营销；
            
        //     let par2={
        //         uid:_user.customer.objectId,
        //         status:1,
        //         type:2,
        //         // sellerTypeId:_user.customer.objectId,
        //     }
        //     Wapi.activity.list(res=>{
        //         this.total=res.total;
        //         let activities=res.data;
                
        //         activities.forEach(ele=>{
        //             let booking=this.booking.find(item=>item._id.activityId==ele.objectId);
        //             if(booking){
        //                 ele.status0=booking.status0;
        //                 ele.status1=booking.status1;
        //                 ele.status2=booking.status2;
        //                 ele.status3=booking.status3;
        //             }else{
        //                 ele.status0=0;
        //                 ele.status1=0;
        //                 ele.status2=0;
        //                 ele.status3=0;
        //             }
        //         });
        //         this.originalActivities=this.originalActivities.concat(activities);
        //         this.activities=this.activities.concat(activities);
        //         this.forceUpdate();
        //     },par2,{
        //         sorts:'-createdAt',
        //         limit:-1,
        //     });

        // }
        else if(_user.customer.custTypeId==7){
            //车主账号，显示上两级创建的车主营销活动。
            let _this=this;
            let parents=_user.customer.parentId;
            let i=parents.length;
            parents.forEach(ele=>{//获取当前用户的所有上级id，并查找所有的上上级id
                Wapi.customer.get(re=>{
                    if(re.data){
                        parents=re.data.parentId && parents.concat(re.data.parentId);
                    }
                    i--;
                    if(i==0){//当查找玩所有上上级的时候 获取所有parents的活动
                        getIt();
                    }
                },{objectId:ele});
            });
            function getIt(){
                let strParents=parents.join('|');
                let par3={
                    uid:_user.customer.objectId + '|' + strParents,
                    status:1,
                    type:0  //type=0 车主营销的活动
                }
                Wapi.activity.list(res=>{
                    _this.total=res.total;
                    let activities=res.data;
                    
                    activities.forEach(ele=>{
                        let booking=_this.booking.find(item=>item._id.activityId==ele.objectId);
                        if(booking){
                            ele.status0=booking.status0;
                            ele.status1=booking.status1;
                            ele.status2=booking.status2;
                            ele.status3=booking.status3;
                        }else{
                            ele.status0=0;
                            ele.status1=0;
                            ele.status2=0;
                            ele.status3=0;
                        }
                        // if(_user.customer.wxAppKey){
                        //     ele.wxAppKey=_user.customer.wxAppKey;
                        //     ele.uid=_user.customer.objectId;
                        // }
                    });
                    _this.originalActivities=_this.originalActivities.concat(activities);
                    _this.activities=_this.activities.concat(activities);
                    _this.forceUpdate();
                },par3,{
                    sorts:'-createdAt',
                    limit:-1,
                });
            }
        }
    }
    add(){
        this.setState({
            isEdit:true,
            curActivity:null,
            activityName:'',
        });
    }
    addSubmit(activity){
        this.activities.unshift(activity);
        history.back();
    }
    share(activity){
        this._share_time=new Date()*1;
        this.setState({
            isShare:true,
            reward:activity.reward||0
        });
    }
    shareBack(){
        let now=new Date()*1;
        if(now-this._share_time<3000)return;//3秒后才可以关闭
        this.setState({isShare:false});
    }
    edit(activity){
        let isCarownerSeller=false;
        if(activity.type==0){
            isCarownerSeller=true;
        }
        this.setState({
            isEdit:true,
            curActivity:activity,
            activityName:activity.name,
            isCarownerSeller:isCarownerSeller,
        });
    }
    editBack(){
        this.setState({isEdit:false});
    }
    editSubmit(activity){
        for(let i=this.activities.length-1;i>=0;i--){
            if(this.activities[i].objectId==activity.objectId){
                if(activity.status==0){
                    this.activities.splice(i,1);
                }else{
                    this.activities[i]=activity;
                }
                break;
            }
        }
        this.forceUpdate();
        history.back();
    }
    render() {
        return (
            <ThemeProvider>
                <div>
                    {/*<AppBar 
                        title={___.recommend}
                        style={this.state.isShare ? styles.hide : {position:'fixed'}}
                    />*/}
                    {/*<div style={styles.search_head}>
                        <ContentAdd style={styles.add_icon} onClick={this.add}/>
                        <div style={styles.search_box}>
                            <Input 
                                style={{height:'36px'}}
                                inputStyle={{height:'30px'}}
                                onChange={this.search} 
                                hintText={___.search}
                                value={this.state.keyword}
                            />
                        </div>
                    </div>*/}
                    <div style={{width:'100%',height:'210px',display:'block',backgroundColor:'#ffffff'}}>
                        <img src='../../img/my_marketing_head.png' style={{width:'100%',height:'100%'}}/>
                    </div>
                    <div name='list' style={styles.main}>
                        {/*items*/}
                        <Alist 
                            max={this.total} 
                            limit={this.limit} 
                            data={this.activities} 
                            next={this.nextPage} 
                        />
                        <div style={this.activities.length == 0?{fontSize:'14px',marginTop:'30px',textAlign:'center'}:styles.hide}>
                            暂无活动
                        </div>
                    </div>
                    
                    <SonPage title={___.seller_activity} open={this.state.isEdit} back={this.editBack}>
                        <EditActivity 
                            isCarownerSeller={this.state.isCarownerSeller}
                            data={this.state.curActivity} 
                            noEdit={this.state.noEdit}
                            editSubmit={this.editSubmit} 
                            addSubmit={this.addSubmit}
                        />
                    </SonPage>
                    
                    {/*<SonPage title={___.act_share} open={this.state.isShare} back={this.shareBack}>
                        <SharePage/>
                    </SonPage>*/}

                    <div style={this.state.isShare ? styles.share_page : styles.hide} onClick={this.shareBack}>
                        <SharePage reward={this.state.reward}/>
                    </div>
                    
                </div>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    edit:React.PropTypes.func,
    share: React.PropTypes.func
}
export default App;

let strStatus=[___.terminated,___.ongoing];
let strBoolean=[___.no,___.yes];
let activityType=[___.carowner_seller,___.group_marketing,___.employee_marketing,___.subordinate_marketing];

class DList extends Component{
    constructor(props,context){
        super(props,context);
        this.activityUrl='';
        this.state={
            iframe:false
        };
        this.toActivityPage = this.toActivityPage.bind(this);
        this.toCountPage = this.toCountPage.bind(this);
        this.activityData = this.activityData.bind(this);
        this.toggleIframe = this.toggleIframe.bind(this);
    }
    toActivityPage(data){
        data._seller=_user.employee?_user.employee.name:_user.customer.contact;
        data._sellerId=_user.employee?_user.employee.objectId:_user.customer.objectId;
        data._sellerTel=_user.employee?_user.employee.tel:_user.mobile;
        let strOpenId='';
        let idKey=getOpenIdKey();
        if(_user.authData && _user.authData[idKey]){
            strOpenId='&seller_open_id='+_user.authData[idKey];
        }

        
        Wapi.qrLink.get(res=>{//获取与[当前活动和seller]对应的短码，如没有则新建
            let linkUrl='';
            if(res.data){
                linkUrl='http://t.autogps.cn/?s='+res.data.id;
                history.replaceState('home.html','home.html','home.html');
                window.location=linkUrl;
                // console.log(linkUrl);
            }else{
                Wapi.qrLink.add(re=>{
                    let _id=changeToLetter(re.autoId);
                    linkUrl='http://t.autogps.cn/?s='+_id;
                    Wapi.qrLink.update(json=>{
                        history.replaceState('home.html','home.html','home.html');
                        window.location=linkUrl;
                        // console.log(linkUrl);
                    },{
                        _objectId:re.objectId,
                        id:_id
                    })
                },{
                    i:1,
                    act:String(data.objectId),
                    sellerId:String(data._sellerId),
                    uid:String(data.uid),
                    type:3,
                    url:WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(data.url)
                        +'&uid='+data.uid
                        +'&sellerId='+data._sellerId
                        +'&activityId='+data.objectId
                        +strOpenId
                        +'&timerstamp='+Number(new Date()),
                });
            }
        },{
            act:data.objectId,
            sellerId:data._sellerId,
            uid:data.uid,
            type:3
        });

        // history.replaceState('home.html','home.html','home.html');
        // window.location='http://'+WiStorm.config.domain.wx+'/autogps/action.html?intent=logout&action='+encodeURIComponent(data.url)
        //     +'&title='+encodeURIComponent(data.name)
        //     +'&wxAppKey='+data.wxAppKey
        //     +'&activityId='+data.objectId
        //     +'&seller_name='+encodeURIComponent(data._seller)
        //     +'&sellerId='+data._sellerId
        //     +'&mobile='+data._sellerTel
        //     +'&uid='+_user.customer.objectId
        //     +'&agent_tel='+_user.customer.tel
        //     +'&seller_open_id='+_user.authData.openId
        //     +'&timerstamp='+Number(new Date());
            
    }
    toCountPage(page,data){
        let par={
            activityId:data.objectId,
            sellerId:_user.employee?_user.employee.objectId:_user.customer.objectId,
            status:1
        }
        if(page=='booking'){
            par.status=0
        }
        thisView.goTo('booking_list.js',par);
    }
    share(data){
        if(!data.wxAppKey){
            W.alert(___.wx_server_null);
            return;
        }
        let that=this;
        function setShare(){
            data._seller=_user.employee?_user.employee.name:_user.customer.contact;
            data._sellerId=_user.employee?_user.employee.objectId:_user.customer.objectId;
            data._sellerTel=_user.employee?_user.employee.tel:_user.mobile;
            
            let strOpenId='';
            let idKey=getOpenIdKey();
            if(_user.authData && _user.authData[idKey]){
                strOpenId='&seller_open_id='+_user.authData[idKey];
            }

            Wapi.qrLink.get(res=>{//获取与当前活动和seller对应的短码，如没有则新建
                let linkUrl='';
                if(res.data){
                    linkUrl='http://t.autogps.cn/?s='+res.data.id;
                    setWxShare(linkUrl);
                }else{
                    Wapi.qrLink.add(re=>{
                        let _id=changeToLetter(re.autoId);
                        linkUrl='http://t.autogps.cn/?s='+_id;
                        Wapi.qrLink.update(json=>{
                            setWxShare(linkUrl);
                        },{
                            _objectId:re.objectId,
                            id:_id
                        });
                    },{
                        i:1,
                        act:String(data.objectId),
                        sellerId:String(data._sellerId),
                        uid:String(data.uid),
                        type:3,
                        url:'http://'+WiStorm.config.domain.wx+'/autogps/action.html?intent=logout&action='+encodeURIComponent(data.url)
                            +'&uid='+data.uid
                            +'&sellerId='+data._sellerId
                            +'&activityId='+data.objectId
                            +strOpenId
                            +'&timerstamp='+Number(new Date()),
                    });
                }
            },{
                act:data.objectId,
                sellerId:data._sellerId,
                uid:data.uid,
                type:3
            });
            
            function setWxShare(url){
                var op={
                    title: data.name, // 分享标题
                    desc: data.booking_offersDesc, // 分享描述
                    link: url,
                    imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
                    success: function(){},
                    cancel: function(){}
                }
                
                history.replaceState('home.html','home.html','home.html');
                wx.onMenuShareTimeline(op);
                wx.onMenuShareAppMessage(op);
                setShare=null;
                that.context.share(data);
            }


            // var op={
            //     title: data.name, // 分享标题
            //     desc: data.booking_offersDesc, // 分享描述
            //     link:'http://'+WiStorm.config.domain.wx+'/autogps/action.html?intent=logout&action='+encodeURIComponent(data.url)
            //         +'&title='+encodeURIComponent(data.name)
            //         +'&uid='+data.uid
            //         +'&seller_name='+encodeURIComponent(data._seller)
            //         +'&sellerId='+data._sellerId
            //         +'&mobile='+data._sellerTel
            //         +'&agent_tel='+_user.customer.tel
            //         +'&wxAppKey='+data.wxAppKey
            //         +'&activityId='+data.objectId
            //         +strOpenId
            //         +'&timerstamp='+Number(new Date()),
            //     imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
            //     success: function(){},
            //     cancel: function(){}
            // }
            // wx.onMenuShareTimeline(op);
            // wx.onMenuShareAppMessage(op);
            // setShare=null;
            // that.context.share(data);
        }
        if(W.native){
            setShare();
        }
        else{
            W.toast(___.ready_activity_url);
            window.addEventListener('nativeSdkReady',setShare);
        }
    }
    activityData(data){
        thisView.goTo('./myMarketing/marketing_data.js',data);
    }
    toggleIframe(){
        this.setState({iframe:!this.state.iframe});
    }
    render() {
        let iframe=this.state.iframe?<Iframe 
            src={this.activityUrl} 
            name='act_url' 
            close={this.toggleIframe}
        />:null;
        let data=this.props.data;
        let items=data.map((ele,i)=>
            <div key={i} style={styles.card}>
                <table style={{borderCollapse: 'collapse'}}>
                <tbody>
                    <tr>
                        <td style={styles.table_left} onClick={()=>this.toActivityPage(ele)}>
                            {ele.imgUrl?
                            <img src={ele.imgUrl} style={{width:window.innerWidth*0.62,height:'125px',verticalAlign: 'middle'}} alt={ele.name}/>
                            :<div style={{width:window.innerWidth*0.62,textAlign:'center'}}>{ele.name}</div>}
                        </td>
                        <td style={styles.table_right}>
                            <div style={{fontSize: '12px',marginBottom: '3px', textAlign:'center'}} >
                                <div>推荐朋友预订安装</div>
                                <div>
                                    <span>奖励 </span>
                                    <span style={{color:'#ff9900'}}>{ele.reward}</span>
                                    <span> 元红包</span>
                                </div>
                                <div style={{fontSize:'8px',marginTop:'5px'}}>
                                    {'已有'+ele.status0+'位好友预订'}
                                </div>
                            </div>
                            <div style={{textAlign:'center'}}>
                                <img 
                                    src='../../img/share.png' 
                                    style={{width:'30px',height:'30px'}} 
                                    onClick={()=>this.share(ele)}
                                />
                                <div style={{fontSize:'8px'}}>分享活动</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>);
        return(
            <div>
                {items}
                {iframe}
                <div style={data.length?{marginTop:'15px',width:'100%',textAlign:'center',fontSize:'12px'}:styles.hide}>
                    <p>
                        点击
                        <img src='../../img/share.png' style={{width:'20px',height:'20px'}} />
                        按提示将活动发送给朋友或分享到朋友圈，
                    </p>
                    <p>好友打开链接即可了解活动详情并咨询预订！</p>
                </div>
            </div>
        )
    }
}
DList.contextTypes={
    edit: React.PropTypes.func,
    share: React.PropTypes.func
};
let Alist=AutoList(DList);

class SharePage extends Component {
    render() {
        return (
            <div style={{marginTop:(window.innerHeight-240)/2+'px'}}>
                <img src='../../img/shareTo.jpg' style={{width:'100%',display:'block'}}/>
                <br/>
                <div style={{textAlign:'center',display:'block',width:'100%'}}>
                    {/*___.share_detail*/}
                    <div style={{width:'100px',marginLeft:(window.innerWidth-100)/2+'px',height:'30px',lineHeight:'30px',borderRadius:'4px',border:'solid 1px #ff9900',color:'#ff9900'}}>
                        返回
                    </div>
                </div>
            </div>
        );
    }
}


