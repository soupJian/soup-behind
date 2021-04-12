var express = require('express');
var router = express.Router();
const mysqlRequest = require('../util/mysql')

/* GET users listing. */
router.get('/', function(req, res, next) {
  const sql = 'select * from user'
  mysqlRequest(sql)
  res.send('respond with a resource');
});

module.exports = router;
