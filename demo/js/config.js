/**
 * @author liuchaowu.pt
 */

var YH_CHARSET = "utf-8",
    YH_JSROOT = "../widdget/";
KISSY.config({
    map: [
        [/(.+widdget\/.+)-min.js(\?[^?]+)?$/, "$1.js$2"],
        [/(.+widdget\/.+)-min.css(\?[^?]+)?$/, "$1.css$2"]
    ],
    packages: [
        //公共方法
        {
            name: "common",
            path: "../js/",
            tag: "20120324",
            charset: "utf-8"
        },
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
        //省市区级联
        {
            name: "areaselect",
            path: YH_JSROOT + "area/",
            tag: "20120731",
            charset: YH_CHARSET
        },
        //值验证
        {
            name: "check",
            path: YH_JSROOT + "validation/",
            tag: "20120324",
            charset: YH_CHARSET
        },
        //分页
        {
            name: "pagenation",
            path: YH_JSROOT + "pagenation/",
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
        //回顶部
        {
            name: "top",
            path: YH_JSROOT + "top/",
            tag: "20120324",
            charset: YH_CHARSET
        },
        //google 地图
        {
            name: "map",
            path: YH_JSROOT + "map/",
            tag: "20120324",
            charset: YH_CHARSET
        },
        //身份证校验
        {
            name: "idcardreg",
            path: YH_JSROOT + "validation/",
            tag: "20120324",
            charset: YH_CHARSET
        }
    ]
});
