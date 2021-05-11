var express = require('express');
var router = express.Router();
const mysqlRequest = require('../util/mysql')

/* GET users listing. */
router.get('/user', async function(req, res, next) {
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
router.get('/group', async function(req, res, next) {
  const {id} = req.query
  const sql = `select * from groupchat where id = ${id}`
  const list = await mysqlRequest(sql)
  const arr = list.map(item=>{
      return {
        id: item.uid,// user/group id
        time: item.time, // 消息时间
        type: item.type, // 消息类型
        msg: item.msg, // 消息
        nick: item.nick,
        groupMsg: item.groupMsg // 是否为群发的消息 0 是 1 不是
      }
  })
  res.send(arr)
});

module.exports = router;