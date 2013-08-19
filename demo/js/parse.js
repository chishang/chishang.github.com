/**
 * @author CS
 */
YUI.add('p-parse', function (Y) {
        var P = Y.Parse;

        function Pparse() {
            Pparse.superclass.constructor.apply(this, arguments);
        };
        Y.extend(Pparse, Y.Base, {
            initializer: function () {
                var that = this;
                that.set("doms", that.bindUI());
                that.bindEvent();
            },
            bindUI: function () {
                var that = this;
                var src = Y.one(".J_Src"),
                    btn = Y.one(".J_Parse"),
                    conUtf8 = Y.one("#J_UTF8"),
                    conGbk = Y.one("#J_GBK"),
                    conUri = Y.one("#J_URI"),
                    conUric = Y.one("#J_URIC");
                return {
                    src: src,
                    btn: btn,
                    conUtf8: conUtf8,
                    conGbk: conGbk,
                    conUri: conUri,
                    conUric: conUric
                }

            },
            bindEvent: function () {
                var that = this;
                var doms = that.get('doms');

                //点击解析按钮
                var btn = doms.btn;
                var src = doms.src;
                btn && btn.on('click', function (e) {
                    var str = src.get("value");
                    var data = that.parse(str);
                    Y.fire('src:changed', {
                        data: data
                    });
                });
                //监听change事件
                Y.on('src:changed', function (e) {
                    var data = e.data;
                    that.show(data);
                });
                Y.on("gbk:geted", function (e) {
                    var data = e.data;
                    doms.conGbk.setContent(data);
                });
            },
            parse: function (str) {
                var that = this;
                var data = str || "";
                var utf8 = P.utf8(data);
                var uri = P.uri(data);
                var uric = P.uri(data, true);
                var gbk = P.gbk(data);
                return {
                    utf8: utf8,
                    gbk: "waiting......",
                    uri: uri,
                    uric: uric
                }
            },
            show: function (data) {
                var that = this;
                var doms = that.get('doms');
                //gbk
                var conGbk = doms.conGbk,
                    gbk = data.gbk;
                gbk && conGbk && conGbk.setContent(gbk);

                //utf8
                var conUtf8 = doms.conUtf8,
                    utf8 = data.utf8;
                utf8 && conUtf8 && conUtf8.setContent(utf8);

                //encodeURI
                var conUri = doms.conUri,
                    uri = data.uri;
                uri && conUri && conUri.setContent(uri);

                //encodeURIComponent
                var conUric = doms.conUric,
                    uric = data.uric;
                uric && conUric && conUric.setContent(uric);

            }
        });
        Y.Pparse = Pparse;
    },
    '1.0.0', {
        requires: ['base', 'anim', 'yh-parse']
    });