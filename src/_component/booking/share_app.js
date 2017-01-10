import React, {Component} from 'react';

import AppBox from './app_box';

//提醒预订人分享给车主
class ShareApp extends Component {
    constructor(props, context) {
        super(props, context);
        W.native=true
        this.state={
            action:(W.native?1:0)
        };
    }
    componentDidMount() {
        if(this.state.action==0)
            window.addEventListener('nativeSdkReady',()=>this.setState({action:1}));
        var tit=_g.name+'为您预订了一个产品';
        var __url='http://'+WiStorm.config.domain.user+'/?location=%2Fautogps%2Fbooking.html&intent=logout&needOpenId=true&bookingId='+_g.bookingId+'&wx_app_id='+_g.wxAppKey+'&name='+_g.name;
        let setShare=function(){
            var op={
                title: tit, // 分享标题
                desc: '点击进入选择安装网点', // 分享描述
                link: __url, // 分享链接
                imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
                success: function(){},
                cancel: function(){}
            }
            wx.onMenuShareTimeline(op);
            wx.onMenuShareAppMessage(op);
        }
        if(W.native)setShare();
        else window.addEventListener('nativeSdkReady',setShare);
    }
    
    render() {
        let content=this.state.action?(<div>
            <p key="p" style={{textAlign:'center'}}>
                {'将此页面分享给'+_g.userName}<br/>
                好友即可获取预订信息
            </p>
            <img src='img/shareTo.jpg' key="img" style={{width:'100%'}}/>
        </div>):"正在准备分享";
        return (
            <AppBox>
                {content}
            </AppBox>
        );
    }
}

export default ShareApp;