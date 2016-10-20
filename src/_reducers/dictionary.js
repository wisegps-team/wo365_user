/**
 * 处理各种字典表的获取和更新
 */
'use strict';
import {WAPI} from '../_modules/Wapi';

let dictionary={};



export default function dictionaryReducer(state,action,name){
    if(action.name!=name)return state;
    let ACT=dictionary[name];
    let data;
    switch(action.type){
        case ACT.action.geted:
            return action.data;
        case ACT.action.add:
            return [action.data].concat(state);
        case ACT.action.delete:
            return state.filter(ele=>(ele.objectId!=action.id));
        case ACT.action.update:
            return state.map(function(ele) {
                if(ele.objectId==action.data.objectId)
                    return Object.assign({},ele,action.data);
                else
                    return ele;
            });
        default:
            return state;
    }
}

class dictionaryAction{
    constructor(name) {
        let acts=['geted','add','delete','update'];
        this.action={};
        this.name=name;
        // this.api=new WAPI(name,_user.access_token);
        acts.forEach((ele)=>this.action[ele]=ele+'_'+name);
        dictionary[name]=this;
    }
    get(data,op){
        let that=this;
        return function(dispatch) {
            Wapi[that.name].list(function(res){
                dispatch(that.geted(res.data));
            },data,op)
        }
    }
    geted(data){
        return {
            type:this.action.geted,
            data:data,
            name:this.name
        };
    }
    add(newData){
        return {
            type:this.action.add,
            data:newData,
            name:this.name
        }
    }
    delete(objId){
        return {
            type:this.action.delete,
            id:objId,
            name:this.name
        }
    }
    update(newData){
        return {
            type:this.action.update,
            data:newData,
            name:this.name
        }
    }
}



export const user_type_act=new dictionaryAction('custType');
export const brand_act=new dictionaryAction('brand');
export const department_act=new dictionaryAction('department');