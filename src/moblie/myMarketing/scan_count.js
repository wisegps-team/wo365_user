//我的营销>营销资料
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../../_theme/default';
import AppBar from '../../_component/base/appBar';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const styles = {
    main:{paddingTop:'50px',paddingBottom:'20px'},
    card:{margin:'10px',padding:'0px 10px 10px',borderBottom:'1px solid #cccccc'},
    count:{marginRight:'1em'},
    span:{marginRight:'1em'},
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.data=[];
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            if(e.params){
                console.log('show scan count, act = '+e.params);
            }
        });
        this.data=[1,2,3,4,5];
        this.forceUpdate();
    }
    render() {
        let items=this.data.map((ele,i)=>
            <div key={i} style={styles.card}>
                <span style={styles.span}>用户{i+1}</span>
                <span style={styles.span}>扫描时间{i+1}</span>
            </div>
        );
        return (
            <ThemeProvider>
            <div>
                <AppBar 
                    title={___.scan_count} 
                    style={{position:'fixed',top:'0px'}}
                />
                <div style={styles.main}>
                    {items}
                </div>
            </div>
            </ThemeProvider>
        );
    }
}
export default App;

