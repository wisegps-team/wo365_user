import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {List, ListItem, MakeSelectable} from 'material-ui/List';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import {Table, TableBody, TableHeader,TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import WTable from '../_component/table';
import APP from '../_component/pc/app';
import Input from '../_component/base/input';
import Page from '../_component/base/page';
import CarSearch from '../_component/car_search';

let SelectableList = MakeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends React.Component {
    constructor(props,context){
        super(props,context);
        this.state={
            selectedIndex:'history'
        };
        this.handleRequestChange=this.handleRequestChange.bind(this);
    }

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange(event, index){
      this.setState({
        selectedIndex: index,
      });
      this.props.onChange(index);
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);

window.addEventListener('load',function(){
    ReactDOM.render(
            <App/>
        ,W('#APP'));
});
const styles={
    table_height:window.innerHeight-280,//应当对数据进行分页处理，所以表格高度需要限制，下方留出空位放页码，放上下页按钮
    main:{padding:'0px 20px'},
    empty:{},
    input_margin:{marginLeft:'1em',height:'3em'},
    table_cell:{display:'table-cell'},
    Table_cells:{paddingLeft:'36px'},
    page:{width:'100%',display:'block',textAlign:'center',paddingTop:'10px'},
    page_margin:{fontSize:'0.8em',marginLeft:'1em',marginRight:'1em'},
}

const _types=[//报警报表中的选择框的选项
    {id:'<>12290',desc:___.all_type},
    {id:'12293',desc:___.alarm_alert},
    {id:'12295||12296',desc:___.fence_alert},
    {id:'12289',desc:___.sos_alert},
];

let IOT_ALERT=[
    {str:___.ALERT_SOS,code:0x3001},       //紧急报警
    {str:___.ALERT_OVERSPEED,code:0x3002}, //超速报警
    {str:___.ALERT_VIRBRATE,code:0x3003},  //震动报警
    {str:___.ALERT_MOVE,code:0x3004},      //移动报警
    {str:___.ALERT_ALARM,code:0x3005},      //报警器报警
    {str:___.ALERT_INVALIDRUN,code:0x3006},  //非法行驶报警
    {str:___.ALERT_ENTERGEO,code:0x3007},    //进区域报警
    {str:___.ALERT_EXITGEO,code:0x3008},     //出区域报警
    {str:___.ALERT_CUTPOWER,code:0x3009},    //断电报警
    {str:___.ALERT_LOWPOWER,code:0x300A},    //低电压报警
    {str:___.ALERT_GPSCUT,code:0x300B},      //GPS天线断线报警
    {str:___.ALERT_OVERDRIVE,code:0x300C},   //疲劳驾驶报警
    {str:___.ALERT_INVALIDACC,code:0x300D},  //非法点火报警
    {str:___.ALERT_INVALIDDOOR,code:0x300E},  //非法开门报警
];
function codeToStr(code){
    return IOT_ALERT.filter(ele=>ele.code==code)[0].str;
}

let _devices=[];//当前objectId下的所有设备在App的componentDidMout中获取赋值

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        const yesterday=new Date();
        yesterday.setDate(yesterday.getDate()-1);
        yesterday.setHours(0,0,0,0);
        const today=new Date();
        today.setHours(0,0,0,0);
        this.state={
            reports:'history',
            // user_name:'',
            alert_type:'<>12290',
            car_num:'',
            start_time:W.dateToString(yesterday),
            end_time:W.dateToString(today),
        };

        this.filterSubmit=this.filterSubmit.bind(this);
        this.changeReports=this.changeReports.bind(this);
    }
    changeReports(re){
        this.setState({
            reports:re
        });
    }
    componentDidMount(){
        Wapi.device.list(res=>{
            if(res.total==0)return;
            _devices=res.data;
            this.forceUpdate();
        },{
            uid:_user.customer.objectId
        },{
            fields:'did,vehicleName',
        });
    }

    filterSubmit(data){
        this.setState({
            //user_name:data.user_name,
            alert_type:data.alert_type,
            car_num:data.car_num,
            start_time:data.start_time,
            end_time:data.end_time
        });
    }
    render() {
        let left=<SelectableList defaultValue={this.state.reports} onChange={this.changeReports}>
                    <ListItem value={'history'} primaryText={___.history_record} />
                    <ListItem value={'alert'} primaryText={___.alert_record} />
                    <ListItem value={'speed'} primaryText={___.over_speed_record} />
                </SelectableList>
        let records;
        let _params={
            //user_name:this.state.user_name,
            alert_type:this.state.alert_type,
            car_num:this.state.car_num,
            start_time:this.state.start_time,
            end_time:this.state.end_time
        };
        switch(this.state.reports){
            case 'history':
                records=<HistoryReports params={_params}/>;
                break;
            case 'alert':
                records=<AlertReports params={_params}/>;
                break;
            case 'speed':
                records=<SpeedReports params={_params}/>;
                break;
            default:
                break;
        }
        return (
            <APP leftContent={left}>
                <div style={styles.main}>
                    <Filters reports={this.state.reports} params={_params} submit={this.filterSubmit}/>
                    {records}
                </div>
            </APP>
        );
    }
}

