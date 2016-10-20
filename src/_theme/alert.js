import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

const sty={
    position:'fixed',
    width: '100vw',
    height: '100vh',
    background: 'rgba(255,255,255,0.5)',
    top: '0px',
    zIndex: '2000'
}

const con={
    wordBreak: 'break-all'
}

class Alert extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            title:___.app_name,
            alert:'默认文本',
            confirm:'带取消的确认框',
            prompt:'带输入框的确认框',
            defaultValue:'',
            toast:'5秒隐藏框',
            loading_text:'',
            callback:null,
            alert_open:false,
            confirm_open:false,
            prompt_open:false,
            toast_open:false,
            loading_open:false
        }
        this.queue=[];
        this.handleClose = this.handleClose.bind(this);
        this.toastClose = this.toastClose.bind(this);
        this.ok = this.ok.bind(this);
        this.cancel = this.cancel.bind(this);
        window.W.alert=this.alert = this.alert.bind(this);
        window.W.confirm=this.confirm = this.confirm.bind(this);
        window.W.prompt=this.prompt = this.prompt.bind(this);
        window.W.toast=this.toast = this.toast.bind(this);
        window.W.loading=this.loading = this.loading.bind(this);
    }

    _setState(newState){
        if(this.state.alert_open||this.state.confirm_open||this.state.prompt_open){
            //如果当前正在展示，则存入队列等待
            this.queue.push(newState);
        }else{
            this.setState(newState);
        }
    }

    handleClose(ok){
        let newState={
            title:___.app_name,            
            alert:'',
            confirm:'',
            prompt:'',
            defaultValue:null,
            callback:null,
            alert_open:false,
            confirm_open:false,
            prompt_open:false
        };
        if(this.state.callback){
            var params;
            if(this.state.confirm_open)
                params=ok?true:false;
            else if(this.state.prompt_open)
                params=ok?this.value:null;
            this.state.callback(params);
        }
        this.value=null;
        this.setState(newState);        
        if(this.queue.length){
            setTimeout(()=>this.setState(this.queue.shift()),500);
        }  
    };

    alert(text,callback){
        let newState={};
        if(typeof text!='object'){
            newState.alert=text;
        }else{
            newState.alert=text.text;
            newState.title=text.title;
        }
        newState.callback=callback;
        newState.alert_open=true;
        this._setState(newState);       
    }
    confirm(text,callback){
        let newState={};
        if(typeof text!='object'){
            newState.confirm=text;
        }else{
            newState.confirm=text.text;
            newState.title=text.title;
        }
        newState.callback=callback;
        newState.confirm_open=true;        
        this._setState(newState);       
    }
    prompt(text,defaultValue,callback){
        let newState={};
        if(typeof text!='object'){
            newState.prompt=text;
        }else{
            newState.prompt=text.text;
            newState.title=text.title;
            newState.defaultValue=text.defaultValue;
        }
        newState.callback=callback;
        newState.prompt_open=true;        
        this._setState(newState);       
    }
    toast(text){
        this.setState({toast_open:true,toast:text});
    }
    toastClose(){
        this.setState({toast_open:false});        
    }

    loading(loading_open,loading_text){
        this.setState({loading_open,loading_text});
    }

    ok(){
        this.handleClose(true);
    }
    cancel(){
        this.handleClose(false);
    }
    
    render() {
        const actions = [
            <FlatButton
                label={___.cancel}
                primary={true}
                onClick={this.cancel}
            />,
            <FlatButton
                label={___.ok}
                primary={true}
                onClick={this.ok}
            />
        ];
        let divS=Object.assign({display:this.state.loading_open?'block':'none'},sty);
        return (
            <div>
                <Dialog
                    key='alert'
                    title={this.state.title}
                    actions={<FlatButton
                        label={___.ok}
                        primary={true}
                        onClick={this.cancel}
                    />}
                    open={this.state.alert_open}
                    contentStyle={con}
                >
                    {this.state.alert}
                </Dialog>
                <Dialog
                    key='confirm'                    
                    title={this.state.title}
                    actions={actions}
                    open={this.state.confirm_open}
                    contentStyle={con}
                >
                    {this.state.confirm}
                </Dialog>
                <Dialog
                    key='prompt'
                    title={this.state.title}
                    actions={actions}
                    open={this.state.prompt_open}
                    contentStyle={con}
                >
                    {this.state.prompt}                    
                    <TextField
                        name={'prompt'}
                        defaultValue={this.state.defaultValue}
                        fullWidth={true}
                        onChange={(ae,val)=>this.value=val}
                    />
                </Dialog>
                <Snackbar
                    open={this.state.toast_open}
                    message={this.state.toast}
                    action={___.close}
                    autoHideDuration={5000}
                    onRequestClose={this.toastClose}
                />
                <div style={divS}>
                    <div className="loader">
                        <div></div>
                        <div></div>
                        <div></div>
                        <span>{this.state.loading_text}</span>
                    </div>
                </div>
            </div>
        );
    }
}

function ALERT(ThemeProvider){
    if(document.body){
        if(!window.W.alert){
            injectTapEventPlugin();
            let view=document.createElement('div');
            view.id='_k_alert';
            document.body.appendChild(view);
            ReactDOM.render(
                <ThemeProvider>
                    <Alert/>
                </ThemeProvider>
                ,view);
        }
    }else{
        window.addEventListener('load',function(){
            ALERT(ThemeProvider);
        });
    }
    
}



export default ALERT;