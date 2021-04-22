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
  // 第四步 判断密码是否正确
  let sql = `select password from user where ${nameType} = '${name}'`
  const result = await mysqlRequest(sql)
  if( result.length != 0 && result[0].password == password){
    // 账号密码都对应，进行登陆传值
    let updateSql = `update user set login = 'true' where ${nameType} = '${name}'`
    await mysqlRequest(updateSql)
    let usersql = `select * from user where ${nameType} = '${name}'`
    const user = await mysqlRequest(usersql)
    let addgroupsql = `select list from addgroup where id = ${user[0].id}`
    let creategroupsql = `select list from creategroup where id = ${user[0].id}`
    const addgroup = await mysqlRequest(addgroupsql)
    const creategroup = await mysqlRequest(creategroupsql)
    const data = {
        data:{
            user: user[0],
            addgroup: addgroup[0].list,
            creategroup: creategroup[0].list,
        },
        code: 200
    }
    res.send(JSON.parse(JSON.stringify(data)))
    return
  }else{
    // 账号和密码不匹配，返回提示信息
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
