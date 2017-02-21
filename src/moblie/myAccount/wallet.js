import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import Input from '../../_component/base/input';
import AppBar from '../../_component/base/appBar';
import AutoList from '../../_component/base/autoList';
import MobileChecker from '../../_component/base/mobileChecker';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.my_wallet);
thisView.addEventListener('load',function(){
    ReactDOM.render(<WalletApp/>,thisView);

    let withdrawView=thisView.prefetch('#withdraw',3);
    withdrawView.setTitle(___.my_wallet);
    ReactDOM.render(<WithdrawPage/>,withdrawView);
});


const styles={
    appbar:{
        position:'fixed',
        top:'0px'
    },
    main:{
        padding:'10px',
    },
    p:{
        padding: '10px',
    },
    lo:{
        width: '100%',
        // position: 'fixed',
        // bottom: '10%',
        // left: '10%'
    },
    logo:{
        top:'0px',
        bottom:'0px',
        margin: 'auto',
        height:'40px',
        width:'40px'
    },
    limg:{
        width: '100%',
        height: '100%'
    },
    income:{
        float:'right'
    },
    expenses:{
        color:'#990000',
        float:'right'
    },
    bill:{
        padding:'5px 10px',
        borderBottom:'1px solid #cccccc'
    },
    bill_remark:{
        paddingTop:'5px'
    },
    head:{
        width:'100%',
        height:'120px',
        display:'block',
        textAlign:'center',
        paddingTop:'40px',
        backgroundColor:'#3c9bf9',
    },
    head_str:{
        fontSize:'14px',
        marginBottom:'5px',
        color:'#ffffff'
    },
    head_num:{
        fontSize:'36px',
        marginBottom:'10px',
        color:'#ffffff'
    },
    a:{
        // color:'#009988'
        color:'#FFFF8D'
    },
    sonpage_main:{
        marginLeft:'10px',
        marginRight:'10px',
        textAlign:'center'
    },
    inputGroup:{
        display:'block',
        paddingTop:'1em',
        paddingBottom:'1em'
    },
    hide:{
        display:'none',
    },
    no_record:{
        width:'100%',
        textAlign:'center'
    },
    line:{
        marginTop:'15px'
    }
}
function vmiddle(num,sty){
    return Object.assign({marginTop:((window.innerHeight-num)/2-50)+'px'},sty);
}


class WalletApp extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isInputPsw:false,
            isInputAmount:false,
        }
        this.data=[];
        this.psw='';
        this.amount=0;
        this.page_no=1;
        this.total=0;

        this.loadNextPage = this.loadNextPage.bind(this);
        this.getRecords = this.getRecords.bind(this);

        this.inputPsw = this.inputPsw.bind(this);
        this.closeInputPsw = this.closeInputPsw.bind(this);
        this.pswChange = this.pswChange.bind(this);

        this.inputAmount = this.inputAmount.bind(this);
        this.closeInputAmount = this.closeInputAmount.bind(this);
        this.amountChange = this.amountChange.bind(this);

        this.withdrawCash = this.withdrawCash.bind(this);
    }
    componentDidMount() {
        this.getRecords();
    }
    loadNextPage(){
        this.page_no++;
        this.getRecords();
    }
    getRecords(){
        Wapi.user.getBillList(res=>{
            this.total=res.total;
            let _data=res.data.reverse();
            this.data=this.data.concat(_data);
            this.forceUpdate();
        },{
            uid:_user.objectId,
            start_time:'2016-01-01',
            end_time:'2026-12-12',
        });
    }

    inputPsw(){
        // this.setState({isInputPsw:true});
        thisView.goTo('#withdraw');
    }
    closeInputPsw(){
        this.setState({isInputPsw:false});
    }
    pswChange(e,value){
        this.psw=value;
    }

    inputAmount(){
        this.setState({
            isInputPsw:false,
            isInputAmount:true
        });
    }
    closeInputAmount(){
        this.setState({isInputAmount:false});
    }
    amountChange(e,value){
        this.amount=value;
    }

    withdrawCash(){
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(!reg.test(this.amount)){
            this.setState({isInputAmount:false});
            W.alert(___.amount_error);
            return;
        }
        if(this.amount>_user.balance){
            this.setState({isInputAmount:false});
            W.alert(___.balance_not_enough);
            return;
        }
        this.setState({isInputAmount:false});
        
        history.replaceState('home','home','home.html');
        Wapi.pay.wxPay({
            uid:_user.uid,
            order_type:3,
            remark:'提现',
            amount:this.amount,
            title:'提现',
            psw:this.psw,
            // isCust:1,
        },'wxPay_withdraw',location.href);
    }

    render() {
        const actions = 1;
        return (
            <ThemeProvider>
            <div>

                {/*<AppBar 
                    style={styles.appbar}
                    title={___.my_wallet} 
                />*/}

                <div style={styles.head}>
                    {/*<div style={styles.head_str}>{___.balance}</div>*/}
                    <div style={styles.head_num}>{toMoneyFormat(_user.balance)}</div>
                    <div style={_user.balance>0 ? {} : styles.hide}>
                        <a style={styles.a} onTouchTap={this.inputPsw}>{___.withdraw_cash}</a>
                    </div>
                </div>

                <div style={styles.main}>
                    {(_user.balance==0&&this.total==0) ? (
                        <div style={styles.no_record}>
                            <div style={styles.line}>{___.wallet_empty}</div>
                            <div style={styles.line}>{___.join_get_redbag}</div>
                        </div>):(
                        <Alist 
                            max={this.total} 
                            limit={20} 
                            data={this.data} 
                            next={this.loadNextPage} 
                        />
                    )}
                </div>
                
                <Dialog
                    open={this.state.isInputPsw}
                    actions={[
                        <FlatButton
                            label={___.cancel}
                            primary={true}
                            onClick={this.closeInputPsw}
                        />,
                        <FlatButton
                            label={___.ok}
                            primary={true}
                            onClick={this.inputAmount}
                        />
                    ]}
                >
                    
                    <Input
                        floatingLabelText={___.input_user_psw}
                        onChange={this.pswChange}
                        type="password"
                    />

                </Dialog>

                <Dialog
                    open={this.state.isInputAmount}
                    actions={[
                        <FlatButton
                            label={___.cancel}
                            primary={true}
                            onClick={this.closeInputAmount}
                        />,
                        <FlatButton
                            label={___.ok}
                            primary={true}
                            onClick={this.withdrawCash}
                        />
                    ]}
                >
                    
                    <Input
                        floatingLabelText={___.input_withdraw_amount}
                        onChange={this.amountChange}
                    />

                </Dialog>
            </div>
            </ThemeProvider>
        );
    }
}

