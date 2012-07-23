/**
 * @author liuchaowu.pt
 */

var YH_CHARSET = "gbk",
YH_JSROOT = "../widdget/";
KISSY.config({
    map: [[/(.+widdget\/.+)-min.js(\?[^?]+)?$/, "$1.js$2"], [/(.+widdget\/.+)-min.css(\?[^?]+)?$/, "$1.css$2"]],
    packages: [
    /***===============================
	 * 公用组件
	 =====================================*/

    //弹窗
    {
        name: "win",
        path: YH_JSROOT + "win/",
        tag: "20120324",
        charset: YH_CHARSET
    },
    //全选
    {
        name: "checkall",
        path: YH_JSROOT + "checkall/",
        tag: "20120324",
        charset: YH_CHARSET
    },
    //值验证
    {
        name: "check",
        path: YH_JSROOT + "validation/",
        tag: "20120324",
        charset: YH_CHARSET
    },
    //表单验证
    {
        name: "validation",
        path: YH_JSROOT + "validation/",
        tag: "20120324",
        charset: YH_CHARSET
    },
    //身份证校验
    {
        name: "idcardreg",
        path: YH_JSROOT + "validation/",
        tag: "20120324",
        charset: YH_CHARSET
    }]
});
