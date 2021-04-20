var express = require('express');
var router = express.Router();
var fs = require('fs');
const mysqlRequest = require('../util/mysql')

/* GET home page. */
router.post('/', async function(req, res, next) {
  const {user} = req.body
   // 创建文件夹位置
   const userPath = `public/user/${user.id}` // 用户 id
   const defaultPath = `public/user/${user.id}/-----soupCoover======` 
  // 创建一个用户文件夹
  if(!fs.existsSync(userPath)){
    fs.mkdir(userPath,(err)=>{
      if(err){
        console.log(err);
      }
    })
  }
  // 存放头像和背景图的文件夹
  if(!fs.existsSync(defaultPath)){
    fs.mkdir(defaultPath,err=>{
      if(err){
        console.log(err);
      }
    })
  }
  for(let key in user){
      let sql
    //   如果修改手机号 需要判断手机号是否已经注册
    if(key == 'phoneNumber'){
        sql = `select phoneNumber from user where phoneNumber = ${user.phoneNumber}`
        const result = await mysqlRequest(sql)
        if(result.length > 0){
            const data = {
                msg: '手机号已注册，换一个试试'
            }
            res.send(JSON.parse(JSON.stringify(data)))
            return
        }
    }
    // 如果修改邮箱 需要判断邮箱是否已经注册
    if(key == 'email'){
        sql = `select email from user where email = '${user.email}'`
        const result = await mysqlRequest(sql)
        if(result.length > 0){
            const data = {
                msg: '邮箱已注册，换个试试'
            }
            res.send(JSON.parse(JSON.stringify(data)))
            return
        }
    }
    if(key != 'id' && key && key != 'bgImg' && key != "picUrl"){
        sql = `update user set ${key} = '${user[key]}' where id = ${user.id}`
        await mysqlRequest(sql)
    }
  }
  // 过滤图片url
  if(user.bgImg){
    let base64BgImg = user.bgImg.replace(/^data:image\/\w+;base64,/, "")
    let dataBufferBgImg = Buffer.from(base64BgImg, 'base64');
    let bgImgPath = `public/user/${user.id}/-----soupCoover======/bgImg.jpg`
    fs.writeFile(bgImgPath,dataBufferBgImg,(err) => {
        if(err) {
            console.log(err)
        }else {
            console.log('保存图片成功')
        }
    })
    let bgImgNetwork = `http://www.soupjian.work:3100/user/${user.id}/-----soupCoover======/bgImg.jpg`
    let sql = `update user set bgImg = '${bgImgNetwork}' where id = ${user.id}`
    await mysqlRequest(sql)
  }
  if(user.picUrl){
    let base64PicUrl = user.picUrl.replace(/^data:image\/\w+;base64,/, "")
    let dataBufferPicUrl = Buffer.from(base64PicUrl, 'base64');
    let picUrlPath = `public/user/${user.id}/-----soupCoover======/picUrl.jpg`
    fs.writeFile(picUrlPath,dataBufferPicUrl,(err) => {
        if(err) {
            console.log(err)
        }else {
            console.log('保存图片成功')
        }
    })
    let picUrlNetwork = `http://www.soupjian.work:3100/user/${user.id}/-----soupCoover======/picUrl.jpg`
    let sql = `update user set picUrl = '${picUrlNetwork}' where id = ${user.id}`
    await mysqlRequest(sql)
  }
  let sql = `select * from user where id = ${user.id}`
  const result = await mysqlRequest(sql)
  const datainfo = {
      user:result[0],
      code: 200
  }
  // 数据入库
  res.send(datainfo)
});

module.exports = router;
