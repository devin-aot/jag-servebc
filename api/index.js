const express = require('express');
const app = express();
const controller = require('./controller.js');
const { configuredSession } = require('./session-config.js')
const keycloak = require('./keycloak-config.js')

app.use(configuredSession);

// Install the Keycloak middleware.
app.use(keycloak.middleware({
  logout: '/logout'
}));

app.get('/', function(req, res){
   res.send("Server is up!");
});

app.use('/api/v1', controller);

app.listen(3003);