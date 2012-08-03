KISSY.add("comment",function(S){
	/**
	 * 评论
	 * @class S.Conmment
	 * @param selector textarea节点id/class 选择符
	 * @param nNumber 显示字数限制节点
	 */
	function Comment(){
		this._init.apply(this,arguments);
	}
	S.augment(Comment,S.EventTarget,{
		_init:function(selector,cfg){
			var self=this,
			node=S.one(selector);
			if(!node){
				return false;
			}
			self._node=node;
			self._nNumber=cfg['number'];
			self.max=cfg['max'];
			self.strLimt(node,self.max,self._nNumber);
			self._bind();
		},
		_bind:function(){
			var self=this,
			node=self._node;
			node.on('focusin',function(e){
				node.removeClass("default");
			});
		},
		/**
		 * 字数限制
		 * @function
		 * @name Comment#strLimt
		 * @param {node}  area textarea节点
		 * @param {number}  max 最大数字
		 * @param  {node}  numWrap 显示剩余字符数的节点
		 */
		strLimt:function(area,max,numWrap){
			
			var self=this;
			area.on("keyup",function(e){
				var value=area.val(),
				len=value.length;
				if(len>=max){
					numWrap.html(0);
					area.val(value.substr(0, max));
				}else{
					numWrap.html(max-len);
				}
			});
		}
	});
	S.Comment=Comment;
});
