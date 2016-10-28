import React, {Component} from 'react';

import {Tabs, Tab} from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {getDepart} from '../_modules/tool';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


const styles={
    bottomBtn:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    sonpage:{paddingLeft:'1em',paddingRight:'1em'},
    tr:{height:'40px',borderBottom:'1px solid #333333'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'}
}


export default class CarInfo extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            onManage:false
        }
        this.onManageChange=this.onManageChange.bind(this);
        // this.deleteCar=this.deleteCar.bind(this);
        this.cancel=this.cancel.bind(this);
        this.submit=this.submit.bind(this);
        this.edit = this.edit.bind(this);
    }
    onManageChange(e,value){
        this.setState({onManage:value});
    }
    // deleteCar(){
    //     let _this=this;
    //     W.confirm(___.confirm_car_delete,function(b){
    //         if(b){
    //             // alert(b);
    //             let targetId=_this.props.curCar.objectId;
    //             Wapi.vehicle.delete(res=>{
    //                 // _this.props.cancel();
    //                 _this.submit('delete');
    //             },{
    //                 objectId:targetId
    //             });
    //         }else{
    //             return;
    //         }
    //     });
        
    // }
    cancel(){
        history.back();
        this.props.cancel();
    }
    submit(intent){
        // history.back();
        if(intent=='delete'){
            this.props.submit('delete',this.props.curCar.objectId);
        }else{
            this.props.cancel();
        }
        
    }
    edit(){
        this.props.edit(this.props.curCar);
    }
    render(){
        let car=this.props.curCar;
        if(car.buyDate && typeof car.buyDate!='string'){
            car.buyDate=W.dateToString(car.buyDate).slice(0,10);//提交的时候转换日期格式
            car.insuranceExpireIn=W.dateToString(car.insuranceExpireIn).slice(0,10);
            car.inspectExpireIn=W.dateToString(car.inspectExpireIn).slice(0,10);
        }
        return(
            <div>
                <Tabs>
                    <Tab label={___.base_info}>
                        <Table>
                            <TableBody displayRowCheckbox={false}>
                                <TableRow >
                                    <TableRowColumn style={styles.td_left}>{___.carNum}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.name}</TableRowColumn>
                                </TableRow>
                                <TableRow >
                                    <TableRowColumn style={styles.td_left}>{___.brand}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.brand+' '+car.model}</TableRowColumn>
                                </TableRow>
                                <TableRow >
                                    <TableRowColumn style={styles.td_left}>{___.frame_no}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.frameNo}</TableRowColumn>
                                </TableRow>
                                <TableRow >
                                    <TableRowColumn style={styles.td_left}>{___.engine_no}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.engineNo}</TableRowColumn>
                                </TableRow>
                                <TableRow >
                                    <TableRowColumn style={styles.td_left}>{___.buy_date}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.buyDate?car.buyDate.slice(0,10):''}</TableRowColumn>
                                </TableRow>
                            </TableBody>
                        </Table>
                        {/*<div style={{marginLeft:'1em'}}>
                            <RaisedButton
                                label={___.delete}
                                primary={true}
                                onClick={this.deleteCar}
                            />
                        </div>*/}
                    </Tab>
                    <Tab label={___.insurance_info}>
                        <Table style={styles.sonpage}>
                            <TableBody displayRowCheckbox={false} >
                                <TableRow>
                                    <TableRowColumn style={styles.td_left}>{___.mileage}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.mileage}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn style={styles.td_left}>{___.maintain_mileage}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.maintainMileage}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn style={styles.td_left}>{___.insurance_expire}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.insuranceExpireIn?car.insuranceExpireIn.slice(0,10):''}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn style={styles.td_left}>{___.inspect_expireIn}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.inspectExpireIn?car.inspectExpireIn.slice(0,10):''}</TableRowColumn>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Tab>
                    {/*<Tab label={___.financial_info}>
                        <Table style={styles.sonpage}>
                            <TableBody displayRowCheckbox={false} >
                                <TableRow>
                                    <TableRowColumn style={styles.td_left}>{___.service_type}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.serviceType}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn style={styles.td_left}>{___.charge_standard}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.feeType}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn style={styles.td_left}>{___.service_reg_date}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.serviceRegDate||''}</TableRowColumn>
                                </TableRow>
                                <TableRow>
                                    <TableRowColumn style={styles.td_left}>{___.service_expire}</TableRowColumn>
                                    <TableRowColumn style={styles.td_right}>{car.serviceExpireIn||''}</TableRowColumn>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Tab>*/}
                </Tabs>
                <div style={styles.bottomBtn}>
                    {/*<FlatButton
                        label={___.cancel}
                        primary={true}
                        onClick={this.cancel}
                    />*/}
                    <FlatButton
                        label={___.edit}
                        primary={true}
                        onClick={this.edit}
                    />
                </div>
            </div>
        )
    }
}