var express = require('express');
var router = express.Router();
const mysqlRequest = require('../util/mysql')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const id = req.query.id
  const sql = `select * from user where id = ${id}`
  const result = await mysqlRequest(sql)
  res.send(result[0]);
});

module.exports = router;
