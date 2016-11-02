import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Avatar from 'material-ui/Avatar';
import ActionLock from 'material-ui/svg-icons/action/lock';
import ActionFace from 'material-ui/svg-icons/action/face';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

import Forget from '../_component/login/forget';
import UserNameInput from '../_component/base/userNameInput';
import AppBar from '../_component/base/appBar';

import Dialog from 'material-ui/Dialog';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    let view=thisView.prefetch('#forget',3);
    ReactDOM.render(<ForgetApp/>,view);
});

const sty={
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
    }
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
    
    edit(){
        this.setState({edit:true});
    }
    back(){
        this.setState({edit:false});
    }
    render() {
        let box=this.state.edit?(<EditBox back={this.back}/>):(<ShowBox edit={this.edit}/>);
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.my_account}/>
                <div style={sty.p}>
                    {box}
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
                <AppBar title={___.forget_pwd}/>
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
        this.reset = this.reset.bind(this);
        this.userName = this.userName.bind(this);
        this.close = this.close.bind(this);
        this.changeName = this.changeName.bind(this);
        this.saveName = this.saveName.bind(this);
    }

    reset(){
        // this.setState({resetPwd:true});
        thisView.goTo('#forget');
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
            Wapi.user.updateMe(function(res){
                _user.username=that._name;
                W.setSetting('user',_user);
                that.close();
            },{
                username:this._name
            })
        }
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
            <Paper zDepth={1} style={sty.p}>
                <List>
                    <ListItem
                        primaryText={_user.username}
                        leftAvatar={<Logo style={sty.logo}/>}
                        secondaryText={_user.mobile}
                    />
                </List>
                <Divider/>
                <List>
                    <ListItem primaryText={___.edit_user_name} leftIcon={<ActionAccountBox/>} onClick={this.userName}/>
                    <ListItem primaryText={___.reset_pwd} leftIcon={<ActionLock/>} onClick={this.reset}/>
                </List>
                <Divider/>
                <List style={{padding:'20px 16px 8px 16px',textAlign:'canter'}}>
                    <RaisedButton label={___.logout} fullWidth={true} secondary={true} style={sty.lo} onClick={W.logout}/>                    
                </List>
                <Dialog
                    title={___.edit_user_name}
                    open={this.state.userName}
                    actions={actions}
                >
                    <UserNameInput onChange={this.changeName} value={_user.userName} floatingLabelText={___.input_user_name}/>
                </Dialog>
            </Paper>
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
        let that=this;
        let input=document.createElement('input');
        input.type='file';
        input.accept="image/*";
        input.addEventListener('change',function(){
            let file=this.files[0];
            let type=file.type.split('/')[0];
            if(type!="image"){
                h.value="";
                h.files=null;
                W.alert(___.only_image);
                return;
            }
            Wapi.file.upload(function(res){
                if (res.status_code) {
                    W.errorCode(res);
                    return;
                }
                Wapi.user.update(function(){
                    _user.logo=res.image_file_url;
                    W.setSetting('user',_user);
                    that.setState({'completed':0});
                },{
                    _uid:_user.uid,
                    logo:res.image_file_url
                });
            },file,(completed)=>that.setState({'completed':completed*100}));
        });
        input.click();
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