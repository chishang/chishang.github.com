/**
 * @author chishang.lcw
 */
KISSY.ready(function(S){
	var box=S.all("div");
	 S.all(".J_Overflow").on("click",function(e){
	 	
	 	box.css({
	 		"overflow":"hidden"
	 	});
	 });
	 
});
