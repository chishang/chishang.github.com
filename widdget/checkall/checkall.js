KISSY.add('checkall', function (S) {
/**
 * 表单组件-chckbox 全选
 * 绑定事件：check 选择框框勾选/取消勾选
 * @constructor
 * @name Checkall
 * @param {object} cfg 
 * <prev>
 * <br/>node {node} 全选框
 * <br/>nodeList {node} 全选框所覆盖的checkbox
 * <br/>inverse {node} 反选框
 * </prev>
 */
   function Checkall() {
        this._init.apply(this, arguments);
    };
    S.augment(Checkall,S.EventTarget, {
        /**
		 * 初始化组件
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
		 * 全选框
		 * @field
		 * @name Checkall#node
		 * @type {Array}
		 */
            that.node = [];
        /**
		 * 反选选框
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
		 * checkbox列表
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
					 * 反选框列表
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
            //在某些浏览器中，checkbox会保留刷新页面前的checked属性，所以统一在初始化时将所有checkbox设置为未选中
            that.checkall(false);
            that.disable(false, "all");
            return this;
        },
        /**
		 * 获取已选|未选元素
		 * @function
		 * @name Checkall#get
		 * @param {string} type  获取元素类型
		 * <prev>
		 * <br/>checked  已选元素
		 * <br/>unchecked  未选元素
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
		 * 设置checkbox的checked属性,主要是为了方便事件监听
		 * @function
		 * @name Checkall#check
		 * @param {node} node 对应checkbox节点
		 * @param {bool} flag inputbox节点checked值
		 */
        check: function (node, flag) {
            var that = this;
            if (node) {
                node.attr('checked', flag);
            }
            /**
             * checkbox勾选/取消勾选事件绑定
             * @event
             * @name Checkall#check
             */
            that.fire("check", {
                node: node,
                flag: flag
            });
        },
        /**
		 * 反选
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
		 * node节点事件绑定
		 * @function
		 * @private
		 */
        _bind: function () {
            var that = this;
            //点击全选节点，同步checklist
            //由于全选节点可能有多个，所以还要执行_synCheckall
            for (var i = 0; i < that.node.length; i++) {
                that.node[i].on('click', function (e) {
                    var node = S.one(e.currentTarget),
                    flag = node.attr('checked') ? true : false;
                    that.checkall(flag);
                });
            }
            //点击反选节点，反选checkbox并同步全选框
            for (var i = 0; i < that.inverse.length; i++) {
                that.inverse[i].on('click', function (e) {
                    that.invert();
                    that._synCheckall();
                });
            }
            //点击checkbox,同步全选节点
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
		 * 同步全选框
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
		 *同步checkbox列表
		 *@function
		 *@param {el} event自带e属性
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
		 * 全选
		 * @function 
		 * @name Checkall#checkall
		 * @param {bool} flag 是否全选(true/false)
		 */
        checkall: function (flag) {
            var that = this;
            that._synChecklist(flag);
            that._synCheckall(flag);
        },
        /**
		 * 禁用全选按钮
		 * @function 
		 * @name Checkall#disable
		 * @param {bool} flag   是否禁用
		 * @param {string} all 是否全部禁用
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