//预订列表，条件在goTo的时候传进来

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../../_theme/default';
import {Tabs, Tab} from 'material-ui/Tabs';
import Card from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import SocialShare from 'material-ui/svg-icons/social/share';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import RaisedButton from 'material-ui/RaisedButton';

import SonPage from '../../_component/base/sonPage';
import AppBar from '../../_component/base/appBar';
import AutoList from '../../_component/base/autoList';
import {makeRandomEvent} from '../../_modules/tool';
import PayBox from '../../_component/booking/pay_box';
import QrBox from '../../_component/booking/qr_box';
import AppBox from '../../_component/booking/app_box';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
const payView=thisView.prefetch('#pay',3);
let _par=null;
thisView.addEventListener('load',function(e){
    ReactDOM.render(<App/>,thisView);
    _par=e.params;

    ReactDOM.render(<Pay/>,payView);
});

const EVENT=makeRandomEvent({
    openDetails:'open_details',
});


const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingLeft:'5%',paddingRight:'5%',paddingTop:'60px',paddingBottom:'20px',},
    card:{marginTop:'5px',padding:'10px',lineHeight: '30px',borderBottom:'solid 1px #999999'},
    w:{
        width:'50%',
        display:'inline-block'
    },
    a:{
        color: 'rgb(26, 140, 255)',
        marginLeft: '2em'
    },
    p:{
        'padding': '0 1em'
    },
    line:{
        padding:'10px',
        borderBottom:'1px solid #cccccc',
        color:'#000000'
        // fontWeight:'bold'
    },
    childLine:{
        padding:'10px',
        color:'#999999'
    },
    hide:{
        display:'none'
    },
    show:{
        padding:'10px'
    },
    expand:{
        float:'right',
        marginTop:'10px'
    },
    btnGroup:{
        position:'fixed',
        bottom:'20px',
        width:(window.innerWidth-30)+'px',
        // marginTop:'20px',
        textAlign:'center'
    },
}

let noTap=false;
function tapTimer(){
    noTap=true;
    setTimeout(function() {
        noTap=false;
    }, 500);
}

let pay_booking={product:{price:0,id:0}};
let pay_act={};
let pay_self={};
let pay_action=0;

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            books:[],
            total:0,
            bookData:null
        }
        this.page=0;
        this._data={
            mobile:_user.mobile
        };
        this.bookData=null;
        this.detail=this.detail.bind(this);
        this.load=this.load.bind(this);
        this.toList = this.toList.bind(this);
    }
    getChildContext(){
        return {
            detail:this.detail
        };
    }
    componentDidMount(){
        this.load();
    }
    detail(data){
        this.setState({bookData:data});
    }
    load(){
        let arr=this.state.books;
        this.page++;

        Wapi.booking.list(res=>{
            this.setState({
                books:arr.concat(res.data),
            });
        },this._data,{
            limit:20,
            page_no:this.page
        });
    }

    toList(){
        this.setState({
            bookData:null
        });
    }
    render(){
        return(
            <ThemeProvider>
                <AppBar 
                    title={___.my_order} 
                    style={styles.appbar}
                />
                <div style={styles.main}>
                    <Alist 
                        max={this.state.total} 
                        limit={20} 
                        data={this.state.books} 
                        next={this.load} 
                    />
                </div>
                
                <SonPage title={___.order_detail} open={this.state.bookData!=null} back={this.toList}>
                    <DetailBox data={this.state.bookData}/>
                </SonPage>
            </ThemeProvider>
        )
    }
}
App.childContextTypes={
    detail:React.PropTypes.func
}

class DumbList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    openDetails(data){
        this.context.detail(data);
    }
    render() {
        let cards=this.props.data.map((ele,index)=>{
            let colors=['#8BC34A','#00BFA5'];
            let i=ele.status;
            return(
                <div key={index} style={styles.card}>
                    <div style={{float:'right'}}><a style={styles.a} onClick={e=>this.openDetails(ele)}>{___.details}</a></div>
                    <div>{___.order_status+'：'+___.booking_status[i]}</div>
                    <div>{___.book_date+'：'+W.dateToString(W.date(ele.createdAt)).slice(0,10)}</div>
                    <div>{___.booking_product + '：'+ ele.product.name}</div>
                </div>
            )
        })
        return(
            <div>
                {cards}
            </div>
        )
    }
}
DumbList.contextTypes={
    detail: React.PropTypes.func
};
let Alist=AutoList(DumbList);


