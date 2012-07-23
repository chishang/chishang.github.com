/**
 * @author dongzhu
 */
KISSY.add("comment",function(S){
	/**
	 * ����
	 * @class S.Conmment
	 * @param selector textarea�ڵ�id/class ѡ���
	 * @param nNumber ��ʾ�������ƽڵ�
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
		 * ��������
		 * @function
		 * @name Comment#strLimt
		 * @param {node}  area textarea�ڵ�
		 * @param {number}  max �������
		 * @param  {node}  numWrap ��ʾʣ���ַ����Ľڵ�
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
