import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';

class Appbar extends Component {
    back(){
        history.back();
    }
    render() {
        return (
            <AppBar
                title={___.app_name}
                iconElementLeft={<IconButton onClick={this.back}><NavigationArrowBack/></IconButton>}
                {...this.props}
            />
        );
    }
}

export default Appbar;