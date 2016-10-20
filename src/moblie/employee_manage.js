import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import md5 from 'md5';
import STORE from '../_reducers/main';

import {ThemeProvider} from '../_theme/default';
import Card from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

import AppBar from '../_component/base/appBar';
import Fab from '../_component/base/fab';
import SonPage from '../_component/base/sonPage';
import TypeSelect from '../_component/base/TypeSelect';
import DepartmentTree,{DepartmentSelcet} from'../_component/department_tree';
import EditEmployee from'../_component/EditEmployee';
import {randomStr,getDepart} from '../_modules/tool';
import AutoList from '../_component/base/autoList';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingTop:'50px',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
    // sonpage_main:{width:'90%',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
    sonpage_main:{paddingBottom:'20px',marginLeft:(window.innerWidth-256)/2+'px',marginRight:(window.innerWidth-256)/2+'px'},
    card:{marginTop:'1em',padding:'0.5em 1em'},
    table_tr:{height:'30px'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'20px',width:'200px',overflow:'hidden'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'2em'},
}

const _employee={
    uid:1,
    departId:1,
    type:1,
    name:'小明',
    sex:1,
    tel:'1234567890',
}
const _employees=[];
for(let i=0;i<=4;i++){
    let e=Object.assign({},_employee);
    e.uid=i;
    e.tel+=i;
    _employees.push(e);
}
const _sex=[___.woman,___.man];
const _type=['角色A','角色B','角色C'];
// const _depar=[{name:'部门A',id:1234},'部门B','部门C'];

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            employees:[],
            edit_employee:{},
            show_sonpage:false,
            intent:'add',
            total:0,
        }
        this.page=1;
        this.getEmployees=this.getEmployees.bind(this);
        this.addEmployee=this.addEmployee.bind(this);
        this.showDetails=this.showDetails.bind(this);
        this.editEmployeeCancel=this.editEmployeeCancel.bind(this);
        this.editEmployeeSubmit=this.editEmployeeSubmit.bind(this);
    }
    getChildContext(){
        return {
            ACT:this.act,
            custType:this.props.custType,
            showDetails:this.showDetails
        };
    }

    componentDidMount(){//初始化时获取人员表
        this.getEmployees();
    }
    getEmployees(){//获取当前人员表数据
        Wapi.employee.list(res=>{
            this.setState({
                employees:res.data,
                total:res.total,
            });
        },{
            companyId:_user.customer.objectId,
            isQuit:false
        },{
            fields:'objectId,uid,companyId,name,tel,sex,departId,type,isQuit',
            limit:20
        });

        //测试用数据
        // this.setState({employees:_employees});
    }

    addEmployee(){
        this.setState({
            edit_employee:{},
            show_sonpage:true,
            intent:'add',
        });
    }
    showDetails(data){
        this.setState({
            edit_employee:data,
            show_sonpage:true,
            intent:'edit',
        });
    }
    editEmployeeCancel(){
        this.setState({show_sonpage:false});
    }
    editEmployeeSubmit(data,allowLogin){
        if(this.state.intent=='edit'){//修改人员
            let params={
                _uid:data.uid,
                name:data.name,
                tel:data.tel,
                sex:data.sex,
                departId:data.departId,
                type:data.type,
                isQuit:data.isQuit
            };
            Wapi.employee.update(res=>{
                let arr=this.state.employees;
                arr.map(ele=>{
                    if(ele.uid==data.uid){
                        ele.name=params.name;
                        ele.tel=params.tel;
                        ele.sex=params.sex;
                        ele.departId=params.departId;
                        ele.type=params.type;
                        ele.isQuit=params.isQuit;
                    }
                });
                arr=arr.filter(ele=>!ele.isQuit);
                this.setState({employees:arr});//修改完成后更新该条人员数据
                history.back();//更新数据后返回
            },params);
        }else if(this.state.intent=='add'){//添加人员
            let that=this;
            
            let par={
                userType:9,
                mobile:data.tel,
                password:md5(randomStr())
            };
            if(allowLogin){
                par.password=md5(data.tel.slice(-6));
            }
            Wapi.user.add(function (res) {
                let params={
                    companyId:_user.customer.objectId,
                    name:data.name,
                    tel:data.tel,
                    sex:data.sex,
                    departId:data.departId,
                    type:data.type,
                    isQuit:false,
                };
                params.uid=res.uid;
                Wapi.employee.add(function(res){
                    params.objectId=res.objectId;
                    let arr=that.state.employees;
                    that.setState({employees:arr.unshift(params)});//添加完成后将新增的人员加入人员数组
                    history.back();//更新数据后返回

                    Wapi.role.update(function(role){
                        data.objectId=res.objectId;
                        let sms=___.employee_sms_content;
                        let tem={
                            app_name:___.app_name,
                            name:data.name,
                            sex:data.sex?___.sir:___.lady,
                            account:data.tel,
                            pwd:data.tel.slice(-6)
                        }
                        if(allowLogin){
                            Wapi.comm.sendSMS(function(res){
                                W.errorCode(res);
                            },data.tel,0,W.replace(sms,tem));
                        }
                    },{
                        _objectId:'773344067361837000',
                        users:'+"'+params.uid+'"'
                    })
                },params);

            },par);

        }
        
    }

    loadNextPage(){
        let arr=this.state.employees;
        this.page++;
        Wapi.employee.list(res=>{
            this.setState({employees:arr.concat(res.data)});
        },{
            companyId:_user.customer.objectId,
            isQuit:false
        },{
            fields:'objectId,uid,companyId,name,tel,sex,departId,type,isQuit',
            limit:20,
            page_no:this.page
        });
    }

    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.employee_manage} 
                        style={styles.appbar}
                        iconElementRight={
                            <IconButton onTouchTap={this.addEmployee}><ContentAdd/></IconButton>
                        }
                    />
                    <Alist 
                        max={this.state.total} 
                        limit={20} 
                        data={this.state.employees} 
                        next={this.loadNextPage} 
                    />
                    <SonPage open={this.state.show_sonpage} back={this.editEmployeeCancel}>
                        <EditEmployee data={this.state.edit_employee} submit={this.editEmployeeSubmit}/>
                    </SonPage>
                </div>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    custType: React.PropTypes.array,
    ACT: React.PropTypes.object,
    showDetails:React.PropTypes.func
}

