import React,{Component} from 'react';
import ImageNavigateBefore from 'material-ui/svg-icons/image/navigate-before'
import ImageNavigateNext from 'material-ui/svg-icons/image/navigate-next'
// import "../_sass/slider.css"

//  class Slider extends Component{
//     constructor(props,context){
//         super(props,context);
//         this.state = {
//             activeSlide: 0,
//             this:this
//         }
//         this.nextSlide = this.nextSlide.bind(this);
//         this.previousSlide = this.previousSlide.bind(this);
//         this.onChildChange = this.onChildChange.bind(this);
//     }
//     nextSlide(){
//         var slide = this.state.activeSlide + 1 < this.props.slides.length ? this.state.activeSlide + 1 : 0;
//         this.setState({activeSlide: slide})
//     }
//     previousSlide() {
//         var slide = this.state.activeSlide - 1 < 0 ? this.props.slides.length - 1 : this.state.activeSlide - 1;
//         this.setState({activeSlide: slide})
//     }
//     componentDidMount() {
//         setInterval(() => this.nextSlide(), this.props.time);
//     }
//     onChildChange(newVal){
//         var that = this.this;
//         if(newVal == "向左"){
//             that.previousSlide();
//         }else if(newVal == "向右"){
//             that.nextSlide()
//         }
//     }
//     render(){
//         var _this = this;
//         var slides = this.props.slides;
//         var slide = slides.map((ele,index) => {
//             return(
//                 <Slide 
//                     img={ele.img} 
//                     active={_this.state.activeSlide} 
//                     key={index}
//                     link={ele.link}
//                     change={_this.onChildChange}
//                     this={_this}
//                 />
//             )
//         })
//         return(
//             <div className="slider">
//                 {slide}
//                 <div className="slider__next" onClick={ev=>{this.nextSlide()}}>
//                     <i className="fa fa-4x fa-arrow-circle-right"></i>
//                 </div>
//                 <div className="slider__previous" onClick={ev=>{this.previousSlide()}}>
//                     <i className="fa fa-4x fa-arrow-circle-left"></i>
//                  </div>
//             </div>
            
//         ) 
//     }
    
