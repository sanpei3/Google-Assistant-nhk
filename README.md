Alexa 用の「NHKニュース(15分以上版, 非公式)」フラッシュニュースのソースです。

index.js : AWS lambdaのソース Makefile: AWS lambdaにuploadするzipを作成するMakefile

AWS lambdaがcold startしてしまうため、定期的に(15分おきに)API Gateway のURLにアクセスして対処しています。
