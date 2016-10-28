import React from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import AddCar from '../_component/add_car';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


const styles={
    main:{paddingTop:'50px'},
}

class App extends React.Component{
    constructor(props,context){
        super(props,context);

        this.cancel=this.cancel.bind(this);
    }
    getChildContext() {
        return {
            view:thisView
        };
    }

    cancel(){
        history.back();
    }
    success(data){
        thisView.postMessage(thisView.getCreater(),'add_car');
        this.cancel();
    }
    
    render(){
        return(
            <ThemeProvider>
                <AppBar 
                    style={{position:'fixed',top:'0px'}}
                    title={___.add_car}
                    iconElementLeft={<IconButton onClick={this.cancel}><NavigationArrowBack/></IconButton>}
                />
                <div style={styles.main}>
                    <AddCar success={this.success} cancel={this.cancel}/>
                </div>
            </ThemeProvider>
        )
    }
}
App.childContextTypes = {
    view: React.PropTypes.object
};
