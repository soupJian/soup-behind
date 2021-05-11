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
  const userPath = `public/group` // 用户 id
  const groupPath = `public/group/${id}`  // 群聊 id 时间戳
  const defaultPath = `public/group/${id}/-----soupCoover======` // 存放群聊 logo
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
  const imgPath = `public/group/${id}/-----soupCoover======/picUrl.jpg`
  fs.writeFile(imgPath,dataBuffer,(err) => {
      if(err) {
          console.log(err)
      }else {
          console.log('保存图片成功')
      }
  })
  // 网络图片地址
  const picUrl = `http://175.24.116.96:3100/group/${id}/-----soupCoover======/picUrl.jpg`

  let sql
  // 数据入库 所有群
  sql = `insert into usergroup (id,nick,picUrl,description) values (${id},'${nick}','${picUrl}','${description}')`
  await mysqlRequest(sql)
  // 群主信息为第一条数据
  const list = JSON.stringify([{
    "id":user.id,
    "nick": user.nick,
    "picUrl": user.picUrl,
    "nickStr": user.nick // 群别名
  }])
  sql = `insert into grouplist (id,list) values (${id},'${list}')`
  await mysqlRequest(sql)
  // 用户创建的多个群
  sql = `select list from creategroup where id = ${user.id}`
  let grouplist = await mysqlRequest(sql)
  grouplist = JSON.parse(grouplist[0].list)
  grouplist.push({
    "id": id,
    "nick": nick,
    "picUrl": picUrl,
    "description": description
  })
  const json = JSON.stringify(grouplist)
  sql = `update creategroup set list = '${json}' where id = ${user.id}`
  await mysqlRequest(sql)
  sql = `select list from creategroup where id = ${user.id}`
  const result = await mysqlRequest(sql)
  const data = {
    creategroup: JSON.parse(result[0].list),
    msg: `群聊${nick}创建成功`,
    code: 200
  }
  res.send(data)
});
router.post('/add',async function(req, res, next){
  const {user,group} = req.body
  let sql = `select list from addgroup where id = ${user.id}`
  const result = await mysqlRequest(sql)
  const addgroup = JSON.parse(result[0].list)
  addgroup.push(group)
  // 加入自己的列表
  sql = `update addgroup set list = '${JSON.stringify(addgroup)}' where id = ${user.id}`
  await mysqlRequest(sql)
  // 群聊列表中加入
  sql = `select list from grouplist where id = ${group.id}`
  const list = await mysqlRequest(sql)
  const grouplist = JSON.parse(list[0].list)
  grouplist.push({
    ...user,
    nickStr: user.nick // 别名
  })
  res.send(addgroup)
})

module.exports = router;
