import React, {Component} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const sty={
    position: 'fixed',
    bottom: '1em',
    right: '1em',
    zIndex:2000
}

class Fab extends Component {
    render() {
        let _sty=sty;
        if(this.props.sty)Object.assign(sty,this.props.sty);
        return (
            <FloatingActionButton secondary={true} style={_sty} {...this.props}>
                <ContentAdd />
            </FloatingActionButton>
        );
    }
}

export default Fab;