// }
// class Slide extends Component {
//     constructor(props,context){
//         super(props,context)
//         this.state = {
//             startX: "",
//             startY: "",
//             endX: "",
//             endY: ""
//         }
//         this.touchEnd = this.touchEnd.bind(this);
//         this.touchStart = this.touchStart.bind(this);
//         this.GetSlideAngle = this.GetSlideAngle.bind(this);
//         this.GetSlideDirection = this.GetSlideDirection.bind(this);
//     }
//     touchStart(ev){
//         this.setState({
//             startX: ev.touches[0].pageX,
//             startY: ev.touches[0].pageY
//         })
//     }
//     touchEnd(ev){
//         this.setState({
//             endX: ev.changedTouches[0].pageX,
//             endY: ev.changedTouches[0].pageY
//         })
//         var that = this;
//         var direction = this.GetSlideDirection(this.state.startX, this.state.startY, this.state.endX, this.state.endY);
//         switch(direction) {
//             case 0:
//                 console.log("没滑动");
//                 break;
//             case 1:
//                 console.log("向上");
//                 break;
//             case 2:
//                 console.log("向下");
//                 break;
//             case 3:
//                 console.log("向左");
//                 that.props.change("向左")
//                 break;
//             case 4:
//                 console.log("向右");
//                 that.props.change("向右")
//                 break;
//             default:
//         }
//     }
//     GetSlideAngle(dx, dy){
//         return Math.atan2(dy, dx) * 180 / Math.PI;
//     }
//     GetSlideDirection(startX,startY,endX,endY){
//         var dy = startY - endY;
//         var dx = endX - startX;
//         var result = 0;
//         if(Math.abs(dx) < 2 && Math.abs(dy) < 2){
//             return result;
//         }
//         var angle = this.GetSlideAngle(dx,dy);
//         if(angle >= -45 && angle < 45){
//             result = 4
//         }else if(angle >= 45 && angle < 135){
//             result = 1;
//         }else if(angle >= -135 && angle < -45){
//             result = 2
//         }else if((angle >= 135 && angle <= 180)||(angle >= -180 && angle < -135)){
//             result = 3;
//         }
//         return result
//     }
//     render(){
//     var background = this.props.background;
//     var link = this.props.link;
//     var active = this.props.active;
//     var slideStyle = {
//         backgroundImage: "url(" + background + ")"
//     };
//     return(
//       <a href={link}>
//         <div className="slider__slide" data-active={active} style={slideStyle} onTouchStart={ev=>{this.touchStart(ev)}} onTouchEnd ={ev=>{this.touchEnd(ev)}}>
//         </div>
//       </a>
//     )
//   }
// }

 class Slider extends Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            activeSlide: 0,
            this:this
        }
        this.nextSlide = this.nextSlide.bind(this);
        this.previousSlide = this.previousSlide.bind(this);
        this.onChildChange = this.onChildChange.bind(this);
        this.liselect = this.liselect.bind(this);
        this.timer = null;
    }
    nextSlide(){
        var slide = this.state.activeSlide + 1 < this.props.slides.length ? this.state.activeSlide + 1 : 0;
        this.setState({activeSlide: slide});
        clearInterval(this.timer);
        this.timer = setInterval(() => this.nextSlide(), this.props.time)
    }
    previousSlide() {
        var slide = this.state.activeSlide - 1 < 0 ? this.props.slides.length - 1 : this.state.activeSlide - 1;
        this.setState({activeSlide: slide});
        clearInterval(this.timer);
        this.timer = setInterval(() => this.nextSlide(), this.props.time)
    }
    componentDidMount() {
        this.timer = setInterval(() => this.nextSlide(), this.props.time);
    }
    onChildChange(newVal){
        // var that = this.this;
        // var that = this;
        if(newVal == "向左"){
            this.previousSlide();
        }else if(newVal == "向右"){
            this.nextSlide()
        }
    }
    liselect(v){
        this.setState({activeSlide:v});
        clearInterval(this.timer);
        this.timer = setInterval(() => this.nextSlide(), this.props.time)
    }
    render(){
        var _this = this;
        var slides = this.props.slides;
        // console.log(slides,'slidessssssssssssssssss')
        let lis = null;
        var slide = null;
        if(slides){
            let width = window.screen.width
            let left = -width * _this.state.activeSlide
            let sty = {
                position:'relative',
                left: left,
            }
            slide = slides.map((ele,index) => {
                return(
                    <Slide 
                        style={sty}
                        img={ele.imgUrl} 
                        active={_this.state.activeSlide} 
                        key={index}
                        link={ele.link}
                        change={_this.onChildChange}
                        click={this.props.click}
                    />
                )
            })
            // if(this.state.activeSlide == 0) slide[0]=null;
            // // else slide[0]
            // if(this.state.activeSlide == slides.length-1){
            //     slide[0]=null;
            //     left = -width * slides.length
            //     sty.left = left
            //     slide.push(<Slide 
            //         style={sty}
            //         img={slides[0].imgUrl} 
            //         active={_this.state.activeSlide} 
            //         key={slides.length}
            //         link={slides[0].link}
            //         change={_this.onChildChange}
            //         click={this.props.click}
            //     />)
            //     console.log(slide,'slide')
            // }
            
            lis = slides.map((ele,index) => {
                if(index == this.state.activeSlide){
                    return(<li style={{height:10,width:10,background:'#666',float:'left',marginLeft:5,borderRadius:5}} onClick={() => {this.liselect(index)}}></li>)
                }else{
                    return(<li style={{height:10,width:10,background:'#fff',float:'left',marginLeft:5,borderRadius:5}} onClick={() => {this.liselect(index)}}></li>)
                }
            })
        }
       
        let width = slide.length * 15;
        let Mleft = -width/2 + 'px'
        return(
            <div style={{overflow:'hidden',width:'100%',height:'100%',position:'relative',display:'flex',flexWrap:'nowarp'}}>
                {/* <div> */}
                {slide}
                {/* </div> */}
                 <div style={{height:50,width:50,position:'absolute',top:'50%',marginTop:'-25px',right:0,}} onClick={ev=>{this.nextSlide()}}>
                    {/* <i className="fa fa-4x fa-arrow-circle-right"></i> */}
                    <ImageNavigateNext style={{width:50,height:50}} color={'rgba(0,0,0,0.1)'}/>
                </div>
                <div style={{height:50,width:50,position:'absolute',top:'50%',marginTop:'-25px',left:0,}} onClick={ev=>{this.previousSlide()}}>
                    {/* <i className="fa fa-4x fa-arrow-circle-left"></i> */}
                    <ImageNavigateBefore style={{width:50,height:50}} color={'rgba(0,0,0,0.1)'}/>
                 </div> 
                 <ul style={{listStyle:'none',position:'absolute',bottom:5,margin:0,padding:0 ,width:width, boxSizing: 'border-box', left: '50%',marginLeft: Mleft}}>
                     {lis}
                 </ul>
            </div>
            
        ) 
    }
    
}
class Slide extends Component{
    constructor(props,context){
        super(props,context)
        this.state = {
            startX:"",
            startY:"",
            endX:'',
            endY:''
        }
        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.GetSlideAngle = this.GetSlideAngle.bind(this);
        this.GetSlideDirection = this.GetSlideDirection.bind(this);
    }
    touchStart(ev){
        console.log(ev.touches[0],'touchstart')
        this.setState({
            startX: ev.touches[0].pageX,
            startY: ev.touches[0].pageY
        })
    }
    touchEnd(ev){
        // console.log(ev.changedTouches[0],'touchend')
        let endX = ev.changedTouches[0].pageX;
        let endY = ev.changedTouches[0].pageY;
        // console.log(this.state.startX,this.startY,'statxtyt')
        var direction = this.GetSlideDirection(this.state.startX, this.state.startY, endX, endY);
        // console.log(direction,'direction')
        switch(direction) {
            case 0:
                console.log("没滑动");
                break;
            case 1:
                console.log("向上");
                break;
            case 2:
                console.log("向下");
                break;
            case 3:
                console.log("向左");
                this.props.change("向左")
                break;
            case 4:
                console.log("向右");
                this.props.change("向右")
                break;
            default:
        }
    }
    GetSlideAngle(dx, dy){
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
    GetSlideDirection(startX,startY,endX,endY){
        var dy = startY - endY;
        var dx = endX - startX;
        // console.log(dy,dx,'dx,dx')
        var result = 0;
        if(Math.abs(dx) < 2 && Math.abs(dy) < 2){
            return result;
        }
        var angle = this.GetSlideAngle(dx,dy);
        // console.log(angle,'angle')
        if(angle >= -45 && angle < 45){
            result = 4
        }else if(angle >= 45 && angle < 135){
            result = 1;
        }else if(angle >= -135 && angle < -45){
            result = 2
        }else if((angle >= 135 && angle <= 180)||(angle >= -180 && angle < -135)){
            result = 3;
        }
        return result
    }
    render(){
        // console.log(this.props)
        let width = window.screen.width;
        // W.alert(width)
        // let left = -width * this.props.active
        // let sty = {
        //     position:'relative',
        //     left: left,
        //     transition:'left 1s'
        // }
        // if(this.props.active==0){
        //     sty = {
        //         position:'relative',
        //         left: left,
        //         transition:'left 0.1s'
        //     }  
        // }
        const {style} = this.props;
        return(
            <div>
                <div style={style}>
                    <img onTouchStart={this.touchStart} onTouchEnd={this.touchEnd} onClick={this.props.click} style={{width:width,height:210}} src={this.props.img} onTouchStart={ev=>{this.touchStart(ev)}}/>
                </div>
            </div>
        )
    }
}
export default Slider