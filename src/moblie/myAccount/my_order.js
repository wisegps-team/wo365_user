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

import SonPage from '../../_component/base/sonPage';
import AppBar from '../../_component/base/appBar';
import AutoList from '../../_component/base/autoList';
import {makeRandomEvent} from '../../_modules/tool';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
let _par=null;
thisView.addEventListener('load',function(e){
    ReactDOM.render(<App/>,thisView);
    _par=e.params;
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
    }
}


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
        this.changeStep = this.changeStep.bind(this);
    }    
    componentWillReceiveProps(nextProps) {
        if(nextProps.data&&this.props.data!=nextProps.data){
            this.setState({data:nextProps.data});
            let that=this;
            let flag=0;
            if(nextProps.data.activityId){
                Wapi.activity.get(function(res){
                    if(res.data){
                        let act={
                            deposit:res.data.deposit,
                            price:res.data.price,
                            installationFee:res.data.installationFee,
                            product:res.data.product
                        }
                        let data=Object.assign({},nextProps.data,act);
                        that.setState({data:data});
                    }
                },{
                    objectId:nextProps.data.activityId
                });
            }
            if(nextProps.data.installId){
                Wapi.customer.get(function(res){
                    if(res.data){
                        let data=Object.assign({},nextProps,{installTel:res.data.tel});
                        that.setState({data:data});
                    }
                },{
                    objectId:nextProps.data.installId
                });
            }
        }  
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
    render() {
        console.log('render');
        let d=this.state.data||{};

        let show=styles.show;
        let hide=styles.hide;
        
        let more=<div style={styles.expand}><NavigationExpandMore/></div>;
        let less=<div style={styles.expand}><NavigationExpandLess/></div>;

        let time1 = W.dateToString(W.date(d.createdAt));
        let time2 = d.selectInstallDate ? W.dateToString(W.date(d.createdAt)) : '' ;
        let time3 = d.selectInstallDate ? W.dateToString(W.date(d.selectInstallDate)) : '' ;
        let time4 = d.confirmTime ? W.dateToString(W.date(d.confirmTime)) : '' ;
        let time5 = d.resTime ? W.dateToString(W.date(d.resTime)) : '' ;
        let time6 = d.receiptDate ? W.dateToString(W.date(d.receiptDate)) : '' ;
        let time7 = d.payTime ? W.dateToString(W.date(d.payTime)) : '' ;

        return (
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
                </div>
                
                <div style={time4 ? {} : hide}>
                    <div name='time4' onClick={()=>this.changeStep(4)}>
                        {/*预约确认*/}
                        {this.state.step==4 ? less : more}
                        <div style={styles.line}>{___.order_book_confirm+'：'+time4}</div>
                    </div>
                    <div name='step4' style={this.state.step==4 ? show : hide}>
                        {/*预约时间*/}
                        <div style={styles.childLine}>{___.order_book_date+'：'+(d.installDate||'--')}</div>
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
        );
    }
}


//工具方法 金额转字符
function toMoneyFormat(money){
    return '￥' + money.toFixed(2);
}