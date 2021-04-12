var express = require('express');
var router = express.Router();
// var moment = require('moment');
const mysqlRequest = require('../mysql/mysql')
const picUrl = 'http://www.soupjian.work:3100/defaultImg/picUrl.jpg'
const bgImg = 'http://www.soupjian.work:3100/defaultImg/bgImg.jpg'

/* GET users listing. */
router.post('/', async function(req, res, next) {
  const {nick,account,password} = req.body
  phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  let sql
  let result // 数据库查询结果
  if(phoneReg.test(account)){ // 手机注册
    sql = `select phoneNumber from user where phoneNumber = '${account}' `
    result =  await mysqlRequest(sql)
    if(result.length > 0){
        const data = {
            data:{
                msg: '该手机号已注册'
            }
        }
        res.send(JSON.parse(JSON.stringify(data)))
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
    }
  }else{ // 邮箱注册
    sql = `select email from user where email = '${account}' `
    result =  await mysqlRequest(sql)
    if(result.length > 0){
        const data = {
            data:{
                msg: '该邮箱已注册'
            }
        }
        res.send(JSON.parse(JSON.stringify(data)))
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
    }
  }
});

module.exports = router;
