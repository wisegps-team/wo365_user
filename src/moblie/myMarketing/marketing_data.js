//我的营销>营销资料
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../../_theme/default';
import AppBar from '../../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Card from 'material-ui/Card';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('bind_count.js',2);
    thisView.prefetch('scan_count.js',2);
});

const styles = {
    main:{paddingTop:'50px',paddingBottom:'20px'},
    card:{margin:'1em',padding:'0px 0.5em 0.5em'},
    count:{marginRight:'1em'},
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

let qrLinks=[
    {
        name:'一个二维码',
        act:'806314613238009900',
        sellerId:'001',
        url:'http://www.baidu.com',
        bind:10,
        scan:9,
    },{
        name:'二个二维码',
        act:'805974631000444900',
        sellerId:'002',
        url:'http://www.qq.com',
        bind:10,
        scan:9,
    },{
        name:'三个二维码',
        act:'803863722111144000',
        sellerId:'003',
        url:'http://www.sina.com',
        bind:10,
        scan:9,
    },
]
class App extends Component {
    constructor(props,context){
        super(props,context);
        this.activity={};
        this.data=[];
        this.getData = this.getData.bind(this);
        this.bindCount = this.bindCount.bind(this);
        this.scanToBind = this.scanToBind.bind(this);
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            this.activity=e.params;
            this.getData();
        });
    }
    getData(){
        this.data=qrLinks;
        this.forceUpdate();
    }
    bindCount(data){
        thisView.goTo('bind_count.js',data);
    }
    scanCount(data){
        thisView.goTo('scan_count.js',data.act);
    }
    scanToBind(){
        console.log('scan to bind');
    }
    render() {
        let items=this.data.map((ele,i)=>
            <Card key={i} style={styles.card}>
                <div style={{padding:'10px 0px'}}>{ele.name}</div>
                <div>
                    <span onClick={()=>this.bindCount(ele)}>{'绑定数 '+ele.bind}</span>
                    <span onClick={()=>this.scanCount(ele)} style={{marginLeft:'1em'}}>{'扫描统计 '+ele.scan}</span>
                </div>
            </Card>
        )
        return (
            <ThemeProvider>
            <div>
                <AppBar 
                    title={___.act_data} 
                    style={{position:'fixed',top:'0px'}}
                    iconElementRight={<IconButton onClick={this.scanToBind}><ContentAdd/></IconButton>}
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
