$baseDir = "E:\springboot with react"
$javaExe = "C:\Program Files\Java\jdk-17\bin\java.exe"
$logsDir = Join-Path $baseDir "logs"

if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

$services = @(
    @{ Name = "auth-service"; Port = 8081; Jar = "$baseDir\backend\auth-service\target\auth-service-1.0.0.jar" },
    @{ Name = "product-service"; Port = 8082; Jar = "$baseDir\backend\product-service\target\product-service-1.0.0.jar" },
    @{ Name = "cart-service"; Port = 8083; Jar = "$baseDir\backend\cart-service\target\cart-service-1.0.0.jar" },
    @{ Name = "recommendation-service"; Port = 8084; Jar = "$baseDir\backend\recommendation-service\target\recommendation-service-1.0.0.jar" },
    @{ Name = "api-gateway"; Port = 8080; Jar = "$baseDir\backend\api-gateway\target\api-gateway-1.0.0.jar" }
)

foreach ($s in $services) {
    $stdout = Join-Path $logsDir "$($s.Name).log"
    $stderr = Join-Path $logsDir "$($s.Name)-err.log"
    Write-Host "Starting $($s.Name)..." -ForegroundColor Cyan
    $argList = @("-jar", "`"$($s.Jar)`"")
    Start-Process -FilePath $javaExe -ArgumentList $argList `
                  -WorkingDirectory $baseDir `
                  -RedirectStandardOutput $stdout `
                  -RedirectStandardError $stderr `
                  -WindowStyle Hidden
}

Write-Host "All services initiated. Waiting for ports to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 12
