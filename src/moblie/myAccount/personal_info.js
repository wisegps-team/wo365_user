import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

import {List, ListItem} from 'material-ui/List';

import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionFace from 'material-ui/svg-icons/action/face';
import LinearProgress from 'material-ui/LinearProgress';

import AppBar from '../../_component/base/appBar';
import {setTitle} from '../../_modules/tool';


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
		
    }
	
    render() {
        let company_item='';
        if(_user.customer.custTypeId!=7){
            company_item=<ListItem 
                    primaryText={___.company}
                    rightAvatar={<span style={sty.list_right}>{_user.customer.name}</span>}
                    rightIcon={<NavigationChevronRight />}
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
                        rightIcon={<NavigationChevronRight />}
                        style={sty.list_item}
                    />
                    <ListItem 
                        primaryText={___.person_name}
						rightAvatar={<span style={sty.list_right}>{_user.employee?_user.employee.name:_user.customer.contact}</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={sty.list_item}
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
            </div>
        );
    }
}
