var YH;
(function(){
	var  YH_DEBUG, YH_COMBINE,YH_JSROOT = "../widdget/";
    var getroot = function() {
        var location = window.location,
        host = location.host,
        href = location.href,
        protocol = location.protocol;
        YH_DEBUG = !!href.match('_fe_debug_');
        YH_COMBINE = !YH_DEBUG;
    };
    getroot();
	var  _YUI3_CONFIG_ = {
	        combine: true,
	        debug: true,
	        comboBase:'http://a.tbcdn.cn/??',
	        root:'s/yui/3.5.1/build/',
	        filter:{
	            'searchExp': '&',
	            'replaceStr':','
	        },
	        charset:'utf-8',
	        groups:{
        		widgets:{
	        		combine:false,
	                base: "js/",
	                modules: {
	                	'p-parse':{
	                		path:'parse.js'
	                	}
	                 }
	        	},
	        	pages:{
	        		combine:false,
	                base: YH_JSROOT,
	                modules: {
	                	'yh-parse':{
	                		path:'parse/parse.y.1.0.js'
	                	},
	                	'print' :{
	                		path:'print/print.js'
	                	}
	                 }
	        	}
	           }
	    };
	YH = YUI(_YUI3_CONFIG_);
	YH.addTripModule = function (mod) {
	    this.applyConfig(mod);
	};
})();
