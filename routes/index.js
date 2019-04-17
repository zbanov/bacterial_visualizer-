

var express = require("express");
var router = new express.Router();
var app = express();

/* GET home page. */
app.use(express.static(__dirname + '/public'));

module.exports = router;
