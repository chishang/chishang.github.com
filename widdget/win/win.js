/**
 * ���������
 * �ع��ˣ�������
 * �ع����ڣ�2012-3-12
 */
KISSY.add("win", function(S){
    var D=S.DOM,E=S.Event;
    /**
	 * �������
	 * @class
	 * @name Win
	 * @constructor
	 * @param {String} winId  ����Ψһָ��ID
	 * @param {object}  config  ���ò���
	 * <prev>
	 * <br/>template {string}  ���ɿ�htmlģ��
	 * <br/>src:�����iframeҳ�����ø�������iframe��src����
	 * <br/>content {HTML|node} ������Զ������ݣ�����content����
	 * <br/>width �������
	 * <br/>height �����߶�
	 * <br/>sureFn  ���ȷ����ť�¼���
	 * <br/>cancelFn ���ȡ����ť�¼���
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
			 * ��������
			 * @field
			 * @name Win#config
			 * @type {object}
			 */ 		
			  S.mix(self.config,config);
        	  self.buildMask();  
        	  return this;     	  
    	  },
    	  
    	/**
		 * ��������
		 * @function
		 * @name Win#buildMask
		 * @private
		 */
    	  buildMask:function(){
    	  	var self = this;
    	  	var maskId="#J_Mask";
    	  	window.__Mask=S.one(maskId);
			if (!window.__Mask) {
				//����һ������
				window.__Mask = D.create('<div id="J_Mask"><iframe id="J_MaskFrame"></iframe></div>');				
				D.get("body").appendChild(__Mask);
			}
			D.css(__Mask,{
					width:D.docWidth() +'px',
					height:D.docHeight()+'px'
			});
			/**
			 * �������ֲ�
			 * @field
			 * @name Win#Mask
			 * @type {node}
			 */
			self.Mask =S.one(maskId);
			return this;
    	  },
    	/**
		 * ��ʾ���ֲ�
		 * @function
		 * @name Win#showMask
		 */
		showMask:function(){
			var self = this;
			self.Mask.show();
			return this;
		},
		/**
		 * �������ֲ�
		 * @function
		 * @name Win#hideMask
		 */
		hideMask: function() {
			var self = this;
			self.Mask.hide();
			return this;
		},
		/**
		 * ɾ�����ֲ�
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
		 * ����������
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
			 * ���ڶ���
			 * @field
			 * @name Win#box
			 * @type {kissyNode}
			 */
			self.box=winNode;
			self._content=winNode.one(".J_win_con");
			var width=cfg.width||400,
				height=cfg.height||"auto";
			//iframe��
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
			//���������content����
			if(cfg["content"]){
				self.setContent(cfg["content"]);
			}
			//��ʾ��	
			self._titleNode =winNode.one(".J_win_title");
			self._messageNode =winNode.one(".J_win_message");
        	self._sureNode =winNode.one(".J_win_sure");
        	//ȡ����ť
        	self._cancelNode =winNode.all(".J_win_cancel");	
        	self._cancelNode && self._cancelNode.on("click", function(){
        	  	self.hide();
        	  	cfg["cancelFn"] && cfg["cancelFn"]();
        	 });
        	 //�رհ�ť
        	self._closeNode = winNode.one(".J_win_close");	  
        	self._closeNode && self._closeNode.on("click", function(){	
        	  	  self.hide();
        	  	  cfg["cancelFn"] && cfg["cancelFn"]();
        	 }); 
        	//ȷ����ť�¼��󶨣����лص��������������лص��������ޣ���ֱ�����ز˵�
			self._sureNode && self._sureNode.on("click", function(){
				self.hide(); 
				cfg["sureFn"] && cfg["sureFn"]();	 
       	 	});	 	
			self.box.css({
				width:width,
				height:height
			});        	
        	//�����¼���
			E.on(window, "resize",self.setPos,self);
			E.on(window, "scroll",self.setPos,self);
			self.setPos();	
			return this;
		},
		/**
		 * ����box��content����
		 * @function
		 * @name Win#setContent
		 */	
		setContent:function(html){
			var self=this;
			self._content.html(html);
			return this;
		},
		/**
		 * ��ʾ������
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
		 * ���ص�����
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
		 * ����λ��
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
				"margin":0 //��Ҫ��Ϊ�˼���������marginΪ-0.5*boxw��box
			});	
			self.Mask && self.Mask.css({
				width:D.docWidth() +'px',
				height:D.docHeight()+'px'
			});
			return this;
		},
		/**
		 * ��ʾ���ڣ�����show�¼�
		 * �����¼���"show"
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
		 * ���ش��ڣ�����hide�¼�
		 * �����¼���"hide"
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
		 * ���洰��
		 * @function
		 * @name  Win#_warn
		 * @private
		 */
		_warn:function(message,title){
			var self=this;
			self.buildBox();
			var message=message,
			title=title||"ϵͳ��ʾ";
			self.box.addClass("J_win_error");
			self._sureNode && self._sureNode.hide();
			self.show(message,title);
			return this;
		},
		/**
		 * ������ȷ����
		 * @function
		 * @name  Win#_warn
		 * @private
		 */
		_inform:function(message,title){
			var self=this;
			self.buildBox();
			var message=message,
			title=title||"�����ɹ�";
			self.box.addClass("J_win_right");
			self._sureNode && self._sureNode.hide();
			self.show(message,title);
			return this;
		},
		/**
		 * ��ʾȷ�ϴ���
		 * @function
		 * @name  Win#_confirm
		 * @private
		 */
		_confirm:function(message,title){
			var self=this;
			self.buildBox();
			var message=message,
			title=title||"ϵͳ��ʾ";
			self.box.addClass("J_win_confirm");
			self.show(message,title);
			return this;
		},
		/**
		 * �������
		 * @function
		 * �����¼���"destroy"
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
		 * �Ƴ��󶨵��¼�
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
	 * ��ʾ/����
	 * ��̬������ֱ�ӵ��ã����������µ�ʵ��
	 * @function
	 * @static
	 * @name Win.warn
	 * @param {String} msg Ҫ��ʾ����Ϣ
	 * @param {String} title  ��ʾ���
	 * @example demo
	 * <pre>
	 * KISSY.use("win",function(S){
	 * 	S.Win.warn("Ҫ��ʾ������"��"ϵͳ��ʾ")
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
	  					'<a class="J_win_cancel" href="javascript:;">ȷ��</a>'+
	  				'</div>'+
	  			'</div>'
		});
		alertWin._warn(msg,title);
	}
	/**
	 * ����ȷ��
	 * ��̬������ֱ�ӵ��ã����������µ�ʵ��
	 * @static
	 * @function
	 * @name Win.confirm
	 * @param {String} msg Ҫ��ʾ����Ϣ
	 * @param {String} title ��Ϣ���
	 * @param {Function} sureFn ȷ����ť�ص�����
	 * @param {function} cancelFn ȡ����ť�¼��󶨻ص�����
	 * @example demo
	 * <pre>
	 * KISSY.use("win",function(S){
	 * 	S.Win.confirm("Ҫ��ʾ������"��,"title",function(){
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
		  					'<a class="J_win_cancel" href="javascript:;">ȡ��</a>'+
		  					'<a class="J_win_sure" href="javascript:;">ȷ��</a>'+
		  				'</div>'+
		  			'</div>',
		  	sureFn:sureFun,
		  	cancelFn:cancelFun
		});
		confirmWin._confirm(msg,title);
	}
	/**
	 * �����ɹ���ʾ
	 * ��̬������ֱ�ӵ��ã����������µ�ʵ��
	 * @static
	 * @function
	 * @name Win.inform
	 * @param {String} msg Ҫ��ʾ����Ϣ
	 * @param {String} title ��Ϣ���
	 * @example demo
	 * <pre>
	 * KISSY.use("win",function(S){
	 * 	S.Win.inform("Ҫ��ʾ������","title")
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
							  					'<a class="J_win_cancel" href="javascript:;">ȷ��</a>'+
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