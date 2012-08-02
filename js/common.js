/**
* @author dongzhu
*/
KISSY.add('common', function(S) {
    S.Common = {
        /**
         * 图片/文字切换显示
         * @param target {node} 目标节点
         */
        hoverChange: function(target) {
            if (!target || !target.length) {
                return;
            }
            var nTarget = target,
            nFirst = S.one(nTarget[0]),
            activedItem = function(item) {
                var nTar = item,
                nTarImg = nTar.one(".picwrap"),
                nTarText = nTar.one(".textwrap"),
                nActived = nTar.siblings(".active");
                if (nActived.length) {
                    //如果已有显示图片的项，隐藏其图片，显示文字
                    var nActImg = nActived.one(".picwrap"),
                    nActText = nActived.one(".textwrap");
                    nActImg.addClass("dn");
                    nActText.removeClass("dn");
                    nActived.removeClass("active");
                }
                //显示目标节点图片，隐藏文字
                nTar.addClass("active");
                nTarImg.removeClass("dn");
                nTarText.addClass("dn");

            };
            nFirst.addClass("first");
            activedItem(nFirst);
            nTarget.on("mouseenter", function(e) {
                var nEventTarget = S.one(e.currentTarget);
                if (!nEventTarget.hasClass("active")) {
                    activedItem(nEventTarget);
                }
            });

        },
        /**
        * 类手风琴效果实现:容器内的元素，只有一个处在触发状态
        * @function
        * @name  Common#accordion
        * @param cfg
        * -contain :容器选择器
        * -item： 容器内元素选择器
        * -activedClass ：触发容器class
        * -type ：触发方式  默认为mouseover
        * -callback 回调函数
        */
        accordion: function(cfg) {
            var config = {
                contain: ".J_Accordion",
                item: ".accordionItem",
                activedClass: "on",
                type: "mouseenter",
                callback: function(item) { }
            }
            S.mix(config, cfg);
            var nContain = S.one(config.contain);
            if (!nContain) {
                return false;
            }
            var nItemList = nContain.all(config.item);
            nItemList.on(config.type, function(e) {
                var nTarget = S.one(e.currentTarget);
                nItemList.removeClass(config.activedClass);
                nTarget.addClass(config.activedClass);
                config.callback(nTarget);
            });

        },
        /**
        * 搜索
        * @param url 搜索结果页跳转地址
        */
        search: function(url) {
            var inputNode = S.one(".search_input"),
            selectNode = S.one(".search_select"),
            selectUl = S.one(".search_select ul"),
            selectLi = S.all(".search_select ul li"),
            btnNode = S.one(".search_btn"),
            defaultNode = S.one(".search_select .default"),
            clickNode = S.one(".search_click"),
            url = url,
            type = 0,
            defaultValue = "请输入",
            hide = function() {
                selectUl.addClass("dn");
                selectLi.removeClass("hovered");
                clickNode.removeClass("search_click_mouseentered");
            },
            show = function() {
                selectUl.removeClass("dn");
                clickNode.addClass("search_click_mouseentered");
            };
            //事件绑定
            inputNode.on("focusout", function(e) {
                var value = inputNode.val();
                if (value == "") {
                    inputNode.val(defaultValue).addClass("reset");
                }
            });
            inputNode.on("focusin", function(e) {
                var value = inputNode.val();
                if (value == defaultValue) {
                    inputNode.val("").removeClass("reset");
                }
            });
            btnNode.on("click", function(e) {
                e.halt();
                var content = inputNode.val(),
                //+ "type=" + type
                uri = url + "keywords=" + escape(content);
                window.open(uri);
            });
            defaultNode.on("mouseenter", show);
            selectLi.on("mouseenter", function(e) {
                var targetNode = S.one(e.currentTarget);
                targetNode.addClass("hovered");
                targetNode.siblings("li").removeClass("hovered");
            });
            selectLi.on("click", function(e) {
                var targetNode = S.one(e.currentTarget);
                type = targetNode.val();
                defaultNode.html(targetNode.html());
                hide();
            });
            selectNode.on("mouseleave", hide)

        },
        /**
        * 二级导航
        * @param navUrl 二级导航ajax请求地址
        * @param {bool} isHidden 是否隐藏导航内容
        */
        subNav: function(navUrl, isHidden) {
            var classifyNode = S.one("#J_Classify"),
            titleNode = classifyNode.one(".title"),
            ulNode = classifyNode.one(".listul"),
            itemNode = classifyNode.all(".listul li"),
            tabNode = classifyNode.all(".tab-container"),
            dataurl = navUrl,
            getContent = function(target, senddata) {
                var isload = target.attr("isload");
                if (!isload) {
                    S.io({
                        type: "GET",
                        url: dataurl,
                        dataType: "html",
                        data: senddata,
                        success: function(data) {
                            target.attr("isload", true);
                            target.html(data);
                        }
                    });
                }

            },
            classifyhidden = function() {
                titleNode.on("mouseenter", function(e) {
                    ulNode.removeClass("dn");
                });
                classifyNode.on("mouseleave", function(e) {
                    ulNode.addClass("dn");
                });
            };
            itemNode.on("mouseenter", function(e) {
                var targetNode = S.one(e.currentTarget),
                dataid = targetNode.attr("dataid"),
                contentSelect = ".content" + dataid,
                senddata = {
                    id: dataid
                },
                contentNode = classifyNode.one(contentSelect);
                tabNode.addClass("dn");
                getContent(contentNode, senddata);
                contentNode.removeClass("dn");
                var n_top = (dataid - 1) * 30 + 29;
                contentNode.css("top", n_top + "px");
            });

            tabNode.on("mouseleave", function(e) {
                var targetNode = S.one(e.currentTarget);
                targetNode.addClass("dn");
            });
            classifyNode.on("mouseleave", function(e) {
                tabNode.addClass("dn");
            });
            if (isHidden) {
                classifyhidden()
            }

        },
        /*
        * url 地址操作
        */
        href: function(url) {
            var self = this;

            //初始化url处理
            self.init = function() {
                var url = location.href,
				protocol = location.protocol,
				host = location.host,
				pathname = location.pathname,
				port = location.port,
				search = location.search,
				hash = location.hash;
                //处理search
                search = search.replace(/^\?/, '');
                this.search = S.unparam(search);
                this.host = host;
                this.protocol = protocol;
                this.pathname = pathname;
                this.port = port;
                this.hash = hash;

            }
            //跳转页面
            self.open = function() {
                var search = S.param(this.search),
				host = this.host,
				protocol = this.protocol,
				pathname = this.pathname,
				port = this.port,
				hash = this.hash,
				url = protocol + "//" + host + pathname + "?" + search + hash;
                //alert(url);
                location.href = url;
            }
            //获取请求值
            self.get = function(str) {
                return this.search[str];
            }
            //设置、修改请求值
            self.set = function(name, value) {
                this.search[name] = value;
                return this;
            }
            self.hashHandle = function(value) {
                if (S.isUndefined(value)) {
                    return this.hash;

                } else {
                    this.hash = value;
                    return this;
                }
            }
            self.init();
        }

    }
},
{
    attach: false,
    requires: ['sizzle']
});
