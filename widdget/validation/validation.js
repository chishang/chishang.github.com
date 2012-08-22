KISSY.add('validation/base', function (S) {
	/**
	 * 表单验证组件
	 * @constructor
	 * @name Validation
	 * @param {id} ID form表单id 属性值
	 * @param {object} textbox:
	 * <br/>-tipCls：提示框class,默认值为 "input-tip"
	 * <br/>-contentCls:textbox所在容器,默认值为 "input-box"
	 * <br/>-textbox {object} 需验证的文本框:
	 * 	<br/>--contentCls input 表单所在box的class
	 * 	<br/>--tipCls 信息提示元素的class
	 * 	<br/>--list
	 * 	<br/>-checkBox 必须勾选的checkbox 格式为[node,node,···]
	 * @description 如果要用自带的样式，请在form中添加自带选择权ks-tdform
	 */
    function Validation() {
        this._init.apply(this, arguments);
    }
    S.augment(Validation,S.EventTarget,{
        
        _init: function (id, config) {
            var self = this;
            self.form=S.one(id);
            /**
             * 需要验证的个数
             * @field @name Validation#num
             */
            self.num=0;
            /**
             * 通过验证的个数
             * @field @name Validation#passNum
             */
            self.passNum=0;
            self.config={
            	tipCls:"input-tip",
            	contentCls:"input-content"
            };
            S.mix(self.config, config);
           	self._buildTextBoxList();
           	self._bind();
           },
        /**
		 * 表单提交事件绑定
		 * @function 
		 * @name Validation#bind
		 * @private
		 */
		_bind:function(){
			var self=this,
			cfg=self.config,
			form=self.form;
			form.on("submit",function(e){
				self.valid();
				if(self.passNum!=self.num){
					e.halt();
				}else{
					if(cfg.submit){
						cfg.submit(e);
					}
				}
			});
		},
        /**
		 * 构建textboxList数组
		 * @function 
		 * @name Validation#buildTextBoxList
		 * @private
		 */
        _buildTextBoxList: function () {
            var self = this;
	        /**
			 * 待验证的文本框数组
			 * @field
			 * @name Validation#textBoxList
			 */
            self.textBoxList = [];
            var config= self.config,
            list =config.list,
            len = list.length,
            tipCls=config.tipCls,
            contentCls=config.contentCls;
            for (var i = 0; i < len; i++) {

                if (!list[i].tipCls) {
                    list[i].tipCls =tipCls;
                }
                if (!list[i].contentCls) {
                    list[i].contentCls =contentCls;
                }
                var item=new S.TextBoxValid(list[i]);
                if(item){
                	self.num++;
                	self.textBoxList.push(item);
                }
               
            };
        },
        /**
		 * 检查是否通过验证
		 * @function 
		 * @name Validation#valid
		 */
        valid: function () {
            var self = this,
            List = self.textBoxList;
            //先将已通过数置零
            self.passNum=0;
            for (var i in List) {
            	var item=List[i];
            	//如果是异步请求
            	if(item.ajax){
            		 var timer=S.later(checkAjax,100,true);
            		 function checkAjax(){
            		 	
            		 }
            	}else{
            		var checked = List[i].validation();
                    if (checked) {
                        self.passNum++;
                    }
            	}
                }
            if(self.passNum==self.num){
            	return true;
            }else{
            	return false;
            }
            
        }
    });
    return Validation;
},
{
    attach: false,
    requires: ['sizzle', './textbox']
});

