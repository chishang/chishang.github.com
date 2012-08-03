KISSY.add("map",function(S){
	/**
	 * google地图
	 * @class S.Map
	 */
	function Map(){
		this._init.apply(this,arguments);
	}
	S.augment(Map,{
		_init:function(cfg){
			var self=this,
			node=cfg.node,
			options=cfg.options;
			self.map=self._buildMap(node,options);
			self.group={};
			cfg.mark&&self.addMark(cfg.mark);
			if(cfg["rightclick"]){
				self.rightClick(cfg["rightclick"]);
			}
		},
		/*
		 * 初始化地图
		 * @memberOf S.Map
		 * @param node
		 * @param options
		 */
		_buildMap:function(node,options){
			var self=this;
			var map=new google.maps.Map(node, options);
			return map;
		},
		rightClick:function(callback){
			var self=this,
			map=self.map;
			google.maps.event.addListener(map, 'rightclick', function(e){ 
				     callback(e);
			});
		},
		/*
		 * 添加标记
		 * @memberOf S.Map
		 * @param node
		 * @param {array|object} cfg
		 */
		addMark:function(cfg){
			var self=this;
			S.isArray(cfg)?S.each(cfg,function(val,index,o){
				self._addMark(val);
			}):self._addMark(cfg);
			
		},
		/*
		 * 提示窗口
		 */
		_addInfoWin:function(cfg){
			var self=this,
			map=self.map,
			con=cfg["content"],
			marker=cfg["marker"],
			group=cfg["group"],
			later=cfg["later"]||3000,
			latlng=marker.getPosition(),
			open=cfg["open"],
			win=new google.maps.InfoWindow({
			 	content:con,
			 	position:latlng
			 });
			var index=group.infoWin.length;
			group.infoWin.push(win);
			
			//鼠标移入marker时，显示弹窗
			google.maps.event.addListener(marker, 'mouseover', function(e){ 
				    win.open(map);
			});
			//鼠标移开marker ，关闭弹窗
			google.maps.event.addListener(marker, 'mouseout', function(e){
				S.later(win.close,later,false,win);
			});   
			//显示弹窗时，绑定事件
			google.maps.event.addListener(win, 'domready', function(e){ 
				    open&&open(win,index);
			});
		},
		/*
		 * 添加标记
		 */
		_addMark:function(cfg){
			var self=this,
			group=cfg['group'],
			map=self.map,
			mark=group.mark,
			path=group.path,
			lat=cfg.position[0],
			lng=cfg.position[1],
			title=cfg.title,
			handle=cfg.handle,
			infoWin=cfg.infoWin,
			icon=cfg.icon||"",
			latlng= new google.maps.LatLng(lat, lng),
			marker=new google.maps.Marker({
					  	position:latlng,
					  	visible:true,
					  	clickable:true,
					  	title:title,
					  	icon:icon
			 });
			 mark.push(marker);
			 marker.setMap(map);
			 self.center(latlng);
			 path.push(latlng);
			 if(handle){
				 	google.maps.event.addListener(marker, 'click', function(e){ 
				    handle(marker,e);
				}); 
			 if(infoWin){
			 	infoWin["marker"]=marker;
			 	self._addInfoWin(infoWin);
			 	}
			 }
			 
		},
		/*
		 * 移除标记
		 * @memberOf S.Map
		 * @param node
		 * @param {array|object} cfg
		 */
		removeMark:function(marker){
			marker.setMap(null);
		},
		/*
		 * 移除弹窗
		 * @memberOf S.Map
		 * @param node
		 * @param {array|object} cfg
		 */
		removeInfoWin:function(win){
			win.close();
		},
		/*
		 * 移动焦点
		 * @memberOf S.Map
		 * @param latlng
		 */
		center:function(latlng){
			var self=this,
			map=self.map;
			map.setCenter(latlng);
		},
		/*
		 * 设置缩放级别
		 * @memberOf S.Map
		 * @param latlng
		 */
		zoom:function(size){
			var self=this,
			map=self.map;
			map.setZoom(size);
		},
		/*
		 * 扩大缩放级别
		 * @memberOf S.Map
		 * @param latlng
		 */
		larger:function(){
			var self=this,
			map=self.map,
			zoom=map.getZoom()+1;
			self.zoom(zoom);
		},
		/*
		 * 显示路径
		 */
		showLine:function(group){
			var self=this,
			path=group.path,
			map=self.map,
			line=new google.maps.Polyline({
				path:path,
				map:map,
				strokeColor:"#000",
				visible:true,
				geodesic:true
			});
		},
		addGroup:function(name){
			var self=this,
			group=self.group;
			if(S.isObject(group[name])){
				self.remove(group[name]);
			}
			group[name]=new Object();
			group[name].mark=[];
			group[name].infoWin=[];
			group[name].path=[];
			return group[name];
		},
		/*
		 * 移除标记
		 * @param group
		 */
		remove:function(group){
			var self=this,
			map=self.map,
			mark=group.mark,
			infoWin=group.infoWin,
			path=group.path;
			//移除原来的marker
			S.each(mark,function(marker,index,o){
				self.removeMark(marker);
			});
			//移除原来的infoWin
			S.each(infoWin,function(win,index,o){
				self.removeInfoWin(win);
			});
			if(group.polyLine){
				group.polyLine.setMap(null);
			}
			
		},
		/*
		 * 移除标记
		 * @param markarr
		 */
		drawLine:function(markarr){
			var self=this,
			map=self.map,
			polyLine=new google.maps.Polyline({
				map:map,
				path:markarr,
				strokeColor:"#ff0000"
			});
			return polyLine;
			
		}
	});
	S.Map=Map;
	return Map;
},{
	attach:false,
	requires:['sizzle']
});


