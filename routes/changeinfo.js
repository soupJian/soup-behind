var express = require('express');
var router = express.Router();
var fs = require('fs');
const mysqlRequest = require('../util/mysql')

/* GET home page. */
router.post('/', async function(req, res, next) {
  const {user} = req.body
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
    let bgImgPath = `public/user/${user.id}/-----soupCover======/bgImg.jpg`
    fs.writeFile(bgImgPath,dataBufferBgImg,(err) => {
        if(err) {
            console.log(err)
        }else {
            console.log('保存图片成功')
        }
    })
    let bgImgNetwork = `http://175.24.116.96:3100/user/${user.id}/-----soupCover======/bgImg.jpg`
    let sql = `update user set bgImg = '${bgImgNetwork}' where id = ${user.id}`
    await mysqlRequest(sql)
  }
  if(user.picUrl){
    let base64PicUrl = user.picUrl.replace(/^data:image\/\w+;base64,/, "")
    let dataBufferPicUrl = Buffer.from(base64PicUrl, 'base64');
    let picUrlPath = `public/user/${user.id}/-----soupCover======/picUrl.jpg`
    fs.writeFile(picUrlPath,dataBufferPicUrl,(err) => {
        if(err) {
            console.log(err)
        }else {
            console.log('保存图片成功')
        }
    })
    let picUrlNetwork = `http://175.24.116.96:3100/user/${user.id}/-----soupCover======/picUrl.jpg`
    let sql = `update user set picUrl = '${picUrlNetwork}' where id = ${user.id}`
    await mysqlRequest(sql)
  }
  let sql = `select id,login,nick,phoneNumber,email,bgImg,picUrl,signature,address,sex,age from user where id = ${user.id}`
  const result = await mysqlRequest(sql)
  const datainfo = {
      user:result[0],
      code: 200
  }
  // 数据入库
  res.send(datainfo)
});

module.exports = router;
