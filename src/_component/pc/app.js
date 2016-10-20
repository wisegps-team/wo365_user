import React, {Component} from 'react';
import {ThemeProvider} from '../../_theme/default';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

import MyAccount from '../my_account';
import CompanyInfo from '../company_info';
import SonPage from '../base/sonPage';

require('../../_sass/pc_index.scss');

const drawer={
    openSecondary:false
}

const navigation=[
    {
        href:WiStorm.root+'src/pc/home.html',
        name:___.car_monitor
    },
    {
        href:WiStorm.root+'src/pc/carManage.html',
        name:___.car_manage
    },
    {
        href:WiStorm.root+'src/pc/deviceManage.html',
        name:___.device_manage
    },
    {
        href:WiStorm.root+'src/pc/reportManage.html',
        name:___.report_manage
    }
]
const item=[
    {
        href:WiStorm.root+'src/pc/employeeManage.html',
        name:___.employee_manage,
    },
    // {
    //     href:'#',
    //     name:'角色定义'
    // }
]

class APP extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            left:true
        }
        this.state.left=(typeof props.leftBar=='boolean')?props.leftBar:true;
        this.handleLeft = this.handleLeft.bind(this);
    }
    
    getChildrenContext(){
        return{
            handleLeftBar:this.handleLeft
        };
    }

    handleLeft(b){
        let left=(typeof b=='Boolean')?b:!this.state.left;
        this.setState({left});
    }
    render() {
        
        let header=WiStorm.agent.mobile?(<HeaderMobile handleLeft={this.handleLeft}/>):(<Header handleLeft={this.handleLeft}/>);
        let leftBar=this.props.leftContent?(<SonPage 
                        open={this.state.left} 
                        back={this.handleLeft}
                        drawer={drawer}
                    >
                        {this.props.leftContent}
                    </SonPage>):null;
        let main=(leftBar&&this.state.left&&!WiStorm.agent.mobile)?{paddingLeft:'300px'}:null;
        return (
            <ThemeProvider>
                <div>
                    {header}
                    <div id="main">
                        {leftBar}
                        <div className="main_R" style={main}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}
APP.childContextTypes = {
    handleLeft:React.PropTypes.func,
};

export default APP;

const sty={
    iconStyle:{
        fill:"#FFF"
    },
    app:{
        position: 'fixed'
    },
    p:{
        padding: '10px',
    },
    icon:{
        fill:'#fff',
        height:'50px',
        display: 'table',
        margin:'-1px 12px 0 12px',
        cursor:'pointer'
    },
    more:{
        marginTop:'1px',
        height:'50px'
    }
}

class Header extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            openMenu:false,
            moreMenu:false,
            account_open:false,
            info_open:false
        };

        this.handleOnRequestChange = this.handleOnRequestChange.bind(this);
        this.handleOpenMenu = this.handleOpenMenu.bind(this);
        this.handleAccount = this.handleAccount.bind(this);
        this.handleInfo = this.handleInfo.bind(this);
        this.handleMoreMenu = this.handleMoreMenu.bind(this);
    }

    handleOpenMenu(){
        this.setState({
            openMenu: true,
        });
    }

    handleOnRequestChange(value){
        this.setState({
            openMenu:false,
        });
    }

    handleAccount(){
        this.setState({account_open:!this.state.account_open});
    }
    handleInfo(){
        this.setState({info_open:!this.state.info_open});
    }
    handleMoreMenu(){
        if(this._time)return;
        this._time=true;
        setTimeout(()=>this._time=false,500);
        this.setState({moreMenu:!this.state.moreMenu});
    }

    render() {
        let Navigations=navigation.map((ele,i)=>(<span key={i}><a href={ele.href}>{ele.name}</a></span>));
        let NavigationItems=item.map((ele,i)=>(<MenuItem  key={i} primaryText={ele.name} href={ele.href} />));
        let more=(
                    <IconMenu
                        iconButtonElement={<IconButton onClick={this.handleMoreMenu}><MoreVertIcon /></IconButton>}
                        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        iconStyle={sty.iconStyle}
                        style={sty.more}
                        open={this.state.moreMenu}
                        onRequestChange={this.handleMoreMenu}
                    >
                        {NavigationItems}
                    </IconMenu>
                );
        return (
            <AppBar 
                style={sty.app} 
                title={___.app_name}
                iconElementLeft={<NavigationMenu onClick={this.props.handleLeft} style={sty.icon}/>}
            >
                <div className="top_Mid">
                    {Navigations}
                    {more}
                </div>
                <div className="top_R">
                    <span>
                        <span onClick={this.handleOpenMenu}>{_user.mobile}</span>
                            <IconMenu
                                iconButtonElement={<IconButton><div>{_user.mobile}</div></IconButton>}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}                        
                                open={this.state.openMenu}
                                style={{width:"0px"}}
                                onRequestChange={this.handleOnRequestChange}
                            >
                                <MenuItem value="1" primaryText={___.my_account} onClick={this.handleAccount}/>
                                <MenuItem value="2" primaryText={___.company_info} onClick={this.handleInfo}/>                           
                            </IconMenu>                           
                        </span>
                    <span onClick={W.logout}>{___.logout}</span>
                </div>
                <SonPage open={this.state.account_open} back={this.handleAccount}>
                    <MyAccount/>
                </SonPage>
                <SonPage open={this.state.info_open} back={this.handleInfo}>
                    <CompanyInfo/>
                </SonPage>
            </AppBar>
        );
    }
}

class HeaderMobile extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            menu:false
        }
        this.handleMenu = this.handleMenu.bind(this);
    }

    handleMenu(){
        this.setState({menu:!this.state.menu});
    }
    
    render() {
        let Navigations=navigation.map((ele,i)=>(<ListItem key={i}><a href={ele.href}>{ele.name}</a></ListItem>));
        let NavigationItems=item.map((ele,i)=>(<ListItem key={i}><a href={ele.href}>{ele.name}</a></ListItem>));
        return (
            <AppBar 
                style={sty.app} 
                title={___.app_name}
                onLeftIconButtonTouchTap={this.props.handleLeft}
                iconElementRight={<IconButton onClick={this.handleMenu}><MoreVertIcon/></IconButton>}
            >
                <Drawer 
                    width={200} 
                    openSecondary={true} 
                    open={this.state.menu} 
                    docked={false}
                    onRequestChange={this.handleMenu}
                >
                    <AppBar iconElementLeft={<span/>}/>
                    <List>
                        {Navigations}
                    </List>
                    <Divider/>
                    <List>
                        {NavigationItems}
                    </List>
                </Drawer>
            </AppBar>
        );
    }
}