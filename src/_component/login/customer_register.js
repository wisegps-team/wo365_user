import React, {Component} from 'react';

import Register from './register';
import AreaSelect from '../base/areaSelect';
import Input from '../base/input';
import SexRadio from '../base/sexRadio';



/**
 * 接受的props：
 *      parentId 新注册的客户的上级id
 *      typeId 注册客户的类型
 *      success 注册流程完成时的回调，未必注册成功
 *          props.success(res) 传入一个对象res，根据res._code的值判断是否注册成功，
 *          不存在或为0是注册成功，等于1为密码错误且之前已经注册过用户，
 *          等于2是输入了正确的密码，而且已经是一个客户，客户表中已有数据，所以不能注册
 */
class CustomerRegisterBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.registerSuccess = this.registerSuccess.bind(this);
        this.data={
            sex:1
        };
        this.change = this.change.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.beforRegister = this.beforRegister.bind(this);
    }

    beforRegister(data){
        if(!this.data.name){
            W.alert(___.user_name_empty);
            return false;
        }
        if(!this.data.cityId){
            W.alert(___.area_empty);
            return false;
        }
        if(!this.data.contact){
            W.alert(___.contact_empty);
            return false;
        }
        return true;
    }
    
    registerSuccess(res){
        let user=res;
        let that=this;
        let pid=this.props.parentId;
        let tid=this.props.typeId;
        let cust=Object.assign({},this.data,{tel:user.mobile,custTypeId:tid});
        cust.parentId=[pid];
        Wapi.user.login(function(data){//先登录获取token
            if(data.status_code){
                if(data.status_code==2&&user.status_code==8){//密码错误且之前已经注册过用户
                    user._code=1;
                    that.props.success(user);
                    return;
                }
                W.errorCode(data);
                return;
            }
            delete data.status_code;
            Object.assign(user,data);//用户信息
            let token=data.access_token;
            cust.access_token=token;
            cust.uid=data.uid;
            if(user.status_code==8)//如果是之前就已经注册过用户则先校验一下有没有添加过客户表
                Wapi.customer.get(function(cust){//如果有，则不能注册，提示去重置密码
                    if(cust.data){
                        user._code=2;
                        user.customer=cust.data;
                        that.props.success(user);
                    }else
                        addCust();
                },{uid:cust.uid,access_token:token});
            else
                addCust();

            function addCust(){//添加客户表资料
                Wapi.custType.get(type=>{
                    cust.custType=type.data.name;
                    Wapi.customer.add(function(res){
                        cust.objectId=res.objectId;
                        user.customer=cust;
                        that.props.success(user);
                        W.alert(___.register_success,()=>location='index.html');
                    },cust);
                    Wapi.user.updateMe(null,{
                        _sessionToken:data.session_token,
                        access_token:token,
                        userType:type.data.userType
                    });
                },{
                    id:tid,
                    access_token:token
                });
            }
        },{
            account:user.mobile,
            password:user.password
        });
    }

    nameChange(e,val){
        this.data[e.target.name]=val;
    }
    change(val,name){
        if(name){
            Object.assign(this.data,val);
        }else{
            this.data.sex=val;
        }
    }
    render() {
        return (
            <div>
                <form>
                    <Input name='name' floatingLabelText={___.company_name} onChange={this.nameChange}/>
                    <AreaSelect name='area' onChange={this.change}/>
                    <Input name='contact' floatingLabelText={___.person} onChange={this.nameChange}/>
                    <SexRadio onChange={this.change}/>
                </form>
                <Register onSuccess={this.registerSuccess} beforRegister={this.beforRegister}/>
            </div>
        );
    }
}

export default CustomerRegisterBox;