class DumbList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let items=this.props.data.map((ele,index)=>
            <Card style={styles.card} key={index}>
                <table >
                    <tbody >
                        <tr style={styles.table_tr}>
                            <td style={styles.td_left}>{___.person_name}</td>
                            <td style={styles.td_right}>{ele.name}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td style={styles.td_left}>{___.sex}</td>
                            <td style={styles.td_right}>{_sex[ele.sex]}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td style={styles.td_left}>{___.department}</td>
                            <td style={styles.td_right}>{getDepart(ele.departId)}</td>
                        </tr>
                        {/*<tr style={styles.table_tr}>
                            <td style={styles.td_left}>{___.role}</td>
                            <td style={styles.td_right}>{_type[ele.type]}</td>
                        </tr>*/}
                        <tr style={styles.table_tr}>
                            <td style={styles.td_left}>{___.phone}</td>
                            <td style={styles.td_right}>{ele.tel}</td>
                        </tr>
                    </tbody>
                </table>
                <Divider />
                <div style={styles.bottom_btn_right}>
                    <FlatButton label={___.details} primary={true} onClick={()=>this.context.showDetails(ele)} />
                </div>
            </Card>
        );
        return(
            <div style={styles.main}>
                {items}
            </div>
        )
    }
}
 DumbList.contextTypes={
    showDetails: React.PropTypes.func
};
let Alist=AutoList(DumbList);
