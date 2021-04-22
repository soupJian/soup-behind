var express = require('express');
var router = express.Router();
// var moment = require('moment');
const mysqlRequest = require('../util/mysql')
const {picUrl,bgImg,phoneReg} = require('../util/type')

/* GET users listing. */
router.post('/', async function(req, res, next) {
  const {nick,account,password} = req.body
  const id = Date.now()
  let sql
  let data
  let result // 数据库查询结果
  if(phoneReg.test(account)){ // 手机注册
    // 判断手机号是否注册
    sql = `select phoneNumber from user where phoneNumber = '${account}' `
    result =  await mysqlRequest(sql)
    if(result.length > 0){
        data = {
            data:{
                msg: '手机号已注册'
            }
        }
    }else{
        // 手机号未注册
        sql = `insert into user (id,nick,phoneNumber,password,login,bgImg,picUrl,email,signature,address,age) values 
                                (${id},'${nick}','${account}','${password}','true','${bgImg}','${picUrl}','','','','')`
        await mysqlRequest(sql)
        let selectUser = `select * from user where id = ${id}`
        const user = await mysqlRequest(selectUser)
        data = {
            data:{
                user: user[0],
                friends: [user[0]]
            },
            code: 200
        }
    }
  }else{ // 邮箱注册
    // 判断邮箱是否注册
    sql = `select email from user where email = '${account}' `
    result =  await mysqlRequest(sql)
    if(result.length > 0){
        data = {
            data:{
                msg: '邮箱已注册'
            }
        }
    }else{
        sql = `insert into user (id,nick,email,password,login,bgImg,picUrl,phoneNumber,signature,address,age) values 
                                (${id},'${nick}','${account}','${password}','true','${bgImg}','${picUrl}','','','','')`
        await mysqlRequest(sql)
        let selectUser = `select * from user where id = ${id}`
        const user = await mysqlRequest(selectUser)
        data = {
            data:{
                user: user[0],
                friends: [user[0]]
            },
            code: 200
        }
    }
  }
//   注册时候创建对应好友列表
  const arr = []
  arr[0] = data.data.user
  const arrStr = JSON.stringify(arr)
  sql = `insert into friends (id,list) values (${id},'${arrStr}')`
  await mysqlRequest(sql)
//  创建 创建的群组占位
  sql = `insert into creategroup (id,list) values (${id},'')`
  await mysqlRequest(sql)
  sql = `insert into addgroup (id,list) values (${id},'')`
  await mysqlRequest(sql)
  res.send(JSON.parse(JSON.stringify(data)))
});

module.exports = router;
