/**
 * @author chishang.lcw
 */
YUI.namespace('IO');
YUI.add('xw-io', function (Y) {
	//JSONP
    Y.XW.IO.JSONP =function(url,data,callback,context){
    		var param,
            url=url+"?callback={callback}&"+data;
        	var request =new  Y.JSONPRequest(url,{
				on:{
        			start:function(){
        			},
        			success:function(o){
			            callback.call(context,o);
        			},
        			failure :function(o){
        				var json={
			                	"error":-1,
			                	"message":"获取数据失败"
			                };
        				callback.call(context,json);
        			}
        		},
				timeout : 5000
			});
			Y.later(300,null,function(){request.send();});
    };
    //POST
	Y.XW.IO.POST=function(url,form,callback,context){
		Y.io(url,{
			method:"POST",
			form:form,
			on:{
				success:function(x,o){
        				var data;
			            try {
			               data= Y.JSON.parse(o.responseText);
			            }
			            catch (e) {
			                data={
			                	"error":-1,
			                	"message":"获取数据失败"
			                };
			            }
			            callback.call(context,data);
        			},
        			failure :function(x,o){
        				var data={
			                	"error":-1,
			                	"message":"获取数据失败"
			                };
        				 callback.call(context,data);
        			}
			}
		});
	}
	
},'1.0.0', {
    requires: ['io','json']
});