KISSY.add('validation/textbox', function (S) {
	/**
     * 文本框验证组件
     * @constructor
     * @name TextBoxValid
     * @param {Object} config
     * <prev>
     * <br/>defVal  input默认值     
     * <br/>contentCls 整个验证器的容器    
     * <br/>tipCls 提示框class  必选
     * <br/>checkObj input需要验证的规则 (必选):
     * -reg:验证函数/正则表单式/字符串
     * -rightMes:正确提示
     * -errorMes:错误提示文案
     * <br/>allowNull 是否允许空值  默认为false
     * </prev>
     */
    function TextBoxValid() {
        this._init.apply(this, arguments);
    }
    S.augment(TextBoxValid, {
        /**
         * 初始化
         * @function
         * @private
         */
        _init: function (config) {
            if (!config) {
                return false;
            } else if (!config.node) {
                return false;
            }
            var self = this;
            /**
             * 参数配置
             * @field
		 	 * @name TextBoxValid#config
             */
            self.config = config;
            var node =S.one(config.node),
            content = node.parent('.' + config.contentCls),
            tip = content.one('.' + config.tipCls),
            defVal = config.defVal || '',
            allowNull = config.allowNull || false,
            nullMes=config.nullMes||'必填项，请输入合法内容',
            checkObj = config.checkObj;
            S.mix(self, {
            	/**
	             * input节点
	             * @field
			 	 * @name TextBoxValid#node
	             */
                node: node,
                /**
	             * 验证框容器
	             * @field
			 	 * @name TextBoxValid#content
	             */
                content: content,
                /**
	             * 默认值
	             * @field
			 	 * @name TextBoxValid#defVal
	             */
                defVal: defVal,
                /**
	             * 是否允许为空
	             * @field
			 	 * @name TextBoxValid#allowNull
	             */
                allowNull: allowNull,
                /**
	             * 输入为空提示信息
	             * @field
			 	 * @name TextBoxValid#allowNull
	             */
                nullMes: nullMes,
                /**
	             * tip节点
	             * @field
			 	 * @name TextBoxValid#tip
	             */
                tip: tip,
                /**
	             * 校验规则
	             * @field
			 	 * @name TextBoxValid#checkObj
	             */
                checkObj: checkObj
            });
	        
            //先将文本框置为默认状态
           self.setDefault();
            self._bind();
        },
        /**
         * 事件绑定
         * @function 
         * @private
         */
        _bind: function () {
            var self = this,
            node = self.node,
            checkObj = self.checkObj;
            node.on('focus', function (e) {
                self.setFocus();
            });
            node.on('blur', function (e) {
                self.validation();
            });
        },
        /**
         * 获取input的值
         * @function
         * @name TextBoxValid#getVal
         */
        getVal: function () {
            var self = this;
            return S.trim(self.node.val());
        },
        /**
         * 验证
         * @function
         * @name TextBoxValid#Validation
         */
        validation: function () {
            var self = this,
            node = self.node,
            checkObj = self.checkObj,
            val = self.getVal(),
            result=true;
            if (val == self.defVal || val == "") {
                if (self.allowNull) {
                    self.resetInput();
                    result=true;
                } else {
                    self.setError(self.nullMes);
                    result=false;
                }
            } else {
            	if(checkObj){
            		var reg=checkObj.reg,
            		res=S.Check(val,reg,self),
	            	rightMes=res.mes||checkObj.rightMes||"&nbsp;",
	            	errorMes=res.mes||checkObj.errorMes||"&nbsp;";
                    if (res.isValid==false) {
                        self.setError(errorMes);
                        result=false;
                    }else if(res.isValid==undefined){
                    	result=false;
                    }else{
                    	result=true;
                    	self.setRight(rightMes);
                    }
             	}else{
             		result=true;
             		self.setRight();
             	}
            } 
             return result;
        },
        /**
         * reset input框
         * @function
         * @name TextBoxValid#Validation
         * @param message 要设置的提示信息
         */
        resetInput: function (message) {
            var self = this;
            self.content.attr("class", self.config.contentCls);
            message&&self.tips(message);
        },
        /**
         * 置文本框状态为获得焦点
         * @function
         * @name TextBoxValid#setFocus
         * @param message 要设置的提示信息
         */
        setFocus: function (message) {
            var self = this,
            message=message||"&nbsp;",
            focusCls = self.config.contentCls + " focus";
            if (self.getVal() == self.defVal) {
                self.node.val("");
            }
            self.content.attr("class", focusCls);
            self.tips(message);
        },
        /**
         * 置文本框状态为错误
         * @function
         * @name TextBoxValid#setError
         * @param message 要设置的提示信息
         */
        setError: function (mes) {
            var self = this,
            message =mes||self.tip.html() ,
            errorCls = self.config.contentCls + " error";
            self.content.attr("class", errorCls);
            self.tips(message);
            if (self.getVal() == self.defVal) {
                self.node.val("");
            }
        },
        /**
         * 置文本框状态为正确
         * @function
         * @name TextBoxValid#setRight
         * @param message 要设置的提示信息
         */
        setRight: function (message) {
            var self = this,
            message = message || "&nbsp;",
            rightCls = self.config.contentCls + " right";           
        	self.content.attr("class", rightCls);
        	self.tips(message);
        },
        /**
         * 置文本框状态为默认状态
         * @function
         * @name TextBoxValid#setDefault
         * @param message 要设置的提示信息
         */
        setDefault: function (message) {
            var self = this,
            defCls = self.config.contentCls + " default",
            message=message||"";
            self.content.attr("class", defCls);
            self.tips(message);
        },
        /**
         * 文本提示
         * @function
         * @name TextBoxValid#tips
         * @param message 要设置的提示信息
         */
        tips:function(message){
        	var self=this,
        	tipContent=self.tip;
        	tipContent.html(message);
        }
    });
    return TextBoxValid;
},
{
    attach: false,
    requires: ['sizzle', 'check']
});

/**
 * @description 表单验证组件
 * @constorctor
 * @name Validation
 */
KISSY.add("validation", function (S, Validation, TextBoxValid) {
    S.Validation = Validation;
    S.TextBoxValid = TextBoxValid;
},{
    requires: ["validation/base", "validation/textbox", "validation.css"]
});