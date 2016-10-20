//验证数据
class validationTool{
    constructor(table){
        this.fields=table.fieldDefine;
    }

    test(data){
        let result={},isNull=true;
        let f,k;
        for(let i=0;i<this.fields.length;i++){
            f=this.fields[i];
            k=this.testData(data[f.name],f.validations,data);
            if(k){
                isNull=false;
                result[f.name]=f.messages[k];
            }else{
                result[f.name]=null;
            }
        }
        if(isNull)
            return false;
        else 
            return result;
    }

    testData(value,validations,data){
        for(let k in validations){
            if(validations[k]){
                // if(k=='remote'){//使用ajax方法调用remote-valid.jsp验证输入值
                //     remote:"remote-valid.jsp"   
                // }
                if(k!='required'&&typeof value=='undefined')continue;
                if(!this[k](value,validations[k],data))return k;
            }
        }
    }
    equal(val1,val2){//对比两个值是否相等，处理number和string相互转换，其他类型===的问题
        let result=(val1===val2);
        let type1=typeof val1,type2=typeof val2;
        if(!result&&(type1=='string'||type1=='number')&&(type2=='string'||type2=='number')){
            result=(val1.toString()===val2.toString());
        }
        return result;
    }

    required(value){//必须输入
        return !(!value&&(typeof value=='string'||typeof value=='object'||typeof value=='undefined'));
    }
    email(value){//必须输入正确格式的电子邮件
        if(typeof value!='string')return false;
        return /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i.test(value);
    }                 
    url(value){//必须输入正确格式的网址
        if(typeof value!='string')return false;        
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
    }
    date(value){//必须输入正确格式的日期
        if(typeof value!='string')return false;        
        return /^\d{4}-\d{1,2}-\d{1,2}$/.test( value );
    }
    time(value){//必须输入正确格式的时间
        if(typeof value!='string')return false;        
        return /^([01]{0,1}[0-9]|[2][0-3]):[0-5][0-9]$/.test( value );
    }                         
    dateTime(value){
        if(typeof value!='string')return false;        
        let a=value.split(' ');
        if(a.length!=2)return false;
        return (this.date(a[0])&&this.date(a[1]));
    }
    accept(value,acc){//输入拥有合法后缀名的字符串（上传文件的后缀）
        if(typeof value!='string')return false;
        let rex=new RegExp('.+\.'+acc+'$');
        return  rex.test(value);
    }
    regExp(value,regExp){
        if(/\/.+\/[igm]{0,1}$/.test(regExp)){
            let r;
            if(/\/.+\/[igm]$/.test(regExp))
                r=new RegExp(regExp.slice(0,-2),regExp[regExp.length-1]);
            else
                r=new RegExp(regExp.slice(0,-1));
            return r.test(value);
        }else
            return false;
    }
    maxlength(value,length){//输入长度最多是5的字符串(汉字算一个字符)
        if(typeof value=='number')
            value=value.toString();
        else if(typeof value!='string')return false;     
        return (value.length<=length);
    }
    minlength(value,length){//输入长度最小是10的字符串(汉字算一个字符)
        if(typeof value=='number')
            value=value.toString();
        else if(typeof value!='string')return false;     
        return (value.length>=length);
    }
    rangelength(value,range){//输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符)
        return (this.minlength(value,range[0])&&this.maxlength(value,range[1]));
    }

    number(value){//必须输入合法的数字(负数，小数)
        return ((typeof value=='string'||typeof value=='number')&&!isNaN(value*1));
    }
    digits(value){//必须输入整数
        return (this.number(value)&&value.toString().indexOf('.')==-1);
    }
    max(value,m){//输入值不能大于5
        return (this.number(value)&&(value*1)<=m);
    }
    min(value,m){//输入值不能小于10
        return (this.number(value)&&(value*1)>=m);
    }
    range(value,m){//输入值必须介于 5 和 10 之间
        return (this.min(value,m[0])&&this.min(value,m[1]));
    }   
    select(value,sel){
        if(typeof value=='object'&&value.length){
            let j,res;
            for(let i=0;i<value.length;i++){
                res=false;
                for(j=0;j<sel.length;j++){
                    if(this.equal(value,sel[j].value)){
                        res=true;
                        break;
                    }
                }
                if(!res)
                    return false;
            }
            return true;
        }else
            for(let i=0;i<sel.length;i++){
                if(this.equal(value,sel[i].value))
                    return true;
            }
        return false;
    }                             
    equalTo(value,equal,data){//输入值必须和#password相同
        if(equal[0]=='#')
            return this.equal(value,data[equal]);
        else
            return this.equal(value,equal);
    }
}

export default validationTool;