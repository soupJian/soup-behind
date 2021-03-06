var express = require('express');
var router = express.Router();
const {emailReg,phoneReg} = require('../util/type')
const mysqlRequest = require('../util/mysql')

/* GET users listing. */
router.post('/', async function(req, res, next) {
  // 第一步 接收数据
  const {name,password} = req.body
  // 第二步 判断接受账号类型
  const {nameType,msg} = checkType(name)
  // 第三步 判断输入账号是否为已注册账号
  let checkLoginSql = `select ${nameType} from user where ${nameType} = '${nameType}'`
  const checkLoginResult = await mysqlRequest(checkLoginSql)
  if(checkLoginResult.length != 0){
    const data = {
      data:{
          msg: '账号暂未注册，请先注册'
      }
    }
    res.send(JSON.parse(JSON.stringify(data)))
    return
  }
  // 第四步 修改密码
  let sql = `update user set password = '${password}' where ${nameType} = '${name}'`
  await mysqlRequest(sql)
  const data = {
    data:{
        msg: '密码修改成功'
    },
    code: 200
  }
  res.send(JSON.parse(JSON.stringify(data)))
});

router.post('/pwd', async function(req, res, next) {
  // 第一步 接收数据
  const {id,oldPassword,password} = req.body
  // 第二步 获取信息
  let sql = `select * from user where id = ${id}`
  const user = await mysqlRequest(sql)
  if(oldPassword != user[0].password ){
    res.send({
      msg: '旧密码输入错误'
    })
    return
  }
  if(oldPassword == password){
    res.send({
      msg: '新旧密码相同'
    })
    return
  }
  sql = `update user set password = '${password}' where id = '${id}'`
  await mysqlRequest(sql)
  res.send({
    msg: '密码修改成功',
    code: 200
  })
});

function checkType(name){
  if(phoneReg.test(name)){
    return {
      nameType: 'phoneNumber',
      msg: '手机号或者密码错误'
    }
  }else{ // 邮箱登陆
    return {
      nameType: 'email',
      msg: '邮箱或者密码错误'
    }
  }
}

module.exports = router;
