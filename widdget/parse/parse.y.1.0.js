/**
 * @author CS
 */
YUI.namespace("Parse");
YUI.add("yh-parse",function(Y){
	var P=Y.Parse||(Y.Parse={});
	/**
	 * 获取utf-8编码
	 */
	P.utf8=function(str){
		return escape(str);
	}
	/**
	 * 获取encodeUri
	 */
	P.uri=function(str,component){
		return component?encodeURIComponent(str):encodeURI(str);
	}
	
	/**
	 * 获取gbk编码
	 */
	P.gbk=function(str){
		var str=str||"";
		var getQuery=function(data){
			Y.fire("gbk:geted",{
				data:data
			});
		}
		var body=Y.one('body');
		var createIframe = function(){
			var d_iframe=Y.DOM.create('<iframe width="0px" height="0px" frameborder="0" id="J_ParseGbkFrame" name="J_ParseGbkFrame" src="about:blank"></iframe>');
			body.append(d_iframe);
			return Y.one(d_iframe);
		};
		var createForm=function(){
			var d_form = Y.DOM.create([
			'<form method="GET" target="J_ParseGbkFrame"  id="J_ParseGbkForm" style="display:none;">',
			'<input name="gbk" id="J_ParseGbkInput" value="'+str+'" />',
			'</form>'
			].join(''));
			body.append(d_form);
			return Y.one(d_form);
		}
		var iframe=Y.one("#J_ParseGbkFrame");
		var form=Y.one("#J_ParseGbkForm");
		var input=Y.one("#J_ParseGbkInput");
		iframe?input.set("value",str):(function(){
			iframe =createIframe();
			iframe.on('load',function(){
				Y.log(window[iframe.getAttribute('name')].location);
				getQuery(window[iframe.getAttribute('name')].location.toString().split('gbk=')[1]);
			});
			form=createForm();
		})();
		form.submit();
	}
	return P;
});
