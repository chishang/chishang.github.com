KISSY.add("map",function(S){
	/**
	 * google��ͼ
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
		 * ��ʼ����ͼ
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
		 * ��ӱ��
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
		 * ��ʾ����
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
			
			//�������markerʱ����ʾ����
			google.maps.event.addListener(marker, 'mouseover', function(e){ 
				    win.open(map);
			});
			//����ƿ�marker ���رյ���
			google.maps.event.addListener(marker, 'mouseout', function(e){
				S.later(win.close,later,false,win);
			});   
			//��ʾ����ʱ�����¼�
			google.maps.event.addListener(win, 'domready', function(e){ 
				    open&&open(win,index);
			});
		},
		/*
		 * ��ӱ��
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
		 * �Ƴ����
		 * @memberOf S.Map
		 * @param node
		 * @param {array|object} cfg
		 */
		removeMark:function(marker){
			marker.setMap(null);
		},
		/*
		 * �Ƴ�����
		 * @memberOf S.Map
		 * @param node
		 * @param {array|object} cfg
		 */
		removeInfoWin:function(win){
			win.close();
		},
		/*
		 * �ƶ�����
		 * @memberOf S.Map
		 * @param latlng
		 */
		center:function(latlng){
			var self=this,
			map=self.map;
			map.setCenter(latlng);
		},
		/*
		 * �������ż���
		 * @memberOf S.Map
		 * @param latlng
		 */
		zoom:function(size){
			var self=this,
			map=self.map;
			map.setZoom(size);
		},
		/*
		 * �������ż���
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
		 * ��ʾ·��
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
		 * �Ƴ����
		 * @param group
		 */
		remove:function(group){
			var self=this,
			map=self.map,
			mark=group.mark,
			infoWin=group.infoWin,
			path=group.path;
			//�Ƴ�ԭ����marker
			S.each(mark,function(marker,index,o){
				self.removeMark(marker);
			});
			//�Ƴ�ԭ����infoWin
			S.each(infoWin,function(win,index,o){
				self.removeInfoWin(win);
			});
			if(group.polyLine){
				group.polyLine.setMap(null);
			}
			
		},
		/*
		 * �Ƴ����
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


