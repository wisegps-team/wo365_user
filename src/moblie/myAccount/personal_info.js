import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionFace from 'material-ui/svg-icons/action/face';
import LinearProgress from 'material-ui/LinearProgress';

import AppBar from '../../_component/base/appBar';
import {setTitle,getOpenIdKey} from '../../_modules/tool';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import UserNameInput from '../../_component/base/userNameInput';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.personal_info);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


const sty={
    appbar:{
        position:'fixed',
        top:'0px'
    },
    p:{
        // padding: '10px',
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
    list_item:{
        borderBottom:'1px solid #dddddd'
    },
    list_right:{
        marginTop:'12px',
        marginRight:'30px'
    },
}

class App extends Component {
    render() {
        return (
            <ThemeProvider>
            <div>
                {/*<AppBar title={___.personal_info}/>*/}
                <div style={sty.p}>
                    <ShowBox/>
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
        this.userName = this.userName.bind(this);
        this.close = this.close.bind(this);
        this.changeName = this.changeName.bind(this);
        this.saveName = this.saveName.bind(this);
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

    logout(){
        W.loading('正在退出');
        let key=getOpenIdKey();
        let wxId=_user.authData[key+'_wx'];//上次登录的公众号id
        if(wxId)
            W.logout('&logout=true&needOpenId=true&wx_app_id='+wxId);
        else
            W.logout('&logout=true&needOpenId=true');
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
        let company_item='';
        if(_user.customer.custTypeId!=7){
            company_item=<ListItem 
                    primaryText={___.company}
                    rightAvatar={<span style={sty.list_right}>{_user.customer.name}</span>}
                    style={sty.list_item}
                />;
        }
        
        return (
            <div>
                <List>
                    {company_item}
                    <ListItem 
                        primaryText={___.mobile_phone}
						rightAvatar={<span style={sty.list_right}>{_user.mobile}</span>}
                        style={sty.list_item}
                    />
                    <ListItem 
                        primaryText={___.person_name}
						rightAvatar={<span style={sty.list_right}>{_user.employee?_user.employee.name:_user.customer.contact}</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={sty.list_item}
                        onClick={this.userName}
                    />
                    <ListItem 
                        primaryText={___.sex} 
						rightAvatar={<span style={sty.list_right}>{_user.customer.sex==1?"男":"女"}</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={sty.list_item}
                    />
                    {/*<ListItem 
                        primaryText={___.logined_bind}
                        rightIcon={<NavigationChevronRight />}
                        style={sty.list_item}
                    />*/}
                </List>
                <List style={{padding:'20px 16px 8px 16px',textAlign:'canter'}}>
                    <RaisedButton label={___.logout} fullWidth={true} secondary={true} onClick={this.logout} style={{minWidth:'100%'}}/>                    
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
