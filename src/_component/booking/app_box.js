import React, {Component} from 'react';

import {ThemeProvider} from '../../_theme/default';

const sty={
    vp:{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        padding: '0 1em'
    }
}

class AppBox extends Component {
    render() {
        return (
            <ThemeProvider>
                <div style={sty.vp}>
                    {this.props.children}
                </div>
            </ThemeProvider>
        );
    }
}

export default AppBox;