class DList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let items=this.props.data.map((ele)=>
            <div key={ele.objectId} style={styles.bill}>
                <div style={(ele.amount>=0) ? styles.income : styles.expenses}>
                    {(ele.amount>=0) ? (ele.amount.toFixed(2)) : (Math.abs(ele.amount).toFixed(2))}
                </div>
                <div style={styles.bill_remark}>{W.dateToString(new Date(ele.createdAt))}</div>
                <div style={styles.bill_remark}>{decodeURIComponent(ele.remark)}</div>
            </div>
        );
        return(
            <div>
                {items}
            </div>
        )
    }
}
let Alist=AutoList(DList);


class WithdrawPage extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isInputAmount:true
        }
        this.amount=0;
        this.withdrawChange = this.withdrawChange.bind(this);
        this.toCheckPhone = this.toCheckPhone.bind(this);
        this.success = this.success.bind(this);
        this.toWithdraw = this.toWithdraw.bind(this);
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            if(!this.state.isInputAmount){
                this.setState({isInputAmount:true});
            }
        })
    }
    withdrawChange(e,value){
        this.amount=value;
    }
    toCheckPhone(){
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(!reg.test(this.amount)||this.amount==0){
            W.alert(___.amount_error);
            return;
        }
        if(this.amount>_user.balance){
            W.alert(___.balance_not_enough);
            return;
        }
        this.setState({isInputAmount:false});
    }
    success(val,name){
        this.code=val;
    }
    toWithdraw(){
        if(!this.code){
            W.alert(___.code_err);
            return;
        }

        history.replaceState('home','home','home.html');
        Wapi.pay.wxPay({
            uid:_user.uid,
            order_type:3,
            remark:'提现',
            amount:this.amount,
            title:'提现',
            psw:this.psw,
            // isCust:1,
        },'wxPay_withdraw',location.href);
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                {/*<AppBar title={___.withdraw_cash}/>*/}

                <div style={this.state.isInputAmount ? vmiddle(180,styles.sonpage_main) : {display:'none'}}>
                    <div style={styles.inputGroup}>
                        <span>{___.input_withdraw_amount}</span>
                        <span style={{paddingLeft:'1em'}}>
                            <Input name='withdraw' style={{height:'30px',width:'100px'}} inputStyle={{height:'20px'}} onChange={this.withdrawChange}/>
                        </span>
                    </div>
                    <p style={{fontSize:'0.8em',color:'#666666'}}>{___.withdraw_alert}</p>
                    <RaisedButton style={{marginTop:'1em'}} onClick={this.toCheckPhone} label={___.ok} primary={true}/>
                </div>

                <div style={this.state.isInputAmount ? {display:'none'} : vmiddle(200,styles.sonpage_main)}>
                    <p style={{fontSize:'0.8em'}}>{___.need_check_phone}</p>
                    <div style={{width:'90%',marginLeft:'5%'}}>
                        <MobileChecker mobile={_user.employee ? _user.employee.tel : _user.customer.tel} onSuccess={this.success}/>
                    </div>
                    <RaisedButton style={{marginTop:'1em'}} onClick={this.toWithdraw} label={___.ok} primary={true}/>
                </div>

            </div>
            </ThemeProvider>
        );
    }
}

//工具方法 金额转字符
function toMoneyFormat(money){
    return money.toFixed(2);
}