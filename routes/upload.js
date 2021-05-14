var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', async function(req, res, next) {
    const {imgUrl} = req.body
    // 过滤图片url
    let base64Data = imgUrl.replace(/^data:image\/\w+;base64,/, "")
    // 把图片转换成buffer对象
    var dataBuffer = Buffer.from(base64Data, 'base64');
    // 群id
    const id = Date.now()
    // 保存图片
    const imgPath = `public/chat/${id}.jpg`
    fs.writeFile(imgPath,dataBuffer,(err) => {
        if(err) {
            console.log(err)
        }else {
            console.log('保存图片成功')
        }
    })
    // 网络图片地址
    const picUrl = `http://175.24.116.96:3100/chat/${id}.jpg`
    res.send({
        picUrl
    })
  });
  module.exports = router;