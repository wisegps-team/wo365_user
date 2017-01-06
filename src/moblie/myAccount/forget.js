import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

import Paper from 'material-ui/Paper';

import AppBar from '../../_component/base/appBar';
import Forget from '../../_component/login/forget';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<ForgetApp/>,thisView);
});

const sty={
    p:{
        padding: '10px',
    },
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