var express = require('express');
var router = express.Router();
var fs = require('fs');
const mysqlRequest = require('../util/mysql')
const {phoneReg} = require('../util/type')

/* GET users listing. */
router.post('/', async function(req, res, next) {
  const {nick,account,password} = req.body
  const id = Date.now()
  let sql
  let data
  let result // 数据库查询结果
  const picUrl = `http://175.24.116.96:3100/user/${id}/-----soupCover======/picUrl.jpg`
  const bgImg = `http://175.24.116.96:3100/user/${id}/-----soupCover======/bgImg.jpg`
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
        sql = `insert into user (id,nick,phoneNumber,password,bgImg,picUrl,email,signature,address,age,login) values 
                                (${id},'${nick}','${account}','${password}','${bgImg}','${picUrl}','','','','','false')`
        await mysqlRequest(sql)
        let selectUser = `select id,login,nick,phoneNumber,email,bgImg,picUrl,signature,address,sex,age from user where id = ${id}`
        const user = await mysqlRequest(selectUser)
        data = {
            data:{
                user: user[0],
                friends: [{
                    id: user[0].id,
                    nick: user[0].nick,
                    picUrl: user[0].picUrl
                }]
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
        sql = `insert into user (id,nick,email,password,bgImg,picUrl,phoneNumber,signature,address,age,login) values 
                                (${id},'${nick}','${account}','${password}','${bgImg}','${picUrl}','','','','','false')`
        await mysqlRequest(sql)
        let selectUser = `select select id,login,nick,phoneNumber,email,bgImg,picUrl,signature,address,sex,age from user where id = ${id}`
        const user = await mysqlRequest(selectUser)
        data = {
            data:{
                user: user[0],
                friends: [{
                    id: user[0].id,
                    nick: user[0].nick,
                    picUrl: user[0].picUrl
                }]
            },
            code: 200
        }
    }
  }
  const userPath = `public/user/${id}` // 用户 id 文件夹
  const imgPath = `public/user/${id}/-----soupCover======`
  //  1.注册时候创建用户文件夹
  fs.mkdir(userPath,(err)=>{
    if(err){
        console.log(err);
    }
  })
  fs.mkdir(imgPath,(err)=>{
    if(err){
        console.log(err);
    }
    fs.copyFile('public/defaultImg/picUrl.jpg',`public/user/${id}/-----soupCover======/picUrl.jpg`,function(err){
        if(err) console.log(err)
    })
    fs.copyFile('public/defaultImg/bgImg.jpg',`public/user/${id}/-----soupCover======/bgImg.jpg`,function(err){
        if(err) console.log(err)
    })
  })
// 注册时候创建对应好友列表
  const arr = []
  arr[0] = {
      id: data.data.user.id,
      nick: data.data.user.nick,
      picUrl: data.data.user.picUrl
  }
  sql = `insert into friends (id,list) values (${id},'${JSON.stringify(arr)}')`
  await mysqlRequest(sql)
// 创建 创建的群组占位
  sql = `insert into creategroup (id,list) values (${id},'')`
  await mysqlRequest(sql)
  sql = `insert into addgroup (id,list) values (${id},'')`
  await mysqlRequest(sql)
  res.send(JSON.parse(JSON.stringify(data)))
});

module.exports = router;
