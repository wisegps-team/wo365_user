/**
 * 品牌产品联动选择框
 */
import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles={
    select:{
        overflow:'hidden',
        width: '50%',
        verticalAlign: 'bottom',
        textAlign:'left',
    }
}


class BrandSelect extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            brands:STORE.getState().brand,
            products:[],
            brandId:props.value?props.value.brandId:0,
            productId:props.value?props.value.productId:0
        }
        let brandId=this.state.brands[0]?this.state.brands[0].objectId:0;
        this.state.brandId=this.state.brandId||brandId;
        if(this.state.brandId){
            this.getProducts(this.state.brandId);
        }
        this.brands=this.state.brands.map(br=>(<MenuItem value={br.objectId} primaryText={br.name} key={br.objectId}/>));

        this.brandChange = this.brandChange.bind(this);
        this.productChange = this.productChange.bind(this);
    }
    componentDidMount() {
        let that=this;
        this.unsubscribe = STORE.subscribe(function(){
            let brands=STORE.getState().brand;
            let brandId=brands[0]?brands[0].objectId:0;
            brandId=that.state.brandId?that.state.brandId:brandId;
            that.setState({brands,brandId});
        });
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    componentWillUpdate(nextProps, nextState) {
        if(nextState.brands!=this.state.brands){
            this.brands=nextState.brands.map(br=>(<MenuItem value={br.objectId} primaryText={br.name} key={br.objectId}/>));
        }
        if(nextState.brandId!=this.state.brandId){
            this.getProducts(nextState.brandId)
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.state.brandId&&this.state.productId&&this.state.brandId!=prevState.brandId&&this.state.productId!=prevState.productId){
            let br=this.state.brands.find(ele=>(ele.objectId==this.state.brandId));
            let pr=this.state.products.find(ele=>(ele.objectId==this.state.productId));
            let data={
                brandId:this.state.brandId,
                productId:this.state.productId,
                brand:br?br.name:'',
                product:pr?pr.name:''
            }  
            this.props.onChange(data); 
        }
    }

    getProducts(brandId){
        let that=this;
        Wapi.product.list(function(res){
            let products=res.data;
            let productId=products[0]?products[0].objectId:0;
            productId=that.state.productId?that.state.productId:productId;
            that.setState({products,productId});
        },{
            brandId:brandId
        })
    }
    
    
    brandChange(e,i,brandId){
        if(brandId==this.state.brandId)return;
        this.setState({brandId,productId:0});
    }

    productChange(e,i,productId){
        if(productId==this.state.productId)return;
        this.setState({productId});
    }
    
    render() {
        let products=this.state.products.map(ele=>(<MenuItem value={ele.objectId} primaryText={ele.name} key={ele.objectId}/>))
        return (
            <div {...this.props}>
                <SelectField
                    value={this.state.brandId}
                    onChange={this.brandChange}
                    style={styles.select}
                >
                    {this.brands}
                </SelectField>

                <SelectField
                    value={this.state.productId}
                    onChange={this.productChange}
                    style={styles.select}
                >
                    {products}
                </SelectField>
            </div>
        );
    }
}

export default BrandSelect;