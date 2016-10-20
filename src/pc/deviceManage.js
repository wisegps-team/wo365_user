import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import STORE from '../_reducers/main';

import AppBar from 'material-ui/AppBar';
import {ThemeProvider} from '../_theme/default';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import APP from '../_component/pc/app';
import Page from '../_component/base/page';


window.addEventListener('load',function(){
    ReactDOM.render(
            <App/>
        ,W('#APP'));
});

const styles={
    table_height:window.innerHeight-180,//应当对数据进行分页处理，所以表格高度需要限制，下方留出空位放页码，放上下页按钮
}

let _device={
    model:'w13',
    did:'123456',
    activedIn:'2016-08-15',
    carNum:'粤B23333',
    bindDate:'2016-08-16',
    status:0,
}
let _devices=[];
for(let i=0;i<22;i++){
    let device=Object.assign({},_device);
    device.did+=i;
    _devices[i]=device;
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            devices:[],

            limit:10,
            page_no:1,
            total_page:0,
        }
        this.changePage=this.changePage.bind(this);
    }

    componentDidMount(){
        Wapi.device.list(res=>{
            if(res.data.length>0){
                this.setState({
                    devices:res.data,
                    total_page:Math.ceil(res.total/this.state.limit),
                });
            }
        },{
            uid:_user.customer.objectId,
        },{
            limit:this.state.limit,
        });

        //测试用数据
        // this.setState({
        //     devices:_devices.slice(0,this.state.limit),
        //     total_page:Math.ceil(_devices.length/this.state.limit)
        // });
    }
    changePage(no){
        Wapi.device.list(res=>{
            if(res.data.length>0){
                this.setState({
                    devices:res.data,
                    page_no:no,
                });
            }
        },{
            uid:_user.customer.objectId
        },{
            limit:this.state.limit,
            page_no:no,
        });
        
        //测试用数据
        // this.setState({
        //     devices:_devices.slice(this.state.limit*(no-1),this.state.limit*no),
        //     page_no:no
        // });
    }

    render() {
        let deviceItems = this.state.devices.map(ele=>{
            let isOnline=___.offline;
            let rcvTime='--';
            if(ele.activeGpsData&&ele.activeGpsData.rcvTime){
                let t=W.date(ele.activeGpsData.rcvTime);
                isOnline=((new Date()-t)/1000/60<10)?___.online:___.offline;
                rcvTime=W.dateToString(t);
            }
            let version=ele.params?ele.params.version:'--';
            return (<TableRow key={ele.did}>
                <TableRowColumn>{ele.model}</TableRowColumn>
                <TableRowColumn>{ele.did}</TableRowColumn>
                <TableRowColumn>{ele.vehicleName}</TableRowColumn>
                <TableRowColumn>{version}</TableRowColumn>
                <TableRowColumn>{rcvTime}</TableRowColumn>
                <TableRowColumn>{isOnline}</TableRowColumn>
            </TableRow>)
        });
        return (
            <APP leftBar={false}>
                <div style={{marginLeft:'25px',marginRight:'25px'}} >
                    <Table fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>{___.device_type}</TableHeaderColumn>
                                <TableHeaderColumn>{___.device_id}</TableHeaderColumn>
                                <TableHeaderColumn>{___.carNum}</TableHeaderColumn>
                                <TableHeaderColumn>{___.device_version}</TableHeaderColumn>
                                <TableHeaderColumn>{___.rcv_time}</TableHeaderColumn>
                                <TableHeaderColumn>{___.device_status}</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} stripedRows={true}>
                            {deviceItems}
                        </TableBody>
                    </Table>
                    <Page curPage={this.state.page_no} totalPage={this.state.total_page} changePage={this.changePage} />
                </div>
            </APP>
        );
    }
}
