const mysqlRequest =  require('./mysql')
const {arraylist} = require('./function')
module.exports = (io)=>{
    let users = {}
    // 用户登陆建立连接
    io.sockets.on('connection',socket=>{
        // 用户上线
        socket.on('online',async(id)=>{
            // 用户登陆
            let updateSql = `update user set login = 'true' where id = ${id}`
            await mysqlRequest(updateSql)
            users[id] = {
                id: socket.id,
                login: true
            }
        })
        // 一对一聊天
        socket.on('postOneChat', data =>{ oneToOne(socket,data,users )});
        // 用户上线
        socket.on('outline',async(id)=>{
            // 用户登陆
            let updateSql = `update user set login = 'false' where id = ${id}`
            await mysqlRequest(updateSql)
            users[id] = null
        })
    })
    // 用户关掉连接，下线了
    io.sockets.on("disconnecting",()=>{})
}

// 一对一聊天
const oneToOne = async (socket,data,users) =>{
    const {user,fuser,type,msg} = data
    const time = Date.now()
    let typeMsg = msg
    // 图片类型
    if(type == 1){ 
        imgMsg = "[图片]"
    }
    // 如果好友在线，则好友进行同步接受
    if(users[fuser.id]){
        // 聊天界面实现通讯
        socket.to(users[fuser.id].id).emit('receiveOneChat', {fid:fuser.id,time,type,msg});
        // 消息列表界面，实现右侧小圆点
        socket.to(users[fuser.id].id).emit('receiveNewsList',{...user,msg:typeMsg,type,time,flag: true})
    }
    // 用户聊天界面消息
    socket.emit('receiveOneChat', {uid: user.id,time,type,msg});
    // 用户自己 消息列表界面，用户自己发的消息没有小圆点
    socket.emit('receiveNewsList',{...fuser,msg:typeMsg,type,time,flag: false})
    // 聊天信息数据入库
    let sql
    sql = `insert into userchat values (${user.id},${fuser.id},${time},${type},'${msg}')`
    await mysqlRequest(sql)
    // 消息列表信息入库
    sql = `select list from newslist where id = ${user.id}`
    uResult = await mysqlRequest(sql)
    const uarray = JSON.stringify(arraylist(uResult,fuser,time,msg,true))
    sql = `update newslist set list = '${uarray}' where id = ${user.id}` 
    await mysqlRequest(sql)
    sql = `select list from newslist where id = ${fuser.id}`
    fResult = await mysqlRequest(sql)
    const farray = JSON.stringify(arraylist(fResult,user,time,msg,false))
    sql = `update newslist set list = '${farray}' where id = ${fuser.id}`
    await mysqlRequest(sql)
}