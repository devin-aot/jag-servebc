# Line of business API

## Run
```
npm install

npm run start
```

## Docker Build
```
docker build -t jag-servebc-api .
```

## Docker Run
```
docker run -p 3003:3003 \
-e KEYCLOAK_REALM="forms-flow-ai" \
-e KEYCLOAK_AUTH_SERVER_URL="http://host.docker.internal:8080/auth/" \
-e KEYCLOAK_CLIENT_ID="forms-flow-web" \
-e DB_NAME="servebc" \
-e DB_USERNAME="<USER>" \
-e DB_PASSWORD="<PASS>" \
-e DB_HOST="<HOST>" \
-e DB_PORT="<PORT>" \
jag-servebc-api 
```