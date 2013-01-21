/**
 * @author chishang.lcw
 */
YUI.namespace("Print");
YUI.add("print",function(Y){
	function Print(){
		this.init();
	}
	Print.prototype = {
		init : function(usrCfg){
			var self = this;
			var defCfg = {
				printSel : ".J_PrintBtn",
				priviewSel : ".J_PrintPrivew",
				priviewCon : Y.one(".J_PriviewCon")
			}
			var config = Y.merge(defCfg, usrCfg);
            self.config = config;
            self.bindEvent();
		},
		bindEvent : function(){
			var self = this;
			var config = self.config;
			//打印事件绑定
			var printSel = config.printSel,
			printBtn = Y.all(printSel);
			printBtn && printBtn.on("click", function(e){
				e.halt();
				self.print();
			});
		},
		/**
		 * 设置网页打印的页眉页脚为空
		 */
		pageSetupNull : function(){
			var hkey_root,hkey_path,hkey_key;   
			hkey_root="HKEY_CURRENT_USER";   
			hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
			//ie
			try{
				var RegWsh = new ActiveXObject("WScript.Shell");
				hkey_key = "header" ;
				RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "");
				hkey_key = "footer";
				RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "");
			} catch(e){
				Y.log("去掉页眉信息失败,失败原因请查看：");
				Y.log(e);
			}
		},
		/*
		 * 设置网页打印的页眉页脚为默认值
		 */
		pageSetupDefault : function (){
			var hkey_root,hkey_path,hkey_key;   
			hkey_root="HKEY_CURRENT_USER";   
			hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
			//ie
			try{
				var RegWsh = new ActiveXObject("WScript.Shell");
				hkey_key = "header";
				RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "&w&b页码,&p/&P");
				hkey_key = "footer";
				RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "&u&b&d");
			} catch(e){
				Y.log("设置页眉信息失败,失败原因请查看：");
				Y.log(e);
			}
		},
		/**
		 * 打印
		 */
		print : function(){
			try{
				window.print();
			}catch(e){
				Y.log("打印失败,失败原因请查看：");
				Y.log(e);
			}
		},
		/**
		 * 预览
		 */
		priview : function(priviewCon){
			var self = this,
			config = self.config,
			priviewCon = priviewCon || config.priviewCon ;
			
		}
	}
	Y.Print = Print;
},
"1.0", {
    requires: ['node']
});