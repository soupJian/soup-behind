var express = require('express');
var router = express.Router();
const mysqlRequest = require('../util/mysql')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const {uid,fid} = req.query
  const sql = `select * from userchat where (uid = ${uid} && fid = ${fid}) or (uid = ${fid} && fid = ${uid})`
  const list = await mysqlRequest(sql)
  const arr = list.map(item=>{
      return {
        id: uid == item.uid ? uid : fid,
        time:item.time,
        type: item.type,
        msg: item.msg
      }
  })
  res.send(arr)
});

module.exports = router;