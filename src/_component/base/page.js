import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const styles={
    page:{width:'100%',display:'block',textAlign:'center',paddingTop:'10px',height:'50px'},
    page_margin:{fontSize:'0.8em',marginLeft:'1em',marginRight:'1em'},
}
class Page extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            inputPage:'',
        }
        this.lastPage=this.lastPage.bind(this);
        this.nextPage=this.nextPage.bind(this);
        this.inputPage=this.inputPage.bind(this);
        this.toInputPage=this.toInputPage.bind(this);
    }
    lastPage(){
        if(this.props.curPage>1){
            this.props.changePage(this.props.curPage-1);
        }
    }
    nextPage(){
        if(this.props.curPage<this.props.totalPage){
            this.props.changePage(this.props.curPage+1);
        }
    }
    inputPage(e){
        this.setState({
            inputPage:e.target.value
        })
    }
    toInputPage(){
        let targetPage=Number(this.state.inputPage);
        if(targetPage<=this.props.totalPage&&targetPage>=1){
            this.props.changePage(targetPage);
            this.setState({inputPage:''});
        }
    }
    render(){
        console.log('page render');
        return(
            <div style={styles.page} >
                <div style={{display:this.props.totalPage>1?'block':'none'}}>
                    <FlatButton primary={true} label={___.last_page} onClick={this.lastPage}/>
                    <span style={styles.page_margin}>{this.props.curPage}</span>
                    <FlatButton primary={true} label={___.next_page} onClick={this.nextPage}/>
                    <span style={styles.page_margin}>{___.total_ + this.props.totalPage + ___.page}</span>
                    <span style={styles.page_margin}>{___.change_to_} <input style={{width:'2em',textAlign:'center'}} value={this.state.inputPage} onChange={this.inputPage} /> {___.page}</span>
                    <FlatButton primary={true} label={___.ok} onClick={this.toInputPage}/>
                </div>
            </div>
        )
    }
}
//使用Page组件应当传入的props
Page.propTypes={
    curPage:React.PropTypes.number,//数字，当前页码
    totalPage:React.PropTypes.number,//数字，页码总数
    changePage:React.PropTypes.object,//方法，在输入了页码并点击确定之后，传入该页码，调用此方法
}

export default Page;