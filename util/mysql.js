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
// const connection = mysql.createConnection(options)
// 连接池
const pool = mysql.createPool(options)

// 建立连接
const getConnection = () =>{
  return new Promise((resolve,reject)=>{
    pool.getConnection((err,connect)=>{
      // 如果建立失败
      if(err){
        reject(err)
      }else{
        resolve(connect)
      }
    })
  })
}

const mysqlRequest = (sql) =>{
  return new Promise((resolve,reject)=>{
    getConnection().then(connect=>{
      console.log(sql)
      connect.query(sql,(err,result)=>{
        if(err){
          reject(err)
          console.log("查询异常");
        }else{
          resolve(result)
        }
        connect.release()
      })
    }).catch(err=>{
      reject(err)
      console.log("数据库连接失败",err)
    })
  })
}

module.exports = {
  mysqlRequest
};
