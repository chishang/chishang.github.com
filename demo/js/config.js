/**
 * @author liuchaowu.pt
 */

var YH_CHARSET = "gbk",
YH_JSROOT = "../widdget/";
KISSY.config({
    map: [[/(.+widdget\/.+)-min.js(\?[^?]+)?$/, "$1.js$2"], [/(.+widdget\/.+)-min.css(\?[^?]+)?$/, "$1.css$2"]],
    packages: [
    /***===============================
	 * �������
	 =====================================*/

    //����
    {
        name: "win",
        path: YH_JSROOT + "win/",
        tag: "20120324",
        charset: YH_CHARSET
    },
    //ȫѡ
    {
        name: "checkall",
        path: YH_JSROOT + "checkall/",
        tag: "20120324",
        charset: YH_CHARSET
    },
    //ֵ��֤
    {
        name: "check",
        path: YH_JSROOT + "validation/",
        tag: "20120324",
        charset: YH_CHARSET
    },
    //����֤
    {
        name: "validation",
        path: YH_JSROOT + "validation/",
        tag: "20120324",
        charset: YH_CHARSET
    },
    //���֤У��
    {
        name: "idcardreg",
        path: YH_JSROOT + "validation/",
        tag: "20120324",
        charset: YH_CHARSET
    }]
});
