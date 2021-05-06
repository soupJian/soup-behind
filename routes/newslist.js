var express = require('express');
var router = express.Router();
const mysqlRequest = require('../util/mysql')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const id = req.query.id
  const sql = `select list from newslist where id = ${id}`
  const result = await mysqlRequest(sql)
  let list = []
  if(result[0].list.length > 0){
      list = result[0].list
  }
  const dataObj = {
    data:{
      list: JSON.parse(list),
      code: 200
    }
  }
  res.send(dataObj)
});

module.exports = router;
