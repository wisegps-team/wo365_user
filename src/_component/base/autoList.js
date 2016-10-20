/**
 * 08/004
 * 小吴
 * 带自动加载的高阶组件
 */
import React, {Component} from 'react';


function AutoList(ShowComponent){
    return class Com extends Component{
        constructor(props, context) {
            super(props, context);
            this.state={
                page:0,//已经加载的页
                waiting:false
            }
            this.setPage();
            this.scroll = this.scroll.bind(this);
        }
        componentDidMount() {
            document.addEventListener('scroll',this.scroll);
        }
        componentWillUnmount() {
            document.removeEventListener('scroll',this.scroll);
        }
        componentWillReceiveProps(nextProps) {
            let waiting = this.state.waiting&&(nextProps.data.length==this.props.data.length);
            this.setState({waiting});
            this.setPage(nextProps);
        }

        setPage(props){
            if(!props){
                this.state.page=Math.ceil(this.props.data.length/this.props.limit);
            }else{
                let page=Math.ceil(props.data.length/props.limit);
                this.setState({page});
            } 
        }
        

        scroll(e){
            let div=this.refs.main;
            if(div.offsetHeight&&!this.state.waiting){//有长度，说明是正在显示
                let se = document.documentElement.clientHeight; //浏览器可见区域高度。
                let bottom = div.getBoundingClientRect().bottom-se; //元素底端到可见区域底端的距离
                if (bottom<50) {
                    this.setState({waiting:true});
                    this.props.next();
                }
            }
        }
        
        render() {
            if(this.props.max>=0&&this.props.max<=this.props.data.length){
                this.componentWillUnmount();
            }
            let pages=[];
            for(let i=0;i<this.state.page;i++)
                pages.push(<ShowComponent 
                    data={this.props.data.slice(i*this.props.limit,(i+1)*this.props.limit)}
                    key={i}
                />);
            if(this.state.waiting)
                pages.push(<ShowComponent 
                    data={null}
                    key={pages.length}
                />);
            return (
                <div ref={'main'}>
                    {pages}
                </div>
            );
        }
    }
}
export default AutoList;
