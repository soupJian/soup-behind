var express = require('express');
var router = express.Router();
const mysqlRequest = require('../util/mysql')
/* Post home page. */
router.post('/', async function(req, res, next) {
  const {user,id,nick,picUrl} = req.body
  let sql
  sql = `select * from friends where id = ${user.id}`
  const result = await mysqlRequest(sql)
  let array = []
  if(result[0].list){
    array = JSON.parse(result[0].list)
  }
  array.push({
    "id": id,
    "nick": nick,
    "picUrl": picUrl
  })
  const data = JSON.stringify(array)
  sql = `update friends set list = '${data}' where id = ${user.id}`
  await mysqlRequest(sql)
  sql = `select * from friends where id = ${user.id}`
  const friends = await mysqlRequest(sql)
  const dataObj = {
    data:{
      friends: JSON.parse(friends[0].list),
      code: 200
    }
  }
  res.send(dataObj)
});

module.exports = router;
