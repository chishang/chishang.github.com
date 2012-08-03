KISSY.add("top",function(S){
	var template='<div id="J_GoToTop" ><a title="回顶部" href="#">TOP</a></div>',
	nBody=S.one("body");
	nBody.append(template);
	var getScrollTop=function(){
		return document.documentElement.scrollTop||document.body.scrollTop;
	},
	 nTop=S.one("#J_GoToTop");
	if(getScrollTop()!=0){
		nTop.fadeIn();
	}
	S.Event.on(window, "scroll",function(e){
		var scrollTop=getScrollTop();
		scrollTop===0?nTop.hide():nTop.show();
	});
},{
	requires:['sizzle','top.css']
});
