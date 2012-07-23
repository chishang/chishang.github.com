KISSY.add('validation/base', function (S) {
	/**
	 * ����֤���
	 * @constructor
	 * @name Validation
	 * @param {id} ID form��id ����ֵ
	 * @param {object} textbox:
	 * <br/>-tipCls����ʾ��class,Ĭ��ֵΪ "input-tip"
	 * <br/>-contentCls:textbox��������,Ĭ��ֵΪ "input-box"
	 * <br/>-textbox {object} ����֤���ı���:
	 * 	<br/>--contentCls input ������box��class
	 * 	<br/>--tipCls ��Ϣ��ʾԪ�ص�class
	 * 	<br/>--list
	 * 	<br/>-checkBox ���빴ѡ��checkbox ��ʽΪ[node,node,������]
	 * @description ���Ҫ���Դ�����ʽ������form������Դ�ѡ��Ȩks-tdform
	 */
    function Validation() {
        this._init.apply(this, arguments);
    }
    S.augment(Validation,S.EventTarget,{
        
        _init: function (id, config) {
            var self = this;
            self.form=S.one(id);
            /**
             * ��Ҫ��֤�ĸ���
             * @field @name Validation#num
             */
            self.num=0;
            /**
             * ͨ����֤�ĸ���
             * @field @name Validation#passNum
             */
            self.passNum=0;
            self.config={
            	tipCls:"input-tip",
            	contentCls:"input-content",
            	submit:null
            };
            S.mix(self.config, config);
           	self._buildTextBoxList();
           	self._bind();
           },
        /**
		 * ���ύ�¼���
		 * @function 
		 * @name Validation#bind
		 * @private
		 */
		_bind:function(){
			var self=this,
			form=self.form,
			config=self.config,
			submit=config.submit;
			form.on("submit",function(e){
				var passed=self.valid();
				if(!passed){
					e.halt();
				}else if(S.isFunction(submit)){
					submit.apply(self,[e]);
				}
				
			});
		},
        /**
		 * ����textboxList����
		 * @function 
		 * @name Validation#buildTextBoxList
		 * @private
		 */
        _buildTextBoxList: function () {
            var self = this;
	        /**
			 * ����֤���ı�������
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
		 * ����Ƿ�ͨ����֤
		 * @function 
		 * @name Validation#valid
		 */
        valid: function () {
            var self = this,
            List = self.textBoxList;
            //�Ƚ���ͨ��������
            self.passNum=0;
            for (var i in List) {
            	var item=List[i];
            	//�������ȷ�����������֤���Ǵ������������֤
            	if(!item.state)
            		item.validation();
                }
            return self.isPassed();
        },
        /**
		 * ����Ƿ�ͨ����֤
		 * @function 
		 * @name Validation#isPassd
		 */
		isPassed:function(){
			var self=this;
            List = self.textBoxList;
            //�Ƚ���ͨ��������
            self.passNum=0;
            for (var i in List) {
            	var item=List[i];
                    if (item.state) {
                        self.passNum++;   
                    } 
                }
			return (self.passNum===self.num);
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
     * �ı�����֤���
     * @constructor
     * @name TextBoxValid
     * @param {Object} config
     * <prev>
     * <br/>defVal  inputĬ��ֵ     
     * <br/>contentCls ������֤��������    
     * <br/>tipCls ��ʾ��class  ��ѡ
     * <br/>checkObj input��Ҫ��֤�Ĺ��� (��ѡ):
     * -reg:��֤����/�����ʽ/�ַ���
     * -rightMes:��ȷ��ʾ
     * -errorMes:������ʾ�İ�
     * <br/>allowNull �Ƿ������ֵ  Ĭ��Ϊfalse
     * </prev>
     */
    function TextBoxValid() {
        this._init.apply(this, arguments);
    }
    S.augment(TextBoxValid, {
        /**
         * ��ʼ��
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
             * ��������
             * @field
		 	 * @name TextBoxValid#config
             */
            self.config = config;
            var node =S.one(config.node),
            content = node.parent('.' + config.contentCls),
            tip = content.one('.' + config.tipCls),
            defVal = config.defVal || '',
            ajax=config.ajax||false,
            allowNull = config.allowNull || false,
            state=allowNull?true:false,
            nullMes=config.nullMes||'��������������Ҫ�������',
            checkObj = config.checkObj;
            S.mix(self, {
            	/**
	             * input�ڵ�
	             * @field
			 	 * @name TextBoxValid#node
	             */
                node: node,
                /**
	             * z״̬
	             * @field
			 	 * @name TextBoxValid#state
	             */
               state:state,
                /**
	             * ��֤������
	             * @field
			 	 * @name TextBoxValid#content
	             */
                content: content,
                /**
	             * Ĭ��ֵ
	             * @field
			 	 * @name TextBoxValid#defVal
	             */
                defVal: defVal,
                /**
	             * �Ƿ�����Ϊ��
	             * @field
			 	 * @name TextBoxValid#allowNull
	             */
                allowNull: allowNull,
                /**
	             * ����Ϊ����ʾ��Ϣ
	             * @field
			 	 * @name TextBoxValid#allowNull
	             */
                nullMes: nullMes,
                /**
	             * tip�ڵ�
	             * @field
			 	 * @name TextBoxValid#tip
	             */
                tip: tip,
                ajax:ajax,
                /**
	             * У�����
	             * @field
			 	 * @name TextBoxValid#checkObj
	             */
                checkObj: checkObj
            });
	        
            //�Ƚ��ı�����ΪĬ��״̬
            self.setDefault();
            self._bind();
        },
        /**
         * �¼���
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
         * ��ȡinput��ֵ
         * @function
         * @name TextBoxValid#getVal
         */
        getVal: function () {
            var self = this;
            return S.trim(self.node.val());
        },
        /**
         * �Զ���֤
         * @function
         * @name TextBoxValid#Validation
         */
        validation: function () {
            var self = this,
            node = self.node,
            ajax=self.ajax,
            checkObj = self.checkObj,
            val = self.getVal();
            if (val == self.defVal || val == "") {
                if (self.allowNull) {
                	self.state=true;
                    self.resetInput();
                } else {
                	self.state=false;
                    self.setError(self.nullMes);
                    
                    
                }
            } else {
            	if(checkObj){
            		var reg=checkObj.reg,
            		res=S.Check(val,reg,self),
	            	rightMes=res.mes||checkObj.rightMes||"&nbsp;",
	            	errorMes=res.mes||checkObj.errorMes||"&nbsp;";
                    if (res.isValid==false) {
                        self.state=false;
                        self.setError(errorMes);
     
                    }else if(typeof res.isValid=="undefined"){
                    	 self.state=false;
                    }else{
                    	self.state=true;
                    	self.setRight(rightMes);
		                if(ajax){
		             		ajax.apply(self);
		             	}
                    }
             	}else{	
             		self.state=true;
             		self.setRight();
             		if(ajax){
		             	ajax.apply(self);
		             }
             	}
             	
            } 
             return self.isPassed();
        },
        isPassed:function(){
        	return this.state;
        },
        /**
         * reset input��
         * @function
         * @name TextBoxValid#Validation
         * @param message Ҫ���õ���ʾ��Ϣ
         */
        resetInput: function (message) {
            var self = this;
            self.content.attr("class", self.config.contentCls);
            message&&self.tips(message);
        },
        /**
         * ���ı���״̬Ϊ��ý���
         * @function
         * @name TextBoxValid#setFocus
         * @param message Ҫ���õ���ʾ��Ϣ
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
         * ���ı���״̬Ϊ����
         * @function
         * @name TextBoxValid#setError
         * @param message Ҫ���õ���ʾ��Ϣ
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
         * ���ı���״̬Ϊ��ȷ
         * @function
         * @name TextBoxValid#setRight
         * @param message Ҫ���õ���ʾ��Ϣ
         */
        setRight: function (message) {
            var self = this,
            message = message || "&nbsp;",
            rightCls = self.config.contentCls + " right";           
        	self.content.attr("class", rightCls);
        	self.tips(message);
        },
        /**
         * ���ı���״̬ΪĬ��״̬
         * @function
         * @name TextBoxValid#setDefault
         * @param message Ҫ���õ���ʾ��Ϣ
         */
        setDefault: function (message) {
            var self = this,
            defCls = self.config.contentCls + " default",
            message=message||"";
            self.content.attr("class", defCls);
            self.tips(message);
        },
        /**
         * �ı���ʾ
         * @function
         * @name TextBoxValid#tips
         * @param message Ҫ���õ���ʾ��Ϣ
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
 * @description ����֤���
 * @constorctor
 * @name Validation
 */
KISSY.add("validation", function (S, Validation, TextBoxValid) {
    S.Validation = Validation;
    S.TextBoxValid = TextBoxValid;
},
{
    requires: ["validation/base", "validation/textbox", "validation.css"]
});