class Filters extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            //user_name:'',
            alert_type:'<>12290',
            car_num:'',
            start_date:new Date(),
            start_hour:new Date(),
            end_date:new Date(),
            end_hour:new Date(),
        }
        this.setParams=this.setParams.bind(this);
        this.nameChange=this.nameChange.bind(this);
        this.typeChange=this.typeChange.bind(this);
        this.carNumChange=this.carNumChange.bind(this);
        this.startDateChange=this.startDateChange.bind(this);
        this.startHourChange=this.startHourChange.bind(this);
        this.endDateChange=this.endDateChange.bind(this);
        this.endHourChange=this.endHourChange.bind(this);
        this.filter=this.filter.bind(this);
    }
    componentDidMount(){
        this.setParams(this.props.params)
    }
    componentWillReceiveProps(nextProps){
        this.setParams(nextProps.params);
    }
    setParams(par){
        this.setState({
            //user_name:par.user_name,
            alert_type:par.alert_type,
            car_num:par.car_num,
            start_date:new Date(par.start_time),
            start_hour:new Date(par.start_time),
            end_date:new Date(par.end_time),
            end_hour:new Date(par.end_time),
        });
    }
    nameChange(e,value){
        this.setState({user_name:value});
    }
    typeChange(e,value,selected){
        this.setState({alert_type:selected});
    }
    carNumChange(car){
        console.log(car);
        this.setState({car_num:car.name});
    }
    startDateChange(e,value){
        this.setState({start_date:value});
    }
    startHourChange(e,value){
        this.setState({start_hour:value});
    }
    endDateChange(e,value){
        this.setState({end_date:value});
    }
    endHourChange(e,value){
        this.setState({end_hour:value});
    }
    filter(){
        let data={
            //user_name:this.state.user_name,
            alert_type:this.state.alert_type,
            car_num:this.state.car_num,
            start_time:W.dateToString(this.state.start_date).slice(0,10)+W.dateToString(this.state.start_hour).slice(10),
            end_time:W.dateToString(this.state.end_date).slice(0,10)+W.dateToString(this.state.end_hour).slice(10)
        }
        this.props.submit(data);
    }
    render(){
        let typeItems=_types.map(ele=><MenuItem value={ele.id} key={ele.id} primaryText={ele.desc} />);
        return(
            <table>
                <tbody>
                    <tr>
                        <td style={{display:this.props.reports=='alert'?'table-cell':'none'}} >{___.alert_type}</td>
                        <td style={{display:this.props.reports=='alert'?'table-cell':'none'}} >
                            <SelectField style={styles.input_margin} value={this.state.alert_type} onChange={this.typeChange}>
                                {typeItems}
                            </SelectField>
                        </td>
                        <td style={{paddingTop:'1em'}}>{___.carNum}</td>
                        <td >
                            <CarSearch style={{marginLeft:'1em',position:'relative'}} onChange={this.carNumChange} data={{uid:_user.customer.objectId}}/>
                        </td>
                    </tr>

                    <tr>
                        <td >{___.start_time}</td>
                        <td >
                            <DatePicker 
                                textFieldStyle={{width:'128px'}} 
                                style={{float:'left',marginLeft:'1em'}} 
                                hintText={___.please_pick_date} 
                                value={this.state.start_date}
                                onChange={this.startDateChange}
                                okLabel={___.ok}
                                cancelLabel={___.cancel}
                            />
                            <TimePicker 
                                textFieldStyle={{width:'128px'}} 
                                style={{float:'left'}} 
                                hintText={___.please_pick_time} 
                                format="24hr" 
                                value={this.state.start_hour}
                                onChange={this.startHourChange}
                                okLabel={___.ok}
                                cancelLabel={___.cancel}
                            />
                        </td>
                        <td >{___.end_time}</td>
                        <td >
                            <DatePicker 
                                textFieldStyle={{width:'128px'}} 
                                style={{float:'left',marginLeft:'1em'}} 
                                hintText={___.please_pick_date} 
                                value={this.state.end_date}
                                onChange={this.endDateChange}
                                okLabel={___.ok}
                                cancelLabel={___.cancel}
                            />
                            <TimePicker 
                                textFieldStyle={{width:'128px'}} 
                                style={{float:'left'}} 
                                hintText={___.please_pick_time} 
                                format="24hr" 
                                value={this.state.end_hour}
                                onChange={this.endHourChange}
                                okLabel={___.ok}
                                cancelLabel={___.cancel}
                            />
                        </td>
                        <td >
                            <RaisedButton 
                                style={{marginLeft:'1em'}} 
                                label={___.filter} 
                                primary={true} 
                                onClick={this.filter}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

//测试用历史记录
let _hReport={
    carnum:'铝厂基建办希铝CC-132',
    distance:'200',
    overSpeed:'2',
    alarm:'1',
    fence:'0',
}
let _hReports=[];
for(let i=0;i<8;i++){
    _hReports.push(_hReport);
}

class HistoryReports extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            dids:'',
            day:'',
            data:[],
            limit:8,
            page_no:1,
            total_page:0,
        };
        this.getRecords=this.getRecords.bind(this);
        this.changePage=this.changePage.bind(this);
    }
    componentWillMount(){
        this.getRecords(this.props.params);
    }
    componentWillReceiveProps(nextProps){
        this.getRecords(nextProps.params);
    }
    getRecords(params){
        if(_devices.length==0)return;

        let _dids=_devices.map(ele=>ele.did);
        let strDids=_dids.join('||');//默认所有设备
        // let _user_name='all';//默认所有用户
        let start_time=this.props.params.start_time;//默认开始时间
        let end_time=this.props.params.end_time;//默认结束时间

        if(params){
            // if(params.user_name!='')_user_name=params.user_name;//指定用户名
            if(params.car_num!='')strDids=_devices.filter(ele=>ele.vehicleName==params.car_num)[0].did ;//指定车牌的设备
            start_time=params.start_time||this.props.params.start_time;//指定开始时间
            end_time=params.end_time||this.props.params.end_time;//指定结束时间
        }

        let par={
            // user_name:_user_name,//??
            did:strDids
        };
        let op={
            fields:'did,distance,alertTotal,day',
            day:start_time+'@'+end_time,
            limit:this.state.limit,
            page_no:this.state.page_no,
        };
        console.log('will get stat');
        Wapi.stat.list(resStat=>{
            console.log(resStat);
            let data=resStat.data;
            for(let i=data.length-1;i>=0;i--){//获取每一条报警对应的车牌号、以及超速、防盗、围栏报警次数，添加到该条报警中
                //根据终端编号获取车牌号
                data[i].carnum=_devices.filter(ele=>ele.did==data[i].did)[0].vehicleName;
                
                if(data[i].alertTotal){
                    data[i].overSpeed=data[i].alertTotal['12290']||0;
                    data[i].alarm=data[i].alertTotal['12293']||0;
                    data[i].fence=data[i].alertTotal['12295']+data[i].alertTotal['12296']||0;
                }else{
                    data[i].overSpeed= 0;
                    data[i].alarm= 0;
                    data[i].fence= 0;
                }
            }
            this.setState({
                dids:strDids,
                day:start_time+'@'+end_time,
                data:data,
                page_no:1,
                total_page:Math.ceil(resStat.total/this.state.limit),
            });
        },par,op);

        //测试用数据
        // this.setState({
        //     data:_hReports.slice(0,this.state.limit),
        //     page_no:1,
        //     total_page:Math.ceil(_hReports.length/this.state.limit),
        // });
    }
    changePage(no){
        let par={
            did:this.state.dids
        };
        let op={
            fields:'did,distance,alertTotal,day',
            day:this.state.day,
            limit:this.state.limit,
            page_no:no,
        };
        console.log('will get stat');
        Wapi.stat.list(resStat=>{
            console.log(resStat);
            let data=resStat.data;
            for(let i=data.length-1;i>=0;i--){//获取每一条报警对应的车牌号、以及超速、防盗、围栏报警次数，添加到该条报警中
                //根据终端编号获取车牌号
                data[i].carnum=_devices.filter(ele=>ele.did==data[i].did)[0].vehicleName;
                
                if(data[i].alertTotal){
                    data[i].overSpeed=data[i].alertTotal['12290']||0;
                    data[i].alarm=data[i].alertTotal['12293']||0;
                    data[i].fence=data[i].alertTotal['12295']+data[i].alertTotal['12296']||0;
                }else{
                    data[i].overSpeed= 0;
                    data[i].alarm= 0;
                    data[i].fence= 0;
                }
            }
            this.setState({
                data:data,
                page_no:no,
            });
        },par,op);
        
        //测试用数据
        // this.setState({
        //     data:_hReports,slice(this.state.limit*(no-1),this.state.limit*no),
        //     page_no:no,
        // });
    }
    render(){
        let tableItems = this.state.data.map((ele,index)=>
            <TableRow key={index} >
                <TableRowColumn style={{width:'15%'}} >{ele.carnum}</TableRowColumn>
                <TableRowColumn >{ele.day.slice(0,10)}</TableRowColumn>
                <TableRowColumn style={styles.Table_cells} >{ele.distance}</TableRowColumn>
                <TableRowColumn style={styles.Table_cells} >{ele.overSpeed}</TableRowColumn>
                <TableRowColumn style={styles.Table_cells} >{ele.alarm}</TableRowColumn>
                <TableRowColumn style={styles.Table_cells} >{ele.fence}</TableRowColumn>
            </TableRow>);
        return(
            <div>
                <Table fixedHeader={true}>
                    <TableHeader style={{borderTop:'solid 1px #cccccc'}} displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width:'15%'}} >{___.carNum}</TableHeaderColumn>
                            <TableHeaderColumn >{___.rcv_time}</TableHeaderColumn>
                            <TableHeaderColumn >{___.mileage}</TableHeaderColumn>
                            <TableHeaderColumn >{___.overSpeed_alert+'('+___.times+')'}</TableHeaderColumn>
                            <TableHeaderColumn >{___.alarm_alert+'('+___.times+')'}</TableHeaderColumn>
                            <TableHeaderColumn >{___.fence_alert+'('+___.times+')'}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{borderBottom:'solid 1px #cccccc'}} displayRowCheckbox={false} stripedRows={true}>
                        {tableItems}
                    </TableBody>
                </Table>
                <Page curPage={this.state.page_no} totalPage={this.state.total_page} changePage={this.changePage} />
            </div>
        )
    }
}

