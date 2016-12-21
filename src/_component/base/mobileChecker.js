import React, {Component} from 'react';

import VerificationCode from './verificationCode';
import TextField from 'material-ui/TextField';

class MobileChecker extends Component {
    render() {
        let mobile=this.props.mobile.toString();
        mobile=mobile.replace(mobile.slice(-8,-4),'****');
        return (
            <div>
                <TextField 
                    disabled={true}
                    defaultValue={mobile}
                    fullWidth={true}
                    name='mobile'
                />
                <VerificationCode 
                    name='valid_code'
                    type={1}
                    account={this.props.mobile} 
                    onSuccess={this.props.onSuccess}
                />
            </div>
        );
    }
}

export default MobileChecker;