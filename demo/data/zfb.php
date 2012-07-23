<?php
	$zfb=$_GET["zfb"];
	if($zfb=="11@11.11"){
		$isValid="true";
		$mes="liuchaowu";
	}else{
		$isValid="false";
		$mes="the no is not exited";
	}
   $result="{\"isValid\":$isValid,\"mes\":\"$mes\"}";
   echo $result;
?>