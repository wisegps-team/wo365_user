"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';

import {ThemeProvider} from './_theme/default';
import FlatButton from 'material-ui/FlatButton';

import Register from './_component/login/register';

require('./_sass/index.scss');//包含css

window.addEventListener('load',function(){
    ReactDOM.render(<App/>,W('#main'));
});


class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.registerCallback = this.registerCallback.bind(this);
    }
    registerCallback(res){
        if(!res._code){
            W.alert(___.register_success,()=>location='index.html');
        }else{
            switch (res._code) {
                case 1:
                    W.confirm(___.account_error,b=>b?location='index.html?intent=forget':null);
                    break;
                case 2:
                    W.confirm(___.account_error,b=>b?location='index.html?intent=forget':0);
                    break;
                default:
                    W.alert(___.unknown_err);
                    break;
            }
        }
    }

    render() {
        return (
            <ThemeProvider>
                <div className='login' style={{padding:'10px 10%'}}>
                    <Register onSuccess={this.registerCallback}/>
                    <div style={{
                        textAlign: 'right',
                        marginTop: '10px'
                        }}
                    >
                        <FlatButton label={___.login} primary={true} onClick={()=>location.href='index.html'}/>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}