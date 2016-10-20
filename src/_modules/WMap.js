/**
 * 百度地图封装类
 * 需要监听到window的W.mapready事件之后才能使用
 * 目的是封装百度地图，简化使用，目前非常不完善，只有几个基本方法
 */
if(WiStorm.config.map=='BAIDU')
	W.include("http://api.map.baidu.com/api?v=2.0&ak=647127add68dd0a3ed1051fd68e78900&callback=__WMap_mapInit");
else
	// W.include("https://www.google.cn/maps/api/js?key=AIzaSyDPwroSpXMst_Esu2GUnw5K_6LTS4wuNBc&callback=__WMap_mapInit");
	W.include("https://maps.googleapis.com/maps/api/js?key=AIzaSyDPwroSpXMst_Esu2GUnw5K_6LTS4wuNBc&callback=__WMap_mapInit");

//类构造
function WMap(){
}

//异步加载百度地图需要一个全局方法，以供类似jsonp方式的使用
window.__WMap_mapInit=function(){
	init();
	WMap.ready=200;
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("W.mapready", false, false);
	window.dispatchEvent(evt);
}

function init(){
	if(WiStorm.config.map=='BAIDU'){
		baiduInit();
	}else
		googleInit();
	
	allInit();
}

function allInit(){
	WMap.Map.prototype.moveTo=function(lon,lat){
		this.panTo(new WMap.Point(lon,lat));
	}

	//添加一个标点,传递标点的构造信息，目前只需要lat,lon
	WMap.Map.prototype.addMarker=function(data){
		if(!data){return;}
		var marker;
		if(data.img){
			var icon = new WMap.Icon(data.img, new WMap.Size(data.w,data.h));
			marker = new WMap.Marker(new WMap.Point(data.lon,data.lat),{icon:icon});
		}else
			marker = new WMap.Marker(new WMap.Point(data.lon,data.lat));
		this.addOverlay(marker);  
		return marker;
	}
}

function baiduInit(){
	Object.assign(WMap,BMap);
	WMap.Map=class Map extends BMap.Map{
		constructor(id){
			super(document.getElementById(id));
			this.centerAndZoom(new BMap.Point(116.404, 39.915), 15);  // 初始化地图,设置中心点坐标和地图级别
		}
	}
}

function googleInit(){
	google.maps.MVCObject.prototype.addEventListener=function(name,callback){
		if(name='close')
			name='closeclick';
		this.addListener(name,callback);
	};
	Object.assign(WMap,google.maps);
	WMap.Map=class Map extends google.maps.Map {
		constructor(id) {
			super(document.getElementById(id),{
				center: {lat: 39.921988, lng: 116.417854},
    			zoom: 5
			});

			this._ove=[];
			this._window=[];
		}
		setViewport(arr){
			let b=new google.maps.LatLngBounds(arr[0],arr[0]);
			arr.forEach(p=>b.extend(p));
			this.fitBounds(b);
		}
		addOverlay(ove){
			if(!ove)return;
			ove.setMap(this);
			this._ove.push(ove);
		}
		removeOverlay(ove){
			if(!ove)return;
			ove.setMap(null);
			let i=this._ove.indexOf(ove);
			if(i!=-1)this._ove.splice(i,1);
		}
		clearOverlays(){
			this._ove.forEach(o=>o.setMap(null));
			this._ove=[];
		}
		closeInfoWindow(){
			this._window.forEach(w=>w.close());
			this._window=[];
		}
		enableScrollWheelZoom(){

		}
		addControl(){

		}
	}

	/**
	 * Marker对象
	 */
	WMap.Marker=class Marker extends google.maps.Marker{
		constructor(point, opt) {
			let op=Object.assign({},{position:point},opt);
			super(op);
			this._icon=opt.icon;
			this._rotation=0;
			this._setIcon=google.maps.Marker.prototype.setIcon;
			this.addEventListener=this.addListener;
		}
		getIcon(){//获取原始的icon
			return this._icon;
		}
		setIcon(icon){
			this._icon=icon;
			this.setRotation(this._rotation);
			this.setOffset();
		}
		setRotation(rot=0){//设置marker的旋转方向
			let r=Math.round(rot/45)*45;
			if(r>=360)r=0;
			let icon=this.getIcon();
			if(!icon)return;
			icon.url=icon.url.replace(/\d+\.\w*/,w=>w.replace(/\d*/,r));//替换角度
			let ic=Object.assign({},google.maps.Marker.prototype.getIcon.call(this),icon);
			google.maps.Marker.prototype.setIcon.call(this,ic);
		}
		openInfoWindow(infoWindow){
			let map=this.getMap();
			infoWindow.open(map,this);
			map._window.push(infoWindow);
		}
		setOffset(size){
			let ic=google.maps.Marker.prototype.getIcon.call(this);
			let _ic=this.getIcon();
			if(!ic&&_ic)
				ic=_ic;
			let icon=Object.assign({},ic,_ic);
			if(ic&&size){
				icon.anchor=new WMap.Point(size.width,size.height);
			}else if(ic&&!icon.anchor){
				icon.anchor=new WMap.Point(Math.round(icon.size.width/2),Math.round(icon.size.height/2));
			}
			google.maps.Marker.prototype.setIcon.call(this,icon);
		}
		getOffset(){

		}
	}
	/**
	 * 百度的Icon对象
	 */
	WMap.Icon=class icon {
		constructor(img,size) {
			this.url=img;
			this.size=size;
		}
		setImageUrl(url){
			this.url=url;
		}
	}

	/**
	 * 百度的Icon对象
	 */
	WMap.Point=class point extends google.maps.Point {
		constructor(lng,lat) {
			lng=parseFloat(lng);
			lat=parseFloat(lat);
			super(lng,lat);
			this.lng=lng;
			this.lat=lat;
		}
	}

	/**
	 * 位置转换
	 */
	WMap.Geocoder=class g extends google.maps.Geocoder {
		getLocation(point,callback){
			this.geocode({location:point},function(res){
				let newRes={
					_address:res,
					formatted_address:res[0].formatted_address,
					addressComponent:res[0].address_components,
					address:res[0].formatted_address
				}
				callback(newRes);
			});
		}		
	}

	/**
	 * WMap.Polyline  折线类
	 */
	WMap.Polyline=class po extends google.maps.Polyline {
		constructor(path, opt) {
			let op=Object.assign({},{path},opt);
			super(op);
		}

	}

	/**
	 * 对应百度的控件类，谷歌里没有现成的，都需要自己去实现，不过常用控件都已经默认放在地图上了
	 * 下面几个是百度控件的常量，不过在谷歌里暂时还没有用到，就没有实现
	 */
	WMap.NavigationControl=class n extends google.maps.MVCObject {
		
	}
	window.BMAP_NAVIGATION_CONTROL_ZOOM=null;
	window.BMAP_ANCHOR_BOTTOM_RIGHT=null;
}


export default WMap;