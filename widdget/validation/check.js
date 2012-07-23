/**
 * check ������֤
 * @function
 * @name Check
 * @param value ����ֵ֤
 * @param reg �ַ���/������ʽ/��֤����
 * <br/>�������ַ������ַ����������Ѷ�������¼���ֵ��Email�������ʼ��� Phone���ֻ����룩Invoice����Ʊ̧ͷ��
 * <br/>������������ʽ
 * <br/>�����뺯���������Ĳ�������Ϊvalue,����ֵ����Ϊ���¸�ʽ��{isValid:true/flase,tips:"IIIII"}
 * @param obj ������
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