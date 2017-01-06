import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

import {List, ListItem} from 'material-ui/List';

import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionFace from 'material-ui/svg-icons/action/face';
import LinearProgress from 'material-ui/LinearProgress';

import AppBar from '../../_component/base/appBar';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    appbar:{
        position:'fixed',
        top:'0px'
    },
    p:{
        padding: '10px',
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
}

class App extends Component {
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.personal_info}/>
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
		
    }
	
    render() {
        
        return (
            <div>
                <List>
                    <ListItem 
                        primaryText={___.person_name}
						rightAvatar={<span style={{marginTop:'12px',marginRight:'30px'}}>{_user.employee?_user.employee.name:_user.customer.contact}</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                    <ListItem 
                        primaryText={___.sex} 
						rightAvatar={<span style={{marginTop:'12px',marginRight:'30px'}}>{_user.customer.sex==1?"男":"女"}</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                    <ListItem 
                        primaryText={___.logined_bind}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                </List>
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
