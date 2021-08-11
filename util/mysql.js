const mysql = require('mysql')

const  options = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'study',
  charset: 'UTF8MB4_GENERAL_CI'
}
// 创建与数据库的连接对象
var connection = mysql.createConnection(options)
const handleConnect = () =>{
  // 建立连接
  connection.connect((err)=>{
    // 如果建立失败
    if(err){
      console.log(err);
    }else{
      console.log("连接数据库成功");
    }
  })
  connection.on('error', function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnection();
    } else {
        throw err;
    }
  });
}
handleConnect()

const mysqlRequest = (sql) =>{
  return new Promise((resolve,reject)=>{
    // console.log(sql)
    connection.query(sql,(err,result)=>{
      if(err){
        reject(err)
        console.log("查询异常");
      }else{
        resolve(result)
      }
    })
  })
}
module.exports = mysqlRequest;
