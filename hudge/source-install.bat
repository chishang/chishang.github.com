@ECHO OFF
REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist /v 1 /t REG_SZ /d gdlnggplcgijmhpadagammcigdhckcdj;http://v132056.sqa.cm4.tbsite.net/souren/update.xml /f
ECHO 重启Chrome浏览器，插件将自动完成安装。
ECHO 按任意键退出...
PAUSE>NUL
