/**
 * 2017-01-09
 * 订单详情页，从‘我的订单’分离出来
 */
"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import Wapi from './_modules/Wapi';
import {ThemeProvider} from './_theme/default';

import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import RaisedButton from 'material-ui/RaisedButton';

import SonPage from './_component/base/sonPage';
import AppBox from './_component/booking/app_box';
import PayBox from './_component/booking/pay_box';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
const payView=thisView.prefetch('#pay',3);
thisView.addEventListener('load',function(e){
    ReactDOM.render(<DetailBox/>,thisView);
    
    ReactDOM.render(<Pay/>,payView);
});

let noTap=false;
function tapTimer(){
    noTap=true;
    setTimeout(function() {
        noTap=false;
    }, 500);
}


const styles={
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

let _booking={};
let _act={};
let _url=location.href;
//详细信息
class DetailBox extends Component{
    constructor(props) {
        super(props);
        this.state={
            // data:false,
            step:0
        }
        this.booking={};
        this.act={};
        this.user={
            booker:false,
            carowner:false,
            installer:false
        };
        this.payPage=false;

        this.getData = this.getData.bind(this);

        this.setStep = this.setStep.bind(this);
        this.changeStep = this.changeStep.bind(this);

        this.cancelBook = this.cancelBook.bind(this);
        this.payBook = this.payBook.bind(this);
        this.selectInstall = this.selectInstall.bind(this);
        this.sendToBooker = this.sendToBooker.bind(this);
        this.confirmInstall = this.confirmInstall.bind(this);
        this.contactInstall = this.contactInstall.bind(this);
        this.changeInstall = this.changeInstall.bind(this);
        this.payBack = this.payBack.bind(this);
    }    
    componentDidMount() {
        Wapi.booking.get(res=>{
            console.log(res);
            this.booking=res.data;
            this.getData(res);
        },{objectId:_g.bookingId});
    }
    
    getData() {
        // if(nextProps.data&&this.props.data!=nextProps.data){
        //_user.mobile//当前用户电话
        //nextProps.data.userMobile//车主电话
        //nextProps.data.mobile//预定人电话

        if(this.booking.mobile==_user.mobile){
            this.user.booker=true;
        }
        if(this.booking.userMobile==_user.mobile){
            this.user.carowner=true;
        }
        if(this.booking.installId==_user.customer.objectId){
            this.user.installer=true;
        }

        let that=this;
        if(this.booking.activityId){//获取活动信息，因为活动信息没有直接放在Booking里面
            Wapi.activity.get(function(res){
                if(res.data){
                    that.act=res.data;
                    
                    if(res.data.installId){
                        Wapi.customer.get(function(re){//获取安装网点电话
                            if(re.data){
                                that.booking=Object.assign({},that.booking,{installTel:re.data.tel});
                                that.checkpay();
                            }
                        },{
                            objectId:res.data.installId
                        });
                    }else{
                        that.checkpay();
                        
                    }

                }
            },{
                objectId:this.booking.activityId
            });
        }
    }
    checkpay(){
        let that=this;
        let isPay=Wapi.pay.checkWxPay(function(res){
            let booking=W.ls('booking');
            if(res.status_code){
                W.alert(___.pay_fail);
                booking.payMoney=0;
                booking.payStatus=0;
                that.setStep();
            }else{
                booking.orderId=res.orderId;
                Wapi.booking.update(e=>console.log(e),{
                    _objectId:booking.objectId,
                    orderId:booking.orderId,
                    payMoney:booking.payMoney,
                    payStatus:booking.payStatus,
                    receiptDate:W.dateToString(new Date())
                });
                that.booking=Object.assign({},booking);
                that.setStep();
            }
        },this.act.objectId);
        if(!isPay)this.setStep();
    }
    setStep(){
        let data=this.booking;
        let s=1;
        if(data.receiptDate||(data.carType&&(data.carType.noPay==1))){
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
            step:s
        });
    }
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
                    W.alert(___.order_delete_success,e=>{history.back()});
                },{objectId:this.booking.objectId});
            }
        });
    }
    payBook(){//booker
        //继续预定，跳转到booking.html
        if(noTap)return;
        tapTimer();
        console.log('payBook');

        _booking=this.booking;
        _act=this.act;
        thisView.goTo('#pay');

        // this.payPage=true;
        // this.forceUpdate();

        // let booking=this.booking;
        // Wapi.customer.get(res=>{
        //     location.href='http://'+WiStorm.config.domain.user+'/autogps/booking.html?intent=logout'
        //         +'&bookingId='+booking.objectId
        //         +'&activityId='+this.act.objectId;
        //         // +'&wx_app_id='+this.act.wxAppKey;
        // },{objectId:this.act.uid});
    }
    sendToBooker(){//carowner
        //发送给好友，跳转到booking.html
        if(noTap)return;
        tapTimer();
        console.log('sendToBooker');
        let booking=this.booking;
        
        Wapi.customer.get(res=>{
            location.href='http://'+WiStorm.config.domain.user+'/autogps/booking.html?intent=logout'
                +'&bookingId='+booking.objectId
                +'&wxAppKey='+this.act.wxAppKey
                +'&name='+booking.name
                +'&userName='+booking.userName;
        },{objectId:this.act.uid});

    }
    selectInstall(){//booker
        if(noTap)return;
        tapTimer();
        console.log('selectInstall ');
    
        let booking=this.booking;
        location.href='http://'+WiStorm.config.domain.user+'/autogps/booking_install.html?intent=logout'
            +'&needOpenId=true'
            +'&bookingId='+booking.objectId
            +'&wx_app_id='+_user.customer.wxAppKey
            +'&openid='+booking.openId;
    }
    confirmInstall(){//installer
        if(noTap)return;
        tapTimer();
        console.log('confirmInstall');

        let booking=this.booking;
        location.href='http://'+WiStorm.config.domain.wx+'/autogps/booking_install_date.html?intent=logout'
            +'&bookingId='+booking.objectId
            +'&cust_open_id='+booking.userOpenId;//车主openId
    }
    contactInstall(){//carowner
        if(noTap)return;
        tapTimer();
        console.log('contactInstall');

        let booking=this.booking;
        location.href='tel://'+booking.installTel;
    }
    changeInstall(){//carowner
        if(noTap)return;
        tapTimer();
        console.log('changeInstall');

        let booking=this.booking;

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
            location.href='http://'+WiStorm.config.domain.user+'/autogps/booking_install.html?intent=logout'
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

        let booking=this.booking;

        let _url='http://'+WiStorm.config.domain.user+'/autogps/commission.php'
            +'?bookingId='+booking.objectId
            +'&cid='+_user.customer.objectId
            +'&receipt='+this.act.price
            +'&title='+encodeURIComponent(booking.sellerName+'的佣金')
            +'&amount='+this.act.reward
            +'&remark='+encodeURIComponent($remark)
            +'&uid='+booking.installId
            +'&to_uid='+booking.sellerId;
        
        let url='https://open.weixin.qq.com/connect/oauth2/authorize'
            +'?appid='+Wapi.pay.wxAppKey
            +'&redirect_uri='+encodeURIComponent(_url)
            +'&response_type=code&scope=snsapi_base&state=state#wechat_redirect';
        
        location.href=url;
    }
    payBack(){
        this.payPage=false;
        this.forceUpdate();
    }
    render() {
        let d=this.booking||{};
        let a=this.act||{};

        let show=styles.show;
        let hide=styles.hide;
        let btns=styles.btnGroup;

        let more=<div style={styles.expand}><NavigationExpandMore/></div>;
        let less=<div style={styles.expand}><NavigationExpandLess/></div>;

        let time1 = W.dateToString(W.date(d.createdAt));
        let time2 = d.receiptDate ? W.dateToString(W.date(d.receiptDate)) : '' ;
        if(d.carType&&(d.carType.noPay==1)){
            time2='未支付';
        }
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
                        {/*客户姓名
                        <div style={styles.childLine}>{___.booker+'：'+d.name+'/'+d.mobile}</div>*/}
                        {/*车主姓名*/}
                        <div style={styles.childLine}>{___.carowner_info+'：'+d.userName+'/'+d.userMobile}</div>
                        {/*产品型号*/}
                        <div style={styles.childLine}>{___.booking_product+'：'+(a.product||'--')}</div>
                        {/*产品价格*/}
                        <div style={styles.childLine}>{___.product_price+'：'+(a.price.toFixed(2)||'--')}</div>
                    </div>

                    <div style={(time1 && !time2) ? {} : hide}>
                        <div style={this.user.booker ? btns : hide}>
                            <RaisedButton label={___.cancel_order} onTouchTap={this.cancelBook} backgroundColor='#ff9900' labelColor='#ffffff' />
                            <RaisedButton label={___.pay_now} onTouchTap={this.payBook} primary={true} style={{marginLeft:'10px'}}/>
                        </div>
                    </div>

                </div>

                <div style={time2 ? {} : hide}>

                    <div name='time2' onClick={()=>this.changeStep(2)}>
                        {/*付款时间*/}
                        {this.state.step==2 ? less : more}
                        <div style={styles.line}>{___.order_pay_booking+'：'+time2}</div>
                    </div>

                    <div name='step2' style={this.state.step==2 ? show : hide}>
                        {time2=='未支付'?
                            <div style={styles.childLine}>零元预定</div>
                        :[  
                            /*付款金额*/
                            <div style={styles.childLine} key={1}>{___.order_pay_amount+'：'+(d.payMoney.toFixed(2)||'--')}</div>,
                            /*付款方式*/
                            <div style={styles.childLine} key={2}>{___.order_pay_type+'：'+(d.payMoney ? ___.wxPay : '--')}</div>
                        ]}
                    </div>

                    <div style={(time2 && !time3) ? {} : hide}>
                        <div style={d.carType&&(d.carType.qrStatus=='0') ? {} : hide}>
                            <div style={this.user.booker ? btns : hide}>
                                <RaisedButton label="继续预定" onTouchTap={this.payBook} primary={true} />
                            </div>
                        </div>
                        <div style={d.carType&&(d.carType.qrStatus=='1') ? {} : hide}>
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
                        <div style={styles.childLine}>{___.paid_amount+'：'+(d.money.toFixed(2)||'--')}</div>
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
                        <div style={styles.childLine}>{___.paid_amount+'：'+(d.commission.toFixed(2)||'--')}</div>
                    </div>

                </div>

                <div style={styles.hide}>{___.recommender+'：'+d.sellerName}</div>
                <div style={styles.hide}>{___.install_price+'：'+(a.installationFee||'--')}</div>

                <SonPage open={this.payPage} back={this.payBack} >
                    <Pay booking={this.booking} act={this.act}/>
                </SonPage>                
            </div>
            </ThemeProvider>
        );
    }
}

class Pay extends Component {
    constructor(props,context){
        super(props,context);
    }
    componentDidMount() {
        payView.addEventListener('show',e=>{
            history.replaceState('','',_url);
            this.forceUpdate();
        })
    }
    cancelPay(){
        history.back();
    }
    render() {
        let booking=_booking;
        let act=_act;
        let main=<div></div>;
        if(booking.objectId){
            main=<PayBox 
                    booking={booking} 
                    uid={booking.userId}
                    act={act} 
                    onCancel={this.cancelPay}
                    self={booking.type==0}
                />;
        }
        return (
            <AppBox>
                {main}
            </AppBox>
        );
    }
}


//工具方法 金额转字符
function toMoneyFormat(money){
    return money.toFixed(2);
}