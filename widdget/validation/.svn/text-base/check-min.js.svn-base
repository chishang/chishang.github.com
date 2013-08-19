/**
 * check 正则验证
 * @function
 * @name Check
 * @param value 待验证值
 * @param reg 字符串/正则表达式/验证函数
 * <br/>若传入字符串，字符串必须是已定义的以下几个值：Email（电子邮件） Phone（手机号码）Invoice（发票抬头）
 * <br/>若传入正则表达式
 * <br/>若传入函数，则函数的参数必须为value,返回值必须为以下格式：{isValid:true/flase,tips:"IIIII"}
 * @param obj 上下文
 * @return {Object}
 */
KISSY.add('check', function(S){
	var rMap={
		Email:/^[_a-zA-Z0-9\-]+(\.[_a-zA-Z0-9\-]*)*@[a-zA-Z0-9\-]+([\.][a-zA-Z0-9\-]+)+$/,
		Phone:/^(1)\d{10}$/,
		Invoice: /^\S{2,100}$/
	};
	S.Check=function(value,reg,obj){
		var regexp,isValid,result;
		if(S.isString(reg) && (reg in rMap)){
			regexp=rMap[reg];
			isValid=regexp.test(value)?true:false;
			result={
				isValid:isValid
			};
		}else if(S.isRegExp(reg)){
			regexp=reg;
			isValid=regexp.test(value)?true:false;
			result={
				isValid:isValid
			};
		}else if(S.isFunction(reg)){
			result=reg(value,obj);
		}
		return result;
	}
},{
	attach:false,
	requires:['sizzle']
});