//测试用报警记录
let _wReport={
    alertType:12289,
    day:'2016-08-31 14:00:00',
    place:'新疆维吾尔自治区昌吉回族自治州吉木萨尔县，离五彩湾东方希望350米',
}
let _wReports=[];
for(let i=0;i<14;i++){
    let r=Object.assign({},_wReport);
    r.alertType+=i;
    _wReports.push(r);
}

class AlertReports extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            alert_type:'',
            dids:'',
            day:'',
            data:[],

            limit:8,
            page_no:1,
            total_page:0,
        };
        this.getRecords=this.getRecords.bind(this);
        this.changePage=this.changePage.bind(this);
    }
    componentDidMount(){
        this.getRecords();
    }
    componentWillReceiveProps(nextProps){
        this.getRecords(nextProps.params);
    }
    getRecords(params){
        if(_devices.length==0)return;

        let _dids=_devices.map(ele=>ele.did);
        let strDids=_dids.join('||');//默认所有设备
        let _alertType='<>12290';//默认除超速外所有报警类型
        let start_time=this.props.params.start_time;//默认开始时间
        let end_time=this.props.params.end_time;//默认结束时间

        if(params){
            _alertType=params.alert_type;//指定报警类型
            if(params.car_num!='')strDids=_devices.filter(ele=>ele.vehicleName==params.car_num)[0].did ;//指定车牌的设备
            start_time=params.start_time||this.props.params.start_time;//指定开始时间
            end_time=params.end_time||this.props.params.end_time;//指定结束时间
        }

        let par={
            did:strDids,
            alertType:_alertType
        };
        let op={
            day:start_time+'@'+end_time,
            limit:this.state.limit,
            page_no:this.state.page_no
        };
        console.log('will get alerts');
        Wapi.alert.list(resAlert=>{//获取所有超速报警
            console.log(resAlert);
            let data=resAlert.data;
            for(let i=data.length-1;i>=0;i--){//获取每一条报警对应的车牌号和地点，添加到该条报警中
                //根据经纬度获取地点
                let place='';
                Wapi.base.geocoder(place_data=>{
                    place=place_data.result.location.formatted_address +' '+ place_data.result.location.sematic_description;
                    data[i].place=place;
                },{
                    lat:data[i].lat,
                    lon:data[i].lon
                });
            }
            this.setState({
                alert_type:_alertType,
                dids:strDids,
                day:start_time+'@'+end_time,
                data:data,
                page_no:1,
                total_page:Math.ceil(resAlert.total/this.state.limit),
            });
        },par,op);
        

        //测试用数据
        // this.setState({
        //     data:_wReports.slice(0,this.state.limit),
        //     page_no:1,
        //     total_page:Math.ceil(_wReports.length/this.state.limit),
        // });
    }
    changePage(no){
        let par={
            did:this.state.dids,
            alertType:this.state.alert_type
        };
        let op={
            day:this.state.day,
            limit:this.state.limit,
            page_no:no
        };
        console.log('will get alerts');
        Wapi.alert.list(resAlert=>{//获取所有超速报警
            console.log(resAlert);
            let data=resAlert.data;
            for(let i=data.length-1;i>=0;i--){//获取每一条报警对应的车牌号和地点，添加到该条报警中
                //根据经纬度获取地点
                let place='';
                Wapi.base.geocoder(place_data=>{
                    place=place_data.result.location.formatted_address +' '+ place_data.result.location.sematic_description;
                    data[i].place=place;
                },{
                    lat:data[i].lat,
                    lon:data[i].lon
                });
            }
            this.setState({
                data:data,
                page_no:no,
            });
        },par,op);

        // 测试用数据
        // this.setState({
        //     data:_wReports.slice(this.state.limit*(no-1),this.state.limit*no),
        //     page_no:no
        // });
    }
    render(){
        let tableItems = this.state.data.map((ele,index)=>
            <TableRow key={index}>
                <TableRowColumn style={{width:'20%'}}>{codeToStr(ele.alertType)}</TableRowColumn>
                <TableRowColumn style={{width:'25%'}}>{ele.day}</TableRowColumn>
                <TableRowColumn style={{width:'55%'}}>{ele.place}</TableRowColumn>
            </TableRow>);
        return(
            <div>
                <Table fixedHeader={true}>
                    <TableHeader style={{borderTop:'solid 1px #cccccc'}} displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width:'20%'}}>{___.alert_type}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'25%'}}>{___.alert_time}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'55%'}}>{___.place}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{borderBottom:'solid 1px #cccccc'}} displayRowCheckbox={false} stripedRows={true}>
                        {tableItems}
                    </TableBody>
                </Table>
                <Page curPage={this.state.page_no} totalPage={this.state.total_page} changePage={this.changePage} />
            </div>
        )
    }
}

