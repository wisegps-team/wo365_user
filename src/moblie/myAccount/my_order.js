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
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

import SonPage from '../../_component/base/sonPage';
import AppBar from '../../_component/base/appBar';
import AutoList from '../../_component/base/autoList';
import {makeRandomEvent} from '../../_modules/tool';
import PayBox from '../../_component/booking/pay_box';
import QrBox from '../../_component/booking/qr_box';
import AppBox from '../../_component/booking/app_box';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
// const payView=thisView.prefetch('#pay',3);
let _par=null;
thisView.addEventListener('load',function(e){
    ReactDOM.render(<App/>,thisView);
    _par=e.params;

    // ReactDOM.render(<Pay/>,payView);
});

const EVENT=makeRandomEvent({
    openDetails:'open_details',
});


const styles={
    appbar:{
        position:'fixed',
        top:'0px'
    },
    main:{
        width:'90%',
        paddingLeft:'5%',
        paddingRight:'5%',
        paddingBottom:'20px',
    },
    card:{
        marginTop:'5px',
        padding:'10px',
        lineHeight: '30px',
        borderBottom:'solid 1px #999999'
    },
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
    variable:{
        color:'#009988'
    }
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
        // this.setState({bookData:data});
        // location.href='http://'+WiStorm.config.domain.wx+'/autogps/order.html?intent=logout&bookingId='+data.objectId;
        history.replaceState('','','../home.html');
        location.href=WiStorm.root+'order.html?intent=logout&bookingId='+data.objectId;
    }
    load(){
        let arr=this.state.books;
        this.page++;

        Wapi.booking.list(res=>{
            console.log(res);
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
                {/*<AppBar 
                    title={___.my_order} 
                    style={styles.appbar}
                />*/}

                <div style={styles.main}>
                    <Alist 
                        max={this.state.total} 
                        limit={20} 
                        data={this.state.books} 
                        next={this.load} 
                    />
                </div>
                
                {/*<SonPage title={___.order_detail} open={this.state.bookData!=null} back={this.toList}>
                    <DetailBox data={this.state.bookData}/>
                </SonPage>*/}
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
            let strStatus=Status(ele);
            return(
                <div key={index} style={styles.card}>
                    {/*<div style={{float:'right'}}><a style={styles.a} onClick={e=>this.openDetails(ele)}>{___.details}</a></div>*/}
                    <div>
                        {___.book_date+'：'}
                        <span style={styles.variable}>{timeFormat(ele.createdAt)}</span>
                    </div>
                    <div>
                        {___.booking_product + '：'}
                        <span style={styles.variable}>{(ele.product.brand||'') +' '+ ele.product.name}</span>
                    </div>
                    <div style={{width:'100%',display:'block'}} onClick={e=>this.openDetails(ele)}>
                        <div style={{float:'right',paddingTop:'5px'}}><NavigationChevronRight /></div>
                        <div>
                            {___.order_status+'：'}
                            <span style={styles.variable}>{strStatus}</span>
                        </div>
                    </div>
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



//工具方法 金额转字符
function toMoneyFormat(money){
    return money.toFixed(2);
}

//工具方法 返回订单的状态
function Status(data){
    if(data.resTime){
        return ___.str_order_status[4];
    }
    if(data.confirmTime){
        return ___.str_order_status[3];
    }
    if(data.selectInstallDate){
        return ___.str_order_status[2];
    }
    if(data.receiptDate||data.carType.noPay==1){
        return ___.str_order_status[1];
    }
    return ___.str_order_status[0];
}

//工具方法 数据库的时间转格式
function timeFormat(time){
    return W.dateToString(new Date(time))
}