@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Starting Spring Boot Microservices...

start "Auth Service (8081)" cmd /k "java -jar auth-service\target\auth-service-1.0.0.jar"
timeout /t 5 /nobreak >nul

start "Product Service (8082)" cmd /k "java -jar product-service\target\product-service-1.0.0.jar"
timeout /t 5 /nobreak >nul

start "Cart Service (8083)" cmd /k "java -jar cart-service\target\cart-service-1.0.0.jar"
timeout /t 3 /nobreak >nul

start "Recommendation Service (8084)" cmd /k "java -jar recommendation-service\target\recommendation-service-1.0.0.jar"
timeout /t 3 /nobreak >nul

start "API Gateway (8080)" cmd /k "java -jar api-gateway\target\api-gateway-1.0.0.jar"

echo All services launched!
