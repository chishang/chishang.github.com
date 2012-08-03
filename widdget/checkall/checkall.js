KISSY.add('checkall', function (S) {
/**
 * �����-chckbox ȫѡ
 * ���¼���check ѡ����ѡ/ȡ����ѡ
 * @constructor
 * @name Checkall
 * @param {object} cfg 
 * <prev>
 * <br/>node {node} ȫѡ��
 * <br/>nodeList {node} ȫѡ�������ǵ�checkbox
 * <br/>inverse {node} ��ѡ��
 * </prev>
 */
   function Checkall() {
        this._init.apply(this, arguments);
    };
    S.augment(Checkall,S.EventTarget, {
        /**
		 * ��ʼ�����
		 * @function
		 * @private
		 */
        _init: function (config) {
            if (!config) {
                return false;
            } else if (!config.node) {
                return false;
            }
            var that = this;
        /**
		 * ȫѡ��
		 * @field
		 * @name Checkall#node
		 * @type {Array}
		 */
            that.node = [];
        /**
		 * ��ѡѡ��
		 * @field
		 * @name Checkall#inverse
		 * @type {Array}
		 */
            that.inverse = [];
            if (config.node instanceof Array) {
                that.node = config.node;
            } else {
                that.node.push(config.node);
            }

        /**
		 * checkbox�б�
		 * @field
		 * @name Checkall#nodelist
		 * @type {Node}
		 */
            that.nodelist = [];
            config.nodelist.each(function (node) {
                that.nodelist.push(node);
            });
            if (config.inverse) {
                if (config.inverse instanceof Array) {
                    /**
					 * ��ѡ���б�
					 * @field
					 * @name Checkall#inverse
					 * @type {ARRAY}
					 */
                    that.inverse = config.inverse;
                } else {
                    that.inverse.push(config.inverse);
                }
            }
            that._bind();
            //��ĳЩ������У�checkbox�ᱣ��ˢ��ҳ��ǰ��checked���ԣ�����ͳһ�ڳ�ʼ��ʱ������checkbox����Ϊδѡ��
            that.checkall(false);
            that.disable(false, "all");
            return this;
        },
        /**
		 * ��ȡ��ѡ|δѡԪ��
		 * @function
		 * @name Checkall#get
		 * @param {string} type  ��ȡԪ������
		 * <prev>
		 * <br/>checked  ��ѡԪ��
		 * <br/>unchecked  δѡԪ��
		 * </prev>
		 * @return {Array} 
		 */
        get: function (type) {
            var that = this,
            checked_node = [],
            unchecked_node = [];
            for (var i = 0; i < that.nodelist.length; i++) {
                var node = that.nodelist[i];
                if (node) {
                    node.attr("checked") ? checked_node.push(node) : unchecked_node.push(node);
                }

            }
            var result = (type == 'checked') ? checked_node : unchecked_node;
            return result;
        },
        /**
		 * ����checkbox��checked����,��Ҫ��Ϊ�˷����¼�����
		 * @function
		 * @name Checkall#check
		 * @param {node} node ��Ӧcheckbox�ڵ�
		 * @param {bool} flag inputbox�ڵ�checkedֵ
		 */
        check: function (node, flag) {
            var that = this;
            if (node) {
                node.attr('checked', flag);
            }
            /**
             * checkbox��ѡ/ȡ����ѡ�¼���
             * @event
             * @name Checkall#check
             */
            that.fire("check", {
                node: node,
                flag: flag
            });
        },
        /**
		 * ��ѡ
		 * @function
		 * @name Checkall#invert
		 */
        invert: function () {
            var that = this;
            for (var i = 0; i < that.nodelist.length; i++) {
                var node = that.nodelist[i];
                if (node) {
                    var flag = node.attr('checked') ? true : false;
                    flag ? that.check(node, false) : that.check(node, true);
                }
            };
        },
        /**
		 * node�ڵ��¼���
		 * @function
		 * @private
		 */
        _bind: function () {
            var that = this;
            //���ȫѡ�ڵ㣬ͬ��checklist
            //����ȫѡ�ڵ�����ж�������Ի�Ҫִ��_synCheckall
            for (var i = 0; i < that.node.length; i++) {
                that.node[i].on('click', function (e) {
                    var node = S.one(e.currentTarget),
                    flag = node.attr('checked') ? true : false;
                    that.checkall(flag);
                });
            }
            //�����ѡ�ڵ㣬��ѡcheckbox��ͬ��ȫѡ��
            for (var i = 0; i < that.inverse.length; i++) {
                that.inverse[i].on('click', function (e) {
                    that.invert();
                    that._synCheckall();
                });
            }
            //���checkbox,ͬ��ȫѡ�ڵ�
            for (var i = 0; i < that.nodelist.length; i++) {
                (function () {
                    var node = that.nodelist[i];
                    node.on('click', function (e) {
                        flag = node.attr('checked') ? true : false;
                        that._synCheckall();
                        that.check(node, flag);
                    });
                } ());
            }
        },
        /**
		 * ͬ��ȫѡ��
		 * @function
		 * @private
		 */
        _synCheckall: function (flag) {
            var that = this;
            if (flag != null) {
                var flag = flag;
            } else {
                var flag = true;
                for (var i = 0; i < that.nodelist.length; i++) {
                    var node = that.nodelist[i];
                    if (node) {
                        if (!node.attr('checked')) {
                            flag = false;
                            break;
                        } else {
                            flag = true;
                        }
                    }
                }
            }
            for (var i = 0; i < that.node.length; i++) {
                that.node[i].attr('checked', flag);
            }
        },
        /**
		 *ͬ��checkbox�б�
		 *@function
		 *@param {el} event�Դ�e����
		 * @private
		 */
        _synChecklist: function (flag) {
            var that = this;
            for (var i = 0; i < that.nodelist.length; i++) {
                var node = that.nodelist[i];
                if (node && ( !! node.attr("checked")) != flag) {
                    that.check(node, flag);
                }
            }
        },
        /**
		 * ȫѡ
		 * @function 
		 * @name Checkall#checkall
		 * @param {bool} flag �Ƿ�ȫѡ(true/false)
		 */
        checkall: function (flag) {
            var that = this;
            that._synChecklist(flag);
            that._synCheckall(flag);
        },
        /**
		 * ����ȫѡ��ť
		 * @function 
		 * @name Checkall#disable
		 * @param {bool} flag   �Ƿ����
		 * @param {string} all �Ƿ�ȫ������
		 */
        disable: function (flag, all) {
            var that = this;
            for (var i = 0; i < that.node.length; i++) {
                that.node[i].attr('disabled', flag);
            }
            if (all != undefined) {
                for (var i = 0; i < that.nodelist.length; i++) {
                    that.nodelist[i].attr('disabled', flag);
                }
            }
        }
    });
    S.Checkall=Checkall;
    return Checkall;
},{
    attach: false,
    requires: ["sizzle"]
});