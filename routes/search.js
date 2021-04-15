var express = require('express');
var router = express.Router();
const mysqlRequest = require('../util/mysql')

/* GET home page. */
router.get('/', async function(req, res, next) {
    // 第一步获取搜索关键字
    const keywords = req.query.keywords
    const type = req.query.type // 0--找人 1--找群
    let sql
    // 第二步 模糊查询
    if(type==0){ // 找人
        sql = `select * from user where id like '%${keywords}%' or nick like '%${keywords}%'`
    }else{ // 找群
        sql = `select * from usergroup where id like '%${keywords}%' or nick like '%${keywords}%'`
    }
    const result = await mysqlRequest(sql)
    const data = {
        data: result,
        code: 200
    }
    res.send(data)
});

module.exports = router;
