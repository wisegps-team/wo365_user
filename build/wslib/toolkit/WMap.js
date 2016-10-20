/**
 * 百度地图封装类
 * 需要监听到window的W.mapready事件之后才能使用
 * 目的是封装百度地图，简化使用，目前非常不完善，只有几个基本方法
 */
W.include("http://api.map.baidu.com/api?v=2.0&ak=647127add68dd0a3ed1051fd68e78900&callback=WMap.mapInit");

//类构造
function WMap(id,lat,lon,zoom){
	lat=lat||116.417854;
	lon=lon||39.921988;
	zoom=zoom||15;
	var map = new BMap.Map(id);//地图实例化
	map.centerAndZoom(new BMap.Point(lat,lon),zoom);
    //控件
    // var zoomControl = new BMap.NavigationControl({type:BMAP_NAVIGATION_CONTROL_ZOOM,anchor:BMAP_ANCHOR_BOTTOM_RIGHT,offset: new BMap.Size(5, 20)});
    // map.addControl(zoomControl);//添加缩放控件
    // map.addEventListener("tilesloaded", function(){W(".anchorBL").style.display="none";});//隐藏地图底部文字
    Object.assign(map,WMap.prototype);
    return map
}

WMap.prototype.moveTo=function(lon,lat){
	this.panTo(new BMap.Point(lon,lat));
}

//添加一个标点,传递标点的构造信息，目前只需要lat,lon
WMap.prototype.addMarker=function(data){
    if(!data){return;}
	var marker;
    if(data.img){
    	var icon = new BMap.Icon(data.img, new BMap.Size(data.w,data.h));
    	marker = new BMap.Marker(new BMap.Point(data.lon,data.lat),{icon:icon});
    }else
    	marker = new BMap.Marker(new BMap.Point(data.lon,data.lat));
	this.addOverlay(marker);  
    return marker;
}

WMap.mapInit=function(){
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("W.mapready", false, false);
	window.dispatchEvent(evt);
	Object.assign(WMap,BMap);
	WMap.status=200;
}



//WMap.prototype.loadCar=function(data){ //绘制车辆
//  if(!data||data.length===0)
//      return;
//  
//  this.carMk=new Array();
//  var point=new Array();
//  for(var i=0;i<carData.length;i++){
//      //创建一个车辆marker
//      this.addCarMarker();
//  }
//  //如果是初次加载车辆，则设置地图层级
//  map.setViewport(map.getViewport(point));
//  askId=setTimeout(askAllPos,tiemOut);
//
//  this._dataOndraw=true;//标记当前数据已经被更新到地图上
//  this._carData=data;
//}
//
//
//
//WMap.prototype.setCarMk=function(carMk,data){
//  var carIcon = carMk.getIcon();
//  carIcon.setSize(new BMap.Size(28, 28));
//  var iconUrl;
//  var carI=getCarInfo(data);
//  switch (carI.state) {
//      case "alert":
//          iconUrl = "image/car_alert.png";
//          break;
//      case "on":
//          iconUrl = "image/car_on.png";
//          break;
//      case "off":
//          iconUrl = "image/car_off.png";
//          break;
//      case "out":
//          iconUrl = "image/car_out.png";
//  }
//
//  carIcon.setImageUrl(iconUrl);
//  carMk.setIcon(carIcon);
//  carMk.setPosition(carI.point);
//  carMk.setRotation(carI.rota);
//  return carI.point;
//}
//
//
//
//function carMarker(point,opt){
//	if(!opt.icon)
//		opt.icon=new BMap.Icon(iconUrl,new BMap.Size(28, 28));
//  var marker = new BMap.Marker(point, {icon: myIcon, rotation: rota});
//  return marker;
//}
