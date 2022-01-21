const express = require('express');
const router = express.Router();
const keycloak = require('./keycloak-config.js')

router.get('/public', function(req, res){
    res.send("Hello public");
});

// https://github.com/keycloak/keycloak-nodejs-connect/blob/main/keycloak.d.ts#L297
// https://wjw465150.gitbooks.io/keycloak-documentation/content/securing_apps/topics/oidc/nodejs-adapter.html
router.get('/user', keycloak.protect('formsflow-client'), function (req, res) {
    res.send("Private details")
});


module.exports = router;