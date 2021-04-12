var express = require('express');
var router = express.Router();
const {emailReg,phoneReg} = require('../util/type')
const mysqlRequest = require('../util/mysql')

/* GET users listing. */
router.post('/', async function(req, res, next) {
  const {name,password} = req.body
  const {nameType,msg} = checkType(name)
  let sql = `select password from user where ${nameType} = '${name}'`
  const result = await mysqlRequest(sql)
  if( result.length != 0 && result[0].password == password){
    let updateSql = `update user set login = 'true' where ${nameType} = '${name}'`
    await mysqlRequest(updateSql)
    let selectUser = `select * from user where ${nameType} = '${name}'`
    const user = await mysqlRequest(selectUser)
    const data = {
        data:{
            user: user[0],
        },
        code: 200
    }
    res.send(JSON.parse(JSON.stringify(data)))
    return
  }else{
    const data = {
      data:{
          msg
      }
    }
    res.send(JSON.parse(JSON.stringify(data)))
  }
});

function checkType(name){
  if(phoneReg.test(name)){
    return {
      nameType: 'phoneNumber',
      msg: '手机号或者密码错误'
    }
  }
  else if(emailReg.test(name)){ // 邮箱登陆
    return {
      nameType: 'email',
      msg: '邮箱或者密码错误'
    }
  }
  else{
    return {
      nameType: 'nick',
      msg: 'soup号或者密码错误'
    }
  }
}

module.exports = router;
