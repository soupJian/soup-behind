const mysqlRequest =  require('./mysql')
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
            console.log(users)
        })
    })
    // 用户关掉连接，下线了
    io.sockets.on("disconnecting",()=>{
        // const sql = `insert into userchat values (${uid},${fid},${time},${type},'${msg}')`
        // await mysqlRequest(sql)
    })
}

// 用户上线
// const online = async(socket,id,users)=>{
    
//     return users
// }

// 一对一聊天
const oneToOne = async (socket,data,users) =>{
    const {uid,fid,type,msg} = data
    const time = Date.now()
    // 用户接受消息
    socket.emit('receiveOneChat', {uid: uid,time,type,msg});
    // 如果好友在线，则好友进行同步接受
    if(users[fid]){
        socket.to(users[fid].id).emit('receiveOneChat', {fid: fid,time,type,msg});
    }
    // 数据入库
    const sql = `insert into userchat values (${uid},${fid},${time},${type},'${msg}')`
    await mysqlRequest(sql)
}