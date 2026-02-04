Write-Host "=== LOGIN (ADMIN) ==="
$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"email":"admin@electrohub.com","password":"123456"}'

$TOKEN = $response.access_token
Write-Host "TOKEN: $TOKEN"

Write-Host "=== GET PRODUCTS ==="
Invoke-RestMethod -Uri "http://localhost:3000/products" -Method GET

Write-Host "=== CREATE PRODUCT ==="
Invoke-RestMethod -Uri "http://localhost:3000/products" `
  -Method POST `
  -Headers @{ 
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
  } `
  -Body '{"name":"Laptop HP","price":3999,"stock":10,"categoryId":1}'
