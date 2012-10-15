/**
 * @author chishang.lcw
 */

YUI.namespace('Radio');
YUI.add('radio', function(Y) {
	/**
	 * 单选框组件
	 * @name Radio
	 * @param userCONFIG
	 * <br/>--container {Selector} 单选按钮所在容器
	 * <br/>--radioClass {String} radio节点的class name
	 * <br/>--BoxClass {String} radio的父节点的class name
	 * <br/>--index {Number} 默认选择第几个radio（defalut:0)
	 * <br/>--selectedClass {String} 当radio被选中时，父节点的class name
 	 */
    function Radio() {
        Radio.superclass.constructor.apply(this, arguments);
    };

    Radio.NAME = 'Radio';
    Radio.ATTRS = {};

    Y.extend(Radio, Y.Base, {
        initializer: function(userCONFIG) {
        	var container=Y.one(userCONFIG.container);
        	if(Y.Lang.isUndefined(container)){
        		return ;
        	}
            var that = this;
            var GUID = Y.guid();
            var CONFIG = {
            	radioClass:'radio',
            	radioBoxClass:'radio-box',
                GUID: GUID,
                index:0,
                selectedClass:'selected'
            };
            CONFIG = Y.merge(CONFIG, userCONFIG);
            CONFIG=Y.merge(CONFIG,{
            	container:container,
            	radioSelector:'.'+CONFIG.radioClass,
            	radioBoxSelector:'.'+CONFIG.radioBoxClass
            });
            that._updateCONFIG(CONFIG);
            //获取DOM节点
            that.bindUI();
           //绑定事件
            that.bindEvent();
            //获取初始值
            that.initChecked();
            return that;
        },
        /**
         * 获取DOM节点
         */
        bindUI:function(){
        	var that=this;
        	var container=that.get("container"),
        	radioSelector=that.get("radioSelector"),
        	radioBoxSelector=that.get("radioBoxSelector");
        	//获取radio节点
            var radioNodes=container.all(radioSelector);
            that.set('radioNodes',radioNodes);
            //获取radio的父节点
            var radioBoxNodes=container.all(radioBoxSelector);
            that.set('radioBoxNodes',radioBoxNodes);
            return that;
        },
        reload:function(){
        	var that=this;
        	that.set("selected",null);
        	that.bindUI();
        	that.bindEvent();
        	 //获取初始值
            that.initChecked();
            return that;
        },
		check: function(index) {
           var that=this,
           CONFIG=that.getAttrs(),
           radioNodes=that.get("radioNodes"),
           radioBoxNodes=that.get("radioBoxNodes"),
           selectedClass=CONFIG['selectedClass'],
           target=radioNodes.item(index),
           parent=radioBoxNodes.item(index);
           if(!target){
           	return that;
           }
          //清除之前的标记
          radioNodes.set("checked",false);
          radioNodes.setAttribute('data-radio-checked',"false");
          radioBoxNodes.removeClass(selectedClass);
          //置选择项为checked
          target.set('checked',true);
          target.setAttribute('data-radio-checked',"true");
          parent.addClass(selectedClass);
          that.set("selected",{
           		node:target,
           		index:index,
           		value:target.get("value")
          });
          that.fire('radio:select',{
           		node:target,
           		index:index
           });
           return that;
        },
		getChecked:function(){
			var that=this,
			radioNodes=that.get("radioNodes"),
			index=null;
			radioNodes.each(function(v,k,o){
				var checked=v.get("checked");
				if(checked){
					index=k; 
				}
			});
			
			return index;
		},
		initChecked:function(){
			var that=this;
			var index=that.getChecked();
			that.check(index);
			return that;
		},
        bindEvent: function() {
            var that=this;
            var radioNodes=that.get('radioNodes');
            //radio点击事件
            Y.each(radioNodes,function(k,v,o){
            	k.on('click',function(e){
	            	var target=e.currentTarget,
	            	ischecked=target.getAttribute('data-radio-checked');
	            	if(ischecked==="true"){
						return;
	            	}else{
	            		that.check(v);
	            	}
	            	 
	            });
            });
            return that;
        },
        destroy: function() {
            var that = this;
            var CONFIG = that._getCONFIG();
            that._updateCONFIG({self: null});
            that.isHidden = true;
        },
        setConfig: function(CONFIG) {
            var that = this;
            return that._updateCONFIG(CONFIG);
        },
        _updateCONFIG: function(CONFIG) {
            var that = this;
            Y.Object.each(CONFIG, function(o, i, r) {
                that.set(i, o);
            });
            return that._getCONFIG();
        },
        _getCONFIG: function() {
            var that = this;
            return that.getAttrs();
        }
    });
    Y.Radio = Radio;
}, '1.0.0');

