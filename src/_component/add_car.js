import React, {Component} from 'react';

import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';

import CarBrand from '../_component/base/carBrand';
import Input from '../_component/base/input';


const styles={
    bottomBtn:{width:'100%',display:'block',textAlign:'right',padding:'10px'},
}
const initState={
    name:'',
    uid:_user.customer.objectId,
    brand:'',
    brandId:'',
    model:'',
    modelId:'',
    type:'',
    typeId:'',
    frameNo:'',
    engineNo:'',
    buyDate:'',
    mileage:'',
    maintainMileage:'',
    insuranceExpireIn:'',
    inspectExpireIn:''
}
class AddCar extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state=initState;
        this.brandData={};

        this.changeNum=this.changeNum.bind(this);
        this.changeBrand=this.changeBrand.bind(this);
        this.changeFrame=this.changeFrame.bind(this);
        this.changeEngine=this.changeEngine.bind(this);
        this.changeBuyDate=this.changeBuyDate.bind(this);
        this.changeMileage=this.changeMileage.bind(this);
        this.changeMaintainMileage=this.changeMaintainMileage.bind(this);
        this.changeInsuranceExpiry=this.changeInsuranceExpiry.bind(this);
        this.changeCheckExpiry=this.changeCheckExpiry.bind(this);

        this.submit=this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.isEdit){
            let data=nextProps.data;
            this.brandData={
                brand:data.brand,
                brandId:data.brandId,
                serie:data.model,
                serieId:data.modelId,
                type:data.type,
                typeId:data.typeId,
            }
            data.buyDate=new Date(data.buyDate);
            data.inspectExpireIn=new Date(data.inspectExpireIn);
            data.insuranceExpireIn=new Date(data.insuranceExpireIn);
            this.setState(data);
        }
    }
    
    changeNum(e,name){
        this.setState({name:name});
    }
    changeBrand(data){
        this.brandData=data;

        let brand=data.brand;
        let brandId=data.brandId;
        let serie=data.serie;
        let serieId=data.serieId;
        let type=data.type;
        let typeId=data.typeId;
        this.setState({
            brand:brand,
            brandId:brandId,
            model:serie,
            modelId:serieId,
            type:type,
            typeId:typeId,
        });
    }
    changeFrame(e,frameNo){
        this.setState({frameNo:frameNo});
    }
    changeEngine(e,engineNo){
        this.setState({engineNo:engineNo});
    }
    changeBuyDate(e,date){
        this.setState({buyDate:date});
    }
    changeMileage(e,mileage){
        this.setState({mileage:mileage});
    }
    changeMaintainMileage(e,maintainMileage){
        this.setState({maintainMileage:maintainMileage});
    }
    changeInsuranceExpiry(e,date){
        this.setState({insuranceExpireIn:date});
    }
    changeCheckExpiry(e,date){
        this.setState({inspectExpireIn:date});
    }
    submit(){
        if(this.state.name==''){
            W.alert(___.carNum+' '+___.not_null);
            return;
        }
        if(this.state.brand==''){
            W.alert(___.brand+' '+___.not_null);
            return;
        }
        if(this.state.buyDate==''){
            W.alert(___.buy_date+' '+___.not_null);
            return;
        }
        if(this.state.mileage==''){
            W.alert(___.mileage+' '+___.not_null);
            return;
        }
        if(this.state.maintainMileage==''){
            W.alert(___.maintain_mileage+' '+___.not_null);
            return;
        }
        if(this.state.insuranceExpireIn==''){
            W.alert(___.insurance_expire+' '+___.not_null);
            return;
        }
        if(this.state.inspectExpireIn==''){
            W.alert(___.inspect_expireIn+' '+___.not_null);
            return;
        }
        if(this.props.isEdit){
            this.editData(this.state);
        }else{
            this.addData(this.state);
        }
        
    }
    cancel(){
        this.props.cancel();
    }
    editData(state){
        let data=Object.assign({},state);
        data._objectId=data.objectId;
        data.buyDate=W.dateToString(data.buyDate).slice(0,10);//提交的时候转换日期格式
        data.insuranceExpireIn=W.dateToString(data.insuranceExpireIn).slice(0,10);
        data.inspectExpireIn=W.dateToString(data.inspectExpireIn).slice(0,10);
        delete data.objectId;

        Wapi.vehicle.update(res=>{
            this.brandData={};
            this.setState(initState);//添加成功后重置state里面的内容
            this.props.editSubmit(data);
        },data);
    }
    addData(state){
        let data=Object.assign({},state);
        data.buyDate=W.dateToString(data.buyDate).slice(0,10);//提交的时候转换日期格式
        data.insuranceExpireIn=W.dateToString(data.insuranceExpireIn).slice(0,10);
        data.inspectExpireIn=W.dateToString(data.inspectExpireIn).slice(0,10);

        Wapi.vehicle.add(res=>{
            this.brandData={};
            this.setState(initState);//添加成功后重置state里面的内容
            data.objectId=res.objectId;
            this.props.success(data);
        },data);
    }
    render(){
        let data=this.state;
        // data.buyDate=new Date(data.buyDate);
        // data.inspectExpireIn=new Date(data.inspectExpireIn);
        // data.insuranceExpireIn=new Date(data.insuranceExpireIn);
        return(
            <div style={this.props.style||{paddingTop:'0px'}}>
                <div style={{paddingLeft:'1.5em',paddingRight:'1.5em'}} >
                    <Input floatingLabelText={___.carNum} id='name' onChange={this.changeNum} value={data.name} />
                    <CarBrand id='carBrand' value={this.brandData} onChange={res=>this.changeBrand(res)}/>
                    {/*<Input floatingLabelText={___.frame_no} id='frameNo' onChange={this.changeFrame} value={data.frameNo} />
                    <Input floatingLabelText={___.engine_no} id='engineNo' onChange={this.changeEngine} value={data.engineNo} />*/}
                    <DatePicker 
                        id='buyDate' 
                        value={data.buyDate} 
                        floatingLabelText={___.buy_date}
                        hintText={___.please_pick_date}
                        onChange={this.changeBuyDate}
                        okLabel={___.ok}
                        cancelLabel={___.cancel}
                    />
                    <Input floatingLabelText={___.mileage} id='mileage' onChange={this.changeMileage} value={data.mileage} />
                    <Input floatingLabelText={___.maintain_mileage} id='maintainMileage' onChange={this.changeMaintainMileage} value={data.maintainMileage} />
                    <DatePicker 
                        id='insuranceExpireIn' 
                        value={data.insuranceExpireIn}
                        floatingLabelText={___.insurance_expire}
                        hintText={___.please_pick_date}
                        onChange={this.changeInsuranceExpiry}
                        okLabel={___.ok}
                        cancelLabel={___.cancel}
                    />
                    <DatePicker 
                        id='inspectExpireIn' 
                        value={data.inspectExpireIn}
                        floatingLabelText={___.inspect_expireIn}
                        hintText={___.please_pick_date}
                        onChange={this.changeCheckExpiry}
                        okLabel={___.ok}
                        cancelLabel={___.cancel}
                    />
                </div>
                <div style={styles.bottomBtn}>
                    <FlatButton
                        label={___.cancel}
                        primary={true}
                        onTouchTap={this.cancel}
                    />
                    <FlatButton
                        label={___.ok}
                        primary={true}
                        onTouchTap={this.submit}
                    />
                </div>
            </div>
        )
    }
}

export default AddCar;