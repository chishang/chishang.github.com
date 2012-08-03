/**
 * 弹出框组件
 * 重构人：刘超武
 * 重构日期：2012-3-12
 */
KISSY.add("win", function(S){
    var D=S.DOM,E=S.Event;
    /**
	 * 弹窗组件
	 * @class
	 * @name Win
	 * @constructor
	 * @param {String} winId  窗口唯一指定ID
	 * @param {object}  config  配置参数
	 * <prev>
	 * <br/>template {string}  生成框html模板
	 * <br/>src:如果是iframe页，配置该项设置iframe的src属性
	 * <br/>content {HTML|node} 如果是自定义内容，设置content内容
	 * <br/>width 弹窗宽度
	 * <br/>height 弹窗高度
	 * <br/>sureFn  点击确定按钮事件绑定
	 * <br/>cancelFn 点击取消按钮事件绑定
	 * </prev>
	 */
    function Win(){
    	   this._init.apply(this, arguments);
    }
   S.augment(Win,S.EventTarget,{
        _init: function(winId,config){
        	  var self = this;
        	  self.config={
        	  	template:'<div class="J_win iframe-box" id="{winId}">'+
        	  				'<span class="J_win_close"></span>'+
			  				'<div class="J_win_border"></div>'+
			  				'<div class="J_win_con">'+
        	  					'<iframe frameborder="no"  marginwidth="0" marginheight="0" scrolling="no"  class="frame" src="{src}"  allowtransparency="yes"></iframe>'+
        	  				'</idv>'+
        	  			'</div>'
        	  };
        	  self.ID=winId;
	        /**
			 * 窗口配置
			 * @field
			 * @name Win#config
			 * @type {object}
			 */ 		
			  S.mix(self.config,config);
        	  self.buildMask();  
        	  return this;     	  
    	  },
    	  
    	/**
		 * 建立遮罩
		 * @function
		 * @name Win#buildMask
		 * @private
		 */
    	  buildMask:function(){
    	  	var self = this;
    	  	var maskId="#J_Mask";
    	  	window.__Mask=S.one(maskId);
			if (!window.__Mask) {
				//建立一个遮罩
				window.__Mask = D.create('<div id="J_Mask"><iframe id="J_MaskFrame"></iframe></div>');				
				D.get("body").appendChild(__Mask);
			}
			D.css(__Mask,{
					width:D.docWidth() +'px',
					height:D.docHeight()+'px'
			});
			/**
			 * 窗口遮罩层
			 * @field
			 * @name Win#Mask
			 * @type {node}
			 */
			self.Mask =S.one(maskId);
			return this;
    	  },
    	/**
		 * 显示遮罩层
		 * @function
		 * @name Win#showMask
		 */
		showMask:function(){
			var self = this;
			self.Mask.show();
			return this;
		},
		/**
		 * 隐藏遮罩层
		 * @function
		 * @name Win#hideMask
		 */
		hideMask: function() {
			var self = this;
			self.Mask.hide();
			return this;
		},
		/**
		 * 删除遮罩层
		 * @function
		 * @name Win#removeMask
		 */
		removeMask: function() {
			var self = this;
			D.remove(self.Mask);
			self.Mask=window.__Mask=null;
			return this;
		},
		
		/**
		 * 建立弹出层
		 * @function
		 * @name Win#buildBox
		 * @param
		 */
		buildBox: function() {
			var self = this,
				cfg=self.config,
				template=cfg["template"],
				src=cfg["src"]||"",
				winId=self.ID,
				box=D.create(template.replace(/{winId}/,winId).replace(/#/,"").replace(/{src}/,src));
				D.get("body").appendChild(box);
				var winNode=S.one(winId);				
		 
			/**
			 * 窗口对象
			 * @field
			 * @name Win#box
			 * @type {kissyNode}
			 */
			self.box=winNode;
			self._content=winNode.one(".J_win_con");
			var width=cfg.width||400,
				height=cfg.height||"auto";
			//iframe框
			self._shadowNode=winNode.one(".J_win_border");
			self._iframe=winNode.one(".frame");
			self._shadowNode && self._shadowNode.css({
				width:width+20+"px",
				height:height+30+"px"
			});
			self._iframe && self._iframe.css({
				width:width+"px",
				height:height+"px"
			});
			//如果配置了content属性
			if(cfg["content"]){
				self.setContent(cfg["content"]);
			}
			//提示框	
			self._titleNode =winNode.one(".J_win_title");
			self._messageNode =winNode.one(".J_win_message");
        	self._sureNode =winNode.one(".J_win_sure");
        	//取消按钮
        	self._cancelNode =winNode.all(".J_win_cancel");	
        	self._cancelNode && self._cancelNode.on("click", function(){
        	  	self.hide();
        	  	cfg["cancelFn"] && cfg["cancelFn"]();
        	 });
        	 //关闭按钮
        	self._closeNode = winNode.one(".J_win_close");	  
        	self._closeNode && self._closeNode.on("click", function(){	
        	  	  self.hide();
        	  	  cfg["cancelFn"] && cfg["cancelFn"]();
        	 }); 
        	//确定按钮事件绑定：若有回调函数，则先运行回调函数；无，则直接隐藏菜单
			self._sureNode && self._sureNode.on("click", function(){
				self.hide(); 
				cfg["sureFn"] && cfg["sureFn"]();	 
       	 	});	 	
			self.box.css({
				width:width,
				height:height
			});        	
        	//窗口事件绑定
			E.on(window, "resize",self.setPos,self);
			E.on(window, "scroll",self.setPos,self);
			self.setPos();	
			return this;
		},
		/**
		 * 设置box的content内容
		 * @function
		 * @name Win#setContent
		 */	
		setContent:function(html){
			var self=this;
			self._content.html(html);
			return this;
		},
		/**
		 * 显示弹出框
		 * @function
		 * @name Win#showBox
		 * @private
		 */	
		showBox:function(){
			var self=this;
			self.box.show();	
			return this;
		},
		/**
		 * 隐藏弹出框
		 * @function
		 * @name Win#hideBox
		 * @private
		 */
		hideBox:function(){
			var self=this;
			self.box.hide();
			return this;
		},
		/**
		 * 计算位置
		 * @function
		 * @name Win#setPos
		 * @private
		 */
		setPos: function() {	
			var self = this; 
			var box=self.box,
			winw = D.viewportWidth(), 
			winh = D.viewportHeight(),
			boxw=box.width(),
			boxh=box.height(),
			scrTop = D.scrollTop(), 
			top =(winh-boxh)/2+scrTop,
			left=(winw-boxw)/2;
			box.css({
				"top":top+"px",
				"left":left+"px",
				"margin":0 //主要是为了兼容设置了margin为-0.5*boxw的box
			});	
			self.Mask && self.Mask.css({
				width:D.docWidth() +'px',
				height:D.docHeight()+'px'
			});
			return this;
		},
		/**
		 * 显示窗口，触发show事件
		 * 监听事件："show"
		 * @function
		 * @name  Win#show
		 * @event  
		 */
		show: function(message,title) {
			var self = this;
			if(!self.box || !S.one(self.ID)){
				self.buildBox();
			}
			title && self._titleNode && self._titleNode.html(title);
        	message && self._messageNode && self._messageNode.html(message);			
			self.showMask();
			self.showBox();	
			self.fire("show");	
			return this;
		},
		
		/**
		 * 隐藏窗口，触发hide事件
		 * 监听事件："hide"
		 * @function
		 * @name  Win#hide
		 * @event  
		 */
		hide: function() {
			var self = this;
			self.hideBox();
			self.hideMask();
			self._remove();
			self.fire("hide");
			return this;
		},
		/**
		 * 警告窗口
		 * @function
		 * @name  Win#_warn
		 * @private
		 */
		_warn:function(message,title){
			var self=this;
			self.buildBox();
			var message=message,
			title=title||"系统提示";
			self.box.addClass("J_win_error");
			self._sureNode && self._sureNode.hide();
			self.show(message,title);
			return this;
		},
		/**
		 * 操作正确窗口
		 * @function
		 * @name  Win#_warn
		 * @private
		 */
		_inform:function(message,title){
			var self=this;
			self.buildBox();
			var message=message,
			title=title||"操作成功";
			self.box.addClass("J_win_right");
			self._sureNode && self._sureNode.hide();
			self.show(message,title);
			return this;
		},
		/**
		 * 显示确认窗口
		 * @function
		 * @name  Win#_confirm
		 * @private
		 */
		_confirm:function(message,title){
			var self=this;
			self.buildBox();
			var message=message,
			title=title||"系统提示";
			self.box.addClass("J_win_confirm");
			self.show(message,title);
			return this;
		},
		/**
		 * 消除组件
		 * @function
		 * 监听事件："destroy"
		 * @name Win#destroy
		 * @event 
		 */
		destroy:function(){
			var self=this;
			D.remove(self.box);
			self.box = null;
			E.detach(window,"resize",self.setPos,self);
			E.detach(window,"scroll",self.setPos,self);
			self.removeMask();
			self.fire("destroy");
			return this;
		},
        /**
		 * 移除绑定的事件
		 * @function
		 * @name  Win#remove
		 * @private
		 */
		_remove: function() {
			var self = this;
			D.remove(self.box);
			E.detach(window,"resize",self.setPos,self);
			E.detach(window,"scroll",self.setPos,self);
			return this;
		}
  });
    
    /**
	 * 提示/警告
	 * 静态方法，直接调用，不用生成新的实例
	 * @function
	 * @static
	 * @name Win.warn
	 * @param {String} msg 要显示的消息
	 * @param {String} title  提示类别
	 * @example demo
	 * <pre>
	 * KISSY.use("win",function(S){
	 * 	S.Win.warn("要显示的文字"，"系统提示")
	 * })
	 * </pre>
	 */
	Win.warn= function(msg,title){
		var alertWin=new Win("#J_alertWin",{		
	  	template:'<div class="J_win" id="{winId}">'+
	  				'<h1 class="J_win_header">'+
	  					'<span class="J_win_title"></span>'+
	  					'<span class="J_win_close"></span>'+
	  				'</h1>'+
	  				'<div class="J_win_con">'+
	  					'<span class="J_win_message"></span>'+
	  				'</div>'+
	  				'<div class="J_win_footer">'+		
	  					'<a class="J_win_cancel" href="javascript:;">确定</a>'+
	  				'</div>'+
	  			'</div>'
		});
		alertWin._warn(msg,title);
	}
	/**
	 * 二次确认
	 * 静态方法，直接调用，不用生成新的实例
	 * @static
	 * @function
	 * @name Win.confirm
	 * @param {String} msg 要显示的消息
	 * @param {String} title 消息类别
	 * @param {Function} sureFn 确定按钮回调函数
	 * @param {function} cancelFn 取消按钮事件绑定回调函数
	 * @example demo
	 * <pre>
	 * KISSY.use("win",function(S){
	 * 	S.Win.confirm("要显示的文字"，,"title",function(){
	 * 		//do something...
	 * 	},function(){
	 * 	//do something...
	 * });
	 * });
	 * </pre>
	 */
	Win.confirm = function(msg,title,sureFun,cancelFun){
		var confirmWin=new Win("#J_confirmWin",{	
		  	template:'<div class="J_win" id="{winId}">'+
		  				'<h1 class="J_win_header">'+
		  					'<span class="J_win_title"></span>'+
		  					'<span class="J_win_close"></span>'+
		  				'</h1>'+
		  				'<div class="J_win_con">'+
		  					'<span class="J_win_message"></span>'+
		  				'</div>'+
		  				'<div class="J_win_footer">'+
		  					'<a class="J_win_cancel" href="javascript:;">取消</a>'+
		  					'<a class="J_win_sure" href="javascript:;">确定</a>'+
		  				'</div>'+
		  			'</div>',
		  	sureFn:sureFun,
		  	cancelFn:cancelFun
		});
		confirmWin._confirm(msg,title);
	}
	/**
	 * 操作成功提示
	 * 静态方法，直接调用，不用生成新的实例
	 * @static
	 * @function
	 * @name Win.inform
	 * @param {String} msg 要显示的消息
	 * @param {String} title 消息类别
	 * @example demo
	 * <pre>
	 * KISSY.use("win",function(S){
	 * 	S.Win.inform("要显示的文字","title")
	 * });
	 * </pre>
	 */
	Win.inform= function(msg,title){
		var informWin=new Win("#J_informWin",{			
							  	template:'<div class="J_win" id="{winId}">'+
							  				'<h1 class="J_win_header">'+
							  					'<span class="J_win_title"></span>'+
							  					'<span class="J_win_close"></span>'+
							  				'</h1>'+
							  				'<div class="J_win_con">'+
							  					'<span class="J_win_message"></span>'+
							  				'</div>'+
							  				'<div class="J_win_footer">'+
							  					'<a class="J_win_cancel" href="javascript:;">确定</a>'+
							  				'</div>'+
							  			'</div>'
							});
		informWin._inform(msg,title);
		
	}
	 S.Win=Win;
	 return Win;
},{
	attach:false,
	requires:['sizzle','win.css']
});