//详细信息
class DetailBox extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:false,
            step:0
        }
        this.user={
            booker:false,
            carowner:false,
            installer:false
        };
        this.setStep = this.setStep.bind(this);
        this.changeStep = this.changeStep.bind(this);

        this.cancelBook = this.cancelBook.bind(this);
        this.payBook = this.payBook.bind(this);
        this.selectInstall = this.selectInstall.bind(this);
        this.sendToBooker = this.sendToBooker.bind(this);
        this.confirmInstall = this.confirmInstall.bind(this);
        this.contactInstall = this.contactInstall.bind(this);
        this.changeInstall = this.changeInstall.bind(this);
    }    
    componentWillReceiveProps(nextProps) {
        if(nextProps.data&&this.props.data!=nextProps.data){
            //_user.mobile//当前用户电话
            //nextProps.data.userMobile//车主电话
            //nextProps.data.mobile//预定人电话

            if(nextProps.data.mobile==_user.mobile){
                this.user.booker=true;
            }
            if(nextProps.data.userMobile==_user.mobile){
                this.user.carowner=true;
            }

            pay_booking=nextProps.data;
            if(this.user.booker&&this.user.carowner){
                pay_self=true;
            }

            this.setState({data:nextProps.data});
            let that=this;
            if(nextProps.data.activityId){//获取活动信息，因为活动信息没有直接放在Booking里面
                Wapi.activity.get(function(res){
                    if(res.data){
                        pay_act=res.data;
                        let act={
                            deposit:res.data.deposit,
                            price:res.data.price,
                            installationFee:res.data.installationFee,
                            product:res.data.product
                        }
                        let data=Object.assign({},nextProps.data,act);

                        if(nextProps.data.installId){
                            Wapi.customer.get(function(res){//获取安装网点电话
                                if(res.data){
                                    data=Object.assign({},data,{installTel:res.data.tel});
                                    // that.setState({
                                    //     data:data,
                                    //     step:1
                                    // });
                                    that.setStep(data);
                                }
                            },{
                                objectId:nextProps.data.installId
                            });
                        }else{
                            // that.setState({
                            //     data:data,
                            //     step:1
                            // });
                            that.setStep(data);
                        }

                    }
                },{
                    objectId:nextProps.data.activityId
                });
            }
        }  
    }
    setStep(data){
        let s=1;
        if(data.receiptDate){
            s=2;
        }
        if(data.selectInstallDate){
            s=3;
        }
        if(data.confirmTime){
            s=4;
        }
        if(data.resTime){
            s=5;
        }
        if(data.payTime){
            s=7;
        }
        this.setState({
            data:data,
            step:s
        });
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextState.data!=this.state.data;
    // }
    changeStep(s){
        if(this.state.step==s){
            this.state.step=0;
        }else{
            this.state.step=s;
        }
        this.forceUpdate();
    }
    cancelBook(){//booker
        if(noTap)return;
        tapTimer();
        console.log('cancelBook');
        W.confirm(___.confirm_delete_booking,b=>{
            if(b){
                Wapi.booking.delete(res=>{
                    W.alert('delete success');
                },{objectId:this.state.data.objectId});
            }
        });
    }
    payBook(){//booker
        if(noTap)return;
        tapTimer();
        console.log('payBook');
        pay_action=Number(this.state.step==2);
        thisView.goTo('#pay');
    }
    sendToBooker(){//carowner
        if(noTap)return;
        tapTimer();
        console.log('sendToBooker');
        let booking=this.state.data;

        Wapi.serverApi.sendWeixinByTemplate(re=>{
            if(!re.status_code){
                W.alert('已发送预定信息给预定人');
            }
        },{
            openId:booking.openId,   //预定人的openid
            uid:booking.uid,   //booking的uid
            templateId:'OPENTM408168978',
            type:'1',
            link:'http://'+WiStorm.config.domain.wx+'/autogps/booking_install.html?intent=logout'
                +'&needOpenId=true'
                +'&bookingId='+booking.objectId
                +'&wx_app_id='+_user.customer.wxAppKey
                +'&openid='+booking.openId,
            data:{
                "first": {//标题
                    "value": ___.bookingId+'：'+booking.objectId,
                    "color": "#173177"
                },
                "keyword1": {//预订时间
                    "value": W.dateToString(new Date(booking.createdAt)).slice(0,-3),    //booking的createdAt
                    "color": "#173177"
                },
                "keyword2": {//预订产品
                    "value": booking.product+'/￥'+parseFloat(booking.price).toFixed(2),
                    "color": "#173177"
                },
                "keyword3": {//设备款项
                    "value": booking.installationFee,
                    "color": "#173177"
                },
                "keyword4": {//车主信息
                    "value": booking.userName+'/'+booking.userMobile,
                    "color": "#173177"
                },
                "remark": {
                    "value": ___.sendWeixinToBooker_bookSuccess,
                    "color": "#173177"
                }
            }
        });
    }
    selectInstall(){//booker
        if(noTap)return;
        tapTimer();
        console.log('selectInstall ');
    
        let booking=this.state.data;
        location.href='http://'+WiStorm.config.domain.wx+'/autogps/booking_install.html?intent=logout'
            +'&needOpenId=true'
            +'&bookingId='+booking.objectId
            +'&wx_app_id='+_user.customer.wxAppKey
            +'&openid='+booking.openId;
    }
    confirmInstall(){//installer
        if(noTap)return;
        tapTimer();
        console.log('confirmInstall');

        let booking=this.state.data;
        location.href='http://'+WiStorm.config.domain.wx+'/autogps/booking_install_date.html?intent=logout'
            +'&bookingId='+booking.objectId
            +'&cust_open_id='+booking.userOpenId;//车主openId
    }
    contactInstall(){//carowner
        if(noTap)return;
        tapTimer();
        console.log('contactInstall');

        let booking=this.state.data;
        location.href='tel://'+booking.installTel;
    }
    changeInstall(){//carowner
        if(noTap)return;
        tapTimer();
        console.log('changeInstall');

        let booking=this.state.data;

        let expire = (booking.installDate ? Number(new Date(booking.installDate)) : Number(new Date(booking.selectInstallDate))+1000*60*60*2);
        let now=Number(new Date());
                
        if(expire>now){
            if(booking.installDate){
                let str=___.no_change_step4;
                str=str.replace('time',W.dateToString(new Date(booking.installDate)));
                W.alert(str);
            }else{
                let str=___.no_change_step3;
                str=str.replace('time',W.dateToString(new Date(booking.selectInstallDate)));
                str=str.replace('install',booking.install);
                W.alert(str);
            }
        }else{
            location.href='http://'+WiStorm.config.domain.wx+'/autogps/booking_install.html?intent=logout'
                +'&needOpenId=true'
                +'&bookingId='+booking.objectId
                +'&wx_app_id='+_user.customer.wxAppKey
                +'&openid='+booking.openId;
        }
    }
    payCommission(){
        if(noTap)return;
        tapTimer();
        console.log('payCommission');

        let booking=this.state.data;

        let _url='http://'+WiStorm.config.domain.wx+'/autogps/commission.php'
            +'?bookingId='+booking.objectId
            +'&cid='+_user.customer.objectId
            +'&receipt='+pay_act.price
            +'&title='+encodeURIComponent(booking.sellerName+'的佣金')
            +'&amount='+pay_act.reward
            +'&remark='+encodeURIComponent($remark)
            +'&uid='+booking.installId
            +'&to_uid='+booking.sellerId;
        
        let url='https://open.weixin.qq.com/connect/oauth2/authorize'
            +'?appid='+Wapi.pay.wxAppKey
            +'&redirect_uri='+encodeURIComponent(_url)
            +'&response_type=code&scope=snsapi_base&state=state#wechat_redirect';
        
        location.href=url;
    }
    render() {
        let d=this.state.data||{};

        let show=styles.show;
        let hide=styles.hide;
        let btns=styles.btnGroup;

        let more=<div style={styles.expand}><NavigationExpandMore/></div>;
        let less=<div style={styles.expand}><NavigationExpandLess/></div>;

        let time1 = W.dateToString(W.date(d.createdAt));
        let time2 = d.receiptDate ? W.dateToString(W.date(d.receiptDate)) : '' ;
        let time3 = d.selectInstallDate ? W.dateToString(W.date(d.selectInstallDate)) : '' ;
        let time4 = d.confirmTime ? W.dateToString(W.date(d.confirmTime)) : '' ;
        let time5 = d.resTime ? W.dateToString(W.date(d.resTime)) : '' ;
        let time6 = d.payTime ? W.dateToString(W.date(d.payTime)) : '' ;
        let time7 = d.commissionDate ? W.dateToString(W.date(d.commissionDate)) : '' ;

        if(this.user.booker||this.user.carowner){
            time6='';
            time7='';
        }

        return (
            <ThemeProvider>
            <div style={styles.p}>
                {/*订单号*/}
                <div style={styles.line}>{___.order_id+'：'+d.objectId}</div>

                <div>

                    <div name='time1' onClick={()=>this.changeStep(1)}>
                        {/*订单提交时间*/}
                        {this.state.step==1 ? less : more}
                        <div style={styles.line}>{___.submit_booking+'：'+time1}</div>
                    </div>

                    <div name='step1' style={this.state.step==1 ? show : hide}>
                        {/*客户姓名*/}
                        <div style={styles.childLine}>{___.booker+'：'+d.name+'/'+d.mobile}</div>
                        {/*车主姓名*/}
                        <div style={styles.childLine}>{___.carowner_info+'：'+d.userName+'/'+d.userMobile}</div>
                        {/*产品型号*/}
                        <div style={styles.childLine}>{___.booking_product+'：'+(d.product||'--')}</div>
                        {/*产品价格*/}
                        <div style={styles.childLine}>{___.product_price+'：'+(d.price||'--')}</div>
                    </div>

                    <div style={(time1 && !time2) ? {} : hide}>
                        <div style={this.user.booker ? btns : hide}>
                            <RaisedButton label="取消订单" onTouchTap={this.cancelBook} backgroundColor='#ff9900' labelColor='#ffffff' />
                            <RaisedButton label="继续预定" onTouchTap={this.payBook} primary={true} style={{marginLeft:'10px'}}/>
                        </div>
                    </div>

                </div>

                <div style={time2 ? {} : hide}>

                    <div name='time2' onClick={()=>this.changeStep(2)}>
                        {/*付款时间*/}
                        {this.state.step==2 ? less : more}
                        <div style={styles.line}>{___.order_pay_date+'：'+time2}</div>
                    </div>

                    <div name='step2' style={this.state.step==2 ? show : hide}>
                        {/*付款金额*/}
                        <div style={styles.childLine}>{___.order_pay_amount+'：'+(d.payMoney||'--')}</div>
                        {/*付款方式*/}
                        <div style={styles.childLine}>{___.order_pay_type+'：'+(d.payMoney ? ___.wxPay : '--')}</div>
                    </div>

                    <div style={(time2 && !time3) ? {} : hide}>
                        <div style={d.carType&&d.carType.qrStatus ? hide : {}}>
                            <div style={this.user.booker ? btns : hide}>
                                <RaisedButton label="继续预定" onTouchTap={this.payBook} primary={true} />
                            </div>
                        </div>
                        <div style={d.carType&&d.carType.qrStatus ? {} : hide}>
                            <div style={(this.user.carowner && !this.user.booker) ? btns : hide}>
                                <RaisedButton label="发送预订信息给XX" onTouchTap={this.sendToBooker} primary={true} />
                            </div>
                            <div style={this.user.booker ? btns : hide}>
                                <RaisedButton label="选择安装网点" onTouchTap={this.selectInstall} primary={true} />
                            </div>
                        </div>
                    </div>

                </div>

                <div style={time3 ? {} : hide}>

                    <div name='time3' onClick={()=>this.changeStep(3)}>
                        {/*预约安装*/}
                        {this.state.step==3 ? less : more}
                        <div style={styles.line}>{___.order_book_install+'：'+time3}</div>
                    </div>

                    <div name='step3' style={this.state.step==3 ? show : hide}>
                        {/*预约门店*/}
                        <div style={styles.childLine}>{___.order_book_shop+'：'+(d.install||'--')}</div>
                        {/*门店电话*/}
                        <div style={styles.childLine}>{___.order_book_shop_tel+'：'+(d.installTel||'--')}</div>
                    </div>

                    <div style={(time3 && !time4) ? {} : hide}>
                        <div style={this.user.installer ? btns : hide}>
                            <RaisedButton label="服务预约确认" onTouchTap={this.confirmInstall} primary={true} />
                        </div>
                        <div style={this.user.carowner ? btns : hide}>
                            <RaisedButton label="联系安装网点" onTouchTap={this.contactInstall} primary={true} />
                            <RaisedButton label="更换安装网点" onTouchTap={this.changeInstall} primary={true} style={{marginLeft:'10px'}} />
                        </div>
                    </div>

                </div>
                
                <div style={time4 ? {} : hide}>

                    <div name='time4' onClick={()=>this.changeStep(4)}>
                        {/*预约确认*/}
                        {this.state.step==4 ? less : more}
                        <div style={styles.line}>{___.order_book_confirm+'：'+time4}</div>
                    </div>

                    <div name='step4' style={this.state.step==4 ? show : hide}>
                        {/*预约时间*/}
                        <div style={styles.childLine}>{___.order_book_date+'：'+(W.dateToString(new Date(d.installDate))||'--')}</div>
                    </div>

                    <div style={(time4 && !time5) ? {} : hide}>
                        <div style={this.user.carowner ? btns : hide}>
                            <RaisedButton label="联系安装网点" onTouchTap={this.contactInstall} primary={true} />
                            <RaisedButton label="更换安装网点" onTouchTap={this.changeInstall} primary={true} style={{marginLeft:'10px'}} />
                        </div>
                    </div>

                </div>
                
                <div style={time5 ? {} : hide}>

                    <div name='time5' onClick={()=>this.changeStep(5)}>
                        {/*安装注册*/}
                        {this.state.step==5 ? less : more}
                        <div style={styles.line}>{___.order_install_regist+'：'+time5}</div>
                    </div>

                    <div name='step5' style={this.state.step==5 ? show : hide}>
                        {/*注册车主*/}
                        <div style={styles.childLine}>{___.order_regist_cust+'：'+((d.res&&d.res.name)||'--')}</div>
                        {/*注册产品*/}
                        <div style={styles.childLine}>{___.order_regist_product+'：'+((d.res&&d.res.product)||'--')}</div>
                    </div>

                </div>
                
                <div style={time6 ? {} : hide}>

                    <div name='time6' onClick={()=>this.changeStep(6)}>
                        {/*货款结算*/}
                        {this.state.step==6 ? less : more}
                        <div style={styles.line}>{___.order_payment_settlement+'：'+time6}</div>
                    </div>

                    <div name='step6' style={this.state.step==6 ? show : hide}>
                        {/*支付金额*/}
                        <div style={styles.childLine}>{___.paid_amount+'：'+(d.money||'--')}</div>
                    </div>

                    <div style={(time6 && !time7) ? {} : hide}>
                        <div style={this.user.installer ? btns : hide}>
                            <RaisedButton label="支付佣金" onTouchTap={this.payCommission} primary={true} />
                        </div>
                    </div>                    

                </div>

                <div style={time7 ? {} : hide}>

                    <div name='time7' onClick={()=>this.changeStep(7)}>
                        {/*佣金结算*/}
                        {this.state.step==7 ? less : more}
                        <div style={styles.line}>{___.order_commission_settlement+'：'+time7}</div>
                    </div>

                    <div name='step7' style={this.state.step==7 ? show : hide}>
                        {/*支付金额*/}
                        <div style={styles.childLine}>{___.paid_amount+'：'+(d.commission||'--')}</div>
                    </div>

                </div>

                <div style={styles.hide}>{___.recommender+'：'+d.sellerName}</div>
                <div style={styles.hide}>{___.install_price+'：'+(d.installationFee||'--')}</div>
            </div>
            </ThemeProvider>
        );
    }
}

class Pay extends Component {
    constructor(props,context){
        super(props,context);
        this.cancelPay = this.cancelPay.bind(this);
    }
    componentDidMount() {
        payView.addEventListener('show',e=>{
            this.forceUpdate();
        });
    }
    
    cancelPay(){
        this.forceUpdate();
    }
    render() {
        let box=[
            <PayBox
                booking={pay_booking} 
                uid={_user.uid} 
                act={pay_act} 
                onCancel={this.cancelPay}
                self={pay_self}
            />,
            <QrBox 
                url={pay_booking.carType && pay_booking.carType.qrUrl}
                product={pay_booking.product}
                prepayments={pay_booking.payMoney}
            />
        ];
        return (
            <AppBox>
                {box[pay_action]}
            </AppBox>
        );
    }
}


//工具方法 金额转字符
function toMoneyFormat(money){
    return money.toFixed(2);
}