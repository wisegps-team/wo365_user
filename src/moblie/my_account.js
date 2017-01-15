import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Input from '../_component/base/input';
import AreaSelect from '../_component/base/areaSelect';
import Avatar from 'material-ui/Avatar';

import ActionLock from 'material-ui/svg-icons/action/lock';
import ActionAccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionFace from 'material-ui/svg-icons/action/face';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import ContentClear from 'material-ui/svg-icons/content/clear';

import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

import Forget from '../_component/login/forget';
import UserNameInput from '../_component/base/userNameInput';
import AppBar from '../_component/base/appBar';
import AutoList from '../_component/base/autoList';
import {getOpenIdKey} from '../_modules/tool';

import Dialog from 'material-ui/Dialog';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.my_account);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    
    thisView.prefetch('booking_list.js',2);
});

const sty={
    appbar:{
        position:'fixed',
        top:'0px'
    },
    main:{
        padding:'10px',
        // marginTop:'50px',
    },
    p:{
        // padding: '10px',
    },
    lo:{
        // width: '100%',
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
        color:'#009900',
        fontSize:'20px',
        float:'right'
    },
    expenses:{
        color:'#990000',
        fontSize:'20px',
        float:'right'        
    },
    bill:{
        padding:'5px 10px',
        borderTop:'1px solid #cccccc'
    },
    bill_remark:{
        fontSize:'14px',
        color:'#666666',
        paddingTop:'5px'
    },
    head:{
        width:'100%',
        height:'120px',
        display:'block',
        textAlign:'center',
        paddingTop:'40px',
        backgroundColor:'#33ccee',
        color:'#ffffff'
    },
    head_str:{
        fontSize:'14px',
        marginBottom:'5px'
    },
    head_num:{
        fontSize:'36px',
        marginBottom:'10px'
    },
    a:{
        color:'#009988'
    },
}

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            edit:false
        }
        this.edit = this.edit.bind(this);
        this.back = this.back.bind(this);
    }
    componentDidMount() {
        Wapi.pay.checkWxPay(res=>{
            this.forceUpdate();
        },'wxPay_withdraw');
    }
    
    edit(){
        this.setState({edit:true});
    }
    back(){
        this.setState({edit:false});
    }
    render() {
        // let box=this.state.edit?(<EditBox back={this.back}/>):(<ShowBox edit={this.edit}/>);
        return (
            <ThemeProvider>
            <div>
                {/*<AppBar title={___.user}/>*/}
                <div style={sty.p}>
                    <ShowBox/>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}


class ForgetApp extends Component{
    resetSuccess(){
        W.alert(___.resset_success,function(){
            W.logout();
        });
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                {/*<AppBar title={___.forget_pwd}/>*/}
                <div style={sty.p}>
                    <Paper zDepth={1} style={sty.p}>
                        <Forget onSuccess={this.resetSuccess}/>
                    </Paper>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}


class ShowBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            userName:false
        }
        this.orderNum=0;
        this.orderNum_seller=0;
        this.reset = this.reset.bind(this);
        this.userName = this.userName.bind(this);
        this.close = this.close.bind(this);
        this.changeName = this.changeName.bind(this);
        this.saveName = this.saveName.bind(this);
        this.wallet = this.wallet.bind(this);
    }
    componentDidMount() {
        let flag=0;

        Wapi.booking.list(res=>{
            this.orderNum=res.total;
            flag++;
            if(flag==2){
                this.forceUpdate();
            }
        },{mobile:_user.mobile});

        let _sellerId=_user.employee?_user.employee.objectId:_user.customer.objectId;
        Wapi.booking.list(re=>{
            this.orderNum_seller=re.total;
            flag++;
            if(flag==2){
                this.forceUpdate();
            }
        },{sellerId:_sellerId});
    }
    

    reset(){
        thisView.goTo('./myAccount/forget.js');
    }

    userName(){
        this.setState({userName:true});
    }

    close(){
        this.setState({
            userName:false
        });
    }

    changeName(name){
        this._name=name;
    }
    saveName(){
        if(this._name){
            let that=this;
            Wapi.user.get(function(res){
                if(res.status_code==0){
                    W.alert(___.username_registed);
                }else{
                    Wapi.user.updateMe(function(re){
                        _user.username=that._name;
                        W.setSetting('user',_user);
                        that.close();
                    },{
                        username:that._name
                    });
                }
            },{
                username:that._name
            });
        }
    }

    personalInfo(){
        thisView.goTo('./myAccount/personal_info.js');
    }

    wallet(){
        thisView.goTo('./myAccount/wallet.js');
    }

    logout(){
        W.loading('正在退出');
        let key=getOpenIdKey();
        let wxId=_user.authData[key+'_wx'];//上次登录的公众号id
        if(wxId)
            W.logout('&logout=true&needOpenId=true&wx_app_id='+wxId);
        else
            W.logout('&logout=true&needOpenId=true');
    }
    recommend(){
        thisView.goTo('my_marketing.js');
    }

    systemSet(){
        thisView.goTo('./myAccount/system_set.js');
    }

    toBillList(){
        thisView.goTo('./myAccount/my_order.js');
    }
    render() {
        
        const actions = [
            <FlatButton
                label={___.cancel}
                primary={true}
                onTouchTap={this.close}
            />,
            <FlatButton
                label={___.ok}
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.saveName}
            />
        ];

        let forget=this.state.resetPwd?sty.p:Object.assign({},sty.p,{display:'none'});
        return (
            <div>
                <div 
                onClick={this.personalInfo}
                style={sty.head}>
                    <div style={{marginBottom:'10px',fontSize:'18px'}}>{_user.customer.name}</div>
                    <div style={{marginBottom:'10px'}}>{_user.employee && _user.employee.name}</div>
                    <div>{_user.mobile}</div>
                </div>
                <Divider/>
                <List>
                    {/*修改用户名*/}
                    {/*<ListItem primaryText={___.edit_user_name} leftIcon={<ActionAccountBox/>} onClick={this.userName}/>*/}
                    {/*修改密码*/}
                    {/*<ListItem primaryText={___.reset_pwd} leftIcon={<ActionLock/>} onClick={this.reset}/>*/}
                    {/*我的订单*/}
                    <ListItem 
                        primaryText={___.my_order} 
                        onClick={this.toBillList}
                        rightAvatar={<span style={{marginTop:'12px',marginRight:'30px'}}>{this.orderNum}</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                    {/*我的钱包*/}
                    <ListItem 
                        primaryText={___.my_wallet} 
                        onClick={this.wallet}
                        rightAvatar={<span style={{marginTop:'12px',marginRight:'30px'}}>{toMoneyFormat(_user.balance)}</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                    {/*推荐有礼*/}
                    <ListItem 
                        primaryText={___.recommend} 
                        onClick={this.recommend}
                        rightAvatar={<span style={{marginTop:'12px',marginRight:'30px'}}>{this.orderNum_seller}</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                    {/*系统设置*/}
                    <ListItem 
                        primaryText={___.system_set} 
                        onClick={this.systemSet}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                </List>
                <List style={{padding:'20px 16px 8px 16px',textAlign:'canter'}}>
                    <RaisedButton label={___.logout} fullWidth={true} secondary={true} style={sty.lo} onClick={this.logout}/>                    
                </List>
                <Dialog
                    title={___.edit_user_name}
                    open={this.state.userName}
                    actions={actions}
                >
                    <UserNameInput onChange={this.changeName} value={_user.userName} floatingLabelText={___.input_user_name}/>
                </Dialog>
            </div>
        );
    }
}

class EditBox extends Component {
    render() {
        return (
            <div>
                edit
            </div>
        );
    }
}


class Logo extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            completed:0
        }
        this.uploadLogo = this.uploadLogo.bind(this);
    }
    
    uploadLogo(){
        return;
        // let that=this;
        // let input=document.createElement('input');
        // input.type='file';
        // input.accept="image/*";
        // input.addEventListener('change',function(){
        //     let file=this.files[0];
        //     let type=file.type.split('/')[0];
        //     if(type!="image"){
        //         h.value="";
        //         h.files=null;
        //         W.alert(___.only_image);
        //         return;
        //     }
        //     Wapi.file.upload(function(res){
        //         if (res.status_code) {
        //             W.errorCode(res);
        //             return;
        //         }
        //         Wapi.user.update(function(){
        //             _user.logo=res.image_file_url;
        //             W.setSetting('user',_user);
        //             that.setState({'completed':0});
        //         },{
        //             _uid:_user.uid,
        //             logo:res.image_file_url
        //         });
        //     },file,(completed)=>that.setState({'completed':completed*100}));
        // });
        // input.click();
    }
    render() {
        let logo=_user.logo?(<Avatar src={_user.logo} onClick={this.uploadLogo} style={sty.limg}/>):
        (<ActionFace onClick={this.uploadLogo} style={sty.limg}/>);
        let progress=this.state.completed?<LinearProgress mode="determinate" value={this.state.completed}/>:null;
        return (
            <span {...this.props}>
                {logo}
                {progress}
            </span>
        );
    }
}


//工具方法 金额转字符
function toMoneyFormat(money){
    return money.toFixed(2);
}