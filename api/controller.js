var express = require('express');
var router = express.Router();
const keycloak = require('./keycloak-config.js')

router.get('/public', function(req, res){
    res.send("Hello public");
});

router.get('/user', keycloak.protect(), function (req, res) {
    res.send("Private details")
});


module.exports = router;