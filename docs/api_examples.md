# Pruebas rápidas con curl
```bash
API=http://localhost:3000/api/v1
TOKEN=$(curl -s -X POST $API/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"test@balancefood.cl","password":"Password123"}' | ruby -rjson -e 'puts JSON.parse(STDIN.read)["token"]')

curl $API/restaurants -H "Authorization: Bearer $TOKEN"
curl -X POST $API/restaurants -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"restaurant":{"name":"Nuevo local","category":"Almuerzo"}}'
curl "$API/recommendations?budget=40000" -H "Authorization: Bearer $TOKEN"
curl -X DELETE $API/auth/logout -H "Authorization: Bearer $TOKEN"
curl $API/restaurants -H "Authorization: Bearer $TOKEN"   # ahora responde 401
```
