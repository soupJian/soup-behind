var express = require('express');
var router = express.Router();
const mysqlRequest = require('../util/mysql')

/* GET users listing. */
router.post('/', async function(req, res, next) {
  const {nick} = req.body
  const sql = `select nick from user where nick = '${nick}'`
  const result = await mysqlRequest(sql)
  if(result.length > 0 && result[0].nick == nick){
      res.send({
          data:{
              msg: '该昵称已被占用'
          }
      });
  }else{
      res.send({
          data:{
              nick
          }
      })
  }
});

module.exports = router;
