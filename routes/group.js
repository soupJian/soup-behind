var express = require('express');
var router = express.Router();
var fs = require('fs');
const mysqlRequest = require('../util/mysql')

/* GET home page. */
router.post('/create', async function(req, res, next) {
  const {user,nick,imgUrl,description} = req.body
  // 第一步检查
  // 过滤图片url
  let base64Data = imgUrl.replace(/^data:image\/\w+;base64,/, "")
  // 把图片转换成buffer对象
  var dataBuffer = Buffer.from(base64Data, 'base64');
  // 群id
  const id = Date.now()
  // 创建文件夹位置
  // 图片地址
  const userPath = `public/group/${user.id}` // 用户 id
  const groupPath = `public/group/${user.id}/${id}`  // 群聊 id 时间戳
  const defaultPath = `public/group/${user.id}/${id}/${nick}` // 存放群聊 logo
  // 创建一个用户文件夹
  if(!fs.existsSync(userPath)){
    fs.mkdir(userPath,(err)=>{
      if(err){
        console.log(err);
      }
    })
  }
  // 创建群聊文件夹
  if(!fs.existsSync(groupPath)){
    fs.mkdir(groupPath,err=>{
      if(err){
        console.log(err);
      }
    })
  }
  // 存放 logo图片
  if(!fs.existsSync(defaultPath)){
    fs.mkdir(defaultPath,err=>{
      if(err){
        console.log(err);
      }
    })
  }
  // 保存图片
  const imgPath = `public/group/${user.id}/${id}/${nick}/-----soupCoover======.jpg`
  fs.writeFile(imgPath,dataBuffer,(err) => {
      if(err) {
          console.log(err)
      }else {
          console.log('保存图片成功')
      }
  })
  // 网络图片地址
  const picUrl = `http://www.soupjian.work:3100/group/${user.id}/${id}/${nick}/-----soupCoover======.jpg`
  // 群员
  const list = JSON.stringify(user)
  let sql
  sql = `insert into usergroup (id,nick,list,picUrl,description) values (${id},'${nick}','${list}','${picUrl}','${description}')`
  // 数据入库
  await mysqlRequest(sql)
  sql = `insert into creategroup (id,nick,picUrl) values (${id},'${nick}','${picUrl}')`
  await mysqlRequest(sql)
  const data = {
    msg: `群聊${nick}创建成功`,
    code: 200
  }
  res.send(data)
});

module.exports = router;
