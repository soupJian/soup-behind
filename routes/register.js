var express = require('express');
var router = express.Router();
// var moment = require('moment');
const mysqlRequest = require('../util/mysql')
const {picUrl,bgImg,phoneReg} = require('../util/type')

/* GET users listing. */
router.post('/', async function(req, res, next) {
  const {nick,account,password} = req.body
  let sql
  let result // 数据库查询结果
  if(phoneReg.test(account)){ // 手机注册
    sql = `select phoneNumber from user where phoneNumber = '${account}' `
    result =  await mysqlRequest(sql)
    if(result.length > 0){
        const data = {
            data:{
                msg: '手机号已注册'
            }
        }
        res.send(JSON.parse(JSON.stringify(data)))
        return
    }else{
        const id = Date.now()
        sql = `insert into user (id,nick,phoneNumber,password,login,bgImg,picUrl) values (${id},'${nick}','${account}','${password}','true','${bgImg}','${picUrl}')`
        await mysqlRequest(sql)
        let selectUser = `select * from user where id = ${id}`
        const user = await mysqlRequest(selectUser)
        const data = {
            data:{
                user: user[0],
            },
            code: 200
        }
        res.send(JSON.parse(JSON.stringify(data)))
        return
    }
  }else{ // 邮箱注册
    sql = `select email from user where email = '${account}' `
    result =  await mysqlRequest(sql)
    if(result.length > 0){
        const data = {
            data:{
                msg: '邮箱已注册'
            }
        }
        res.send(JSON.parse(JSON.stringify(data)))
        return
    }else{
        const id = Date.now()
        sql = `insert into user (id,nick,email,password,login,bgImg,picUrl) values (${id},'${nick}','${account}','${password}','true','${bgImg}','${picUrl}')`
        await mysqlRequest(sql)
        let selectUser = `select * from user where id = ${id}`
        const user = await mysqlRequest(selectUser)
        const data = {
            data:{
                user: user[0],
            },
            code: 200
        }
        res.send(JSON.parse(JSON.stringify(data)))
        return
    }
  }
});

module.exports = router;