//测试用超速记录
let _sReport={
    carnum:'粤123456',
    alertType:'12290',
    day:'2016-08-31 14:00:00',
    speed:'50',
    place:'新疆维吾尔自治区昌吉回族自治州吉木萨尔县，离五彩湾东方希望350米',
}
let _sReports=[];
for(let i=0;i<20;i++){
    _sReports.push(_sReport);
}

class SpeedReports extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            dids:'',
            day:'',
            data:[],
            limit:8,
            page_no:1,
            total_page:0,
        };
        this.getRecords=this.getRecords.bind(this);
        this.changePage=this.changePage.bind(this);
    }
    componentDidMount(){
        this.getRecords();
    }
    componentWillReceiveProps(nextProps){
        this.getRecords(nextProps.params);
    }
    getRecords(params){
        if(_devices.length==0)return;
        
        let _dids=_devices.map(ele=>ele.did);
        let strDids=_dids.join('||');//默认所有设备
        let start_time=this.props.params.start_time;//默认开始时间
        let end_time=this.props.params.end_time;//默认结束时间
        
        if(params){
            //如果有指定车牌查询，则查询报警的时候使用与指定车牌对应的设备号
            if(params.car_num!='')strDids=_devices.filter(ele=>ele.vehicleName==params.car_num)[0].did ;
            start_time=params.start_time||this.props.params.start_time;//指定开始时间
            end_time=params.end_time||this.props.params.end_time;//指定结束时间
        }

        let par={
            did:strDids,
            alertType:'12290'
        };
        let op={
            day:start_time+'@'+end_time,
            limit:this.state.limit,
            page_no:this.state.page_no,
        }
        console.log('will get over_speed_record');
        Wapi.alert.list(resAlert=>{//获取所有超速报警
            console.log(resAlert);
            let data=resAlert.data;
            for(let i=data.length-1;i>=0;i--){//获取每一条报警对应的车牌号和地点，添加到该条报警中
                //根据终端编号获取车牌号，未指定车牌的时候使用，指定车牌的时候应当也不会出错
                data[i].carnum=_devices.filter(ele=>ele.did==data[i].did)[0].vehicleName;

                //根据经纬度获取地点
                let place='';
                Wapi.base.geocoder(place_data=>{
                    place=place_data.result.formatted_address;
                    data[i].place=place;
                },{
                    lat:data[i].lat,
                    lon:data[i].lon
                });
            }

            this.setState({
                dids:strDids,
                day:start_time+'@'+end_time,
                data:data,
                page_no:1,
                total_page:Math.ceil(resAlert.total/this.state.limit),
            });
        },par,op);

        // 测试用数据
        // this.setState({
        //     data:_sReports.slice(0,this.state.limit),
        //     page_no:1,
        //     total_page:Math.ceil(_sReports.length/this.state.limit),
        // });
    }
    changePage(no){
        let par={
            did:this.state.dids,
            alertType:'12290'
        };
        let op={
            day:this.state.day,
            limit:this.state.limit,
            page_no:no,
        }
        console.log('will get over_speed_record');
        Wapi.alert.list(resAlert=>{//获取所有超速报警
            console.log(resAlert);
            let data=resAlert.data;
            for(let i=data.length-1;i>=0;i--){//获取每一条报警对应的车牌号和地点，添加到该条报警中
                //根据终端编号获取车牌号，未指定车牌的时候使用，指定车牌的时候应当也不会出错
                data[i].carnum=_devices.filter(ele=>ele.did==data[i].did)[0].vehicleName;

                //根据经纬度获取地点
                let place='';
                Wapi.base.geocoder(place_data=>{
                    place=place_data.result.formatted_address;
                    data[i].place=place;
                },{
                    lat:data[i].lat,
                    lon:data[i].lon
                });
            }

            this.setState({
                data:data,
                page_no:no
            });
        },par,op);

        // 测试用数据
        // this.setState({
        //     data:_sReports.slice(this.state.limit*(no-1),this.state.limit*no),
        //     page_no:no
        // });
    }
    render(){
        let tableItems = this.state.data.map((ele,index)=>
            <TableRow key={index}>
                <TableRowColumn style={{width:'15%'}}>{ele.carnum}</TableRowColumn>
                <TableRowColumn style={{width:'10%'}}>{codeToStr(ele.alertType)}</TableRowColumn>
                <TableRowColumn style={{width:'20%'}}>{ele.day}</TableRowColumn>
                <TableRowColumn style={{width:'10%'}}>{ele.speed}</TableRowColumn>
                <TableRowColumn style={{width:'45%'}}>{ele.place}</TableRowColumn>
            </TableRow>);
        return(
            <div>
                <Table fixedHeader={true}>
                    <TableHeader style={{borderTop:'solid 1px #cccccc'}} displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width:'15%'}}>{___.carNum}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'10%'}}>{___.alert_type}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'20%'}}>{___.alert_time}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'10%'}}>{___.speed}</TableHeaderColumn>
                            <TableHeaderColumn style={{width:'45%'}}>{___.place}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{borderBottom:'solid 1px #cccccc'}} displayRowCheckbox={false} stripedRows={true}>
                        {tableItems}
                    </TableBody>
                </Table>
                <Page curPage={this.state.page_no} totalPage={this.state.total_page} changePage={this.changePage} />
            </div>
        )
    }
}
