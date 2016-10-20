import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {orange900,orange200,orange500,blue500,blue100,blue50} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import ALERT from './alert';




const muiTheme = getMuiTheme({
    fontFamily: '微软雅黑',
    palette: {
        primary1Color: blue500,
        primary2Color: blue100,
        primary3Color: blue50,
        accent1Color: orange500,
        accent2Color: orange200,
        accent3Color: orange900,
    },   
    appBar: {
        height: 50
    }
});

export class ThemeProvider  extends React.Component {
    getChildContext() {
        return {'muiTheme': this.props.muiTheme};
    }
    render(){
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        );
    }
}
ThemeProvider.childContextTypes = {
    muiTheme: React.PropTypes.object,
};

ALERT(ThemeProvider);//弹出框
export default ThemeProvider;