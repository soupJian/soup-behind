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
                id: socket.id
            }
        })
        // 群 socket
        socket.on('group',data=>{ socket.join(data) })
        // 一对一聊天
        socket.on('postOneChat', data =>{ oneToOne(socket,data,users )});
        // 多人聊天
        socket.on('postGroupChat',data=>{ groupChat(socket,data) })
        // 用户下线
        socket.on('outline',async(id)=>{
            // 用户登陆
            let updateSql = `update user set login = 'false' where id = ${id}`
            await mysqlRequest(updateSql)
            users[id] = null
        })
        // 用户断开socket链接
        socket.on('disconnect',()=>{
            for(key in users){
                if(users[key] && users[key].id == socket.id){
                    users[key] = null
                }
            }
        })
    })
}

// 一对一聊天
const oneToOne = async (socket,data,users) =>{
    const {user,fuser,type,msg} = data
    const time = Date.now()
    let typeMsg = msg
    // 图片类型
    if(type == 1){ 
        typeMsg = "[图片]"
    }
    // 如果好友在线，则好友进行同步接受
    if(users[fuser.id]){
        // 聊天界面实现通讯 // type为消息类型 0 用户 1 群聊
        socket.to(users[fuser.id].id).emit('receiveChat', {id:user.id,time,type,msg}); 
        // 消息列表界面，实现右侧小圆点 
        socket.to(users[fuser.id].id).emit('receiveNewsList',{...user,msg:typeMsg,type: 0,time,flag: true})
    }
    // 用户聊天界面消息 // type为消息类型
    socket.emit('receiveChat', {id: user.id,time,type,msg});
    // 用户自己 消息列表界面，用户自己发的消息没有小圆点 // type为群/用户
    socket.emit('receiveNewsList',{...fuser,msg:typeMsg,type: 0,time,flag: false})
    // 聊天信息数据入库
    let sql
    sql = `insert into userchat values (${user.id},${fuser.id},${time},${type},'${msg}')`
    await mysqlRequest(sql)
    // 消息列表信息入库
    sql = `select list from newslist where id = ${user.id}`
    uResult = await mysqlRequest(sql)
    const uarray = JSON.stringify(arraylist(uResult,fuser,time,typeMsg,true,0))
    sql = `update newslist set list = '${uarray}' where id = ${user.id}` 
    await mysqlRequest(sql)
    sql = `select list from newslist where id = ${fuser.id}`
    fResult = await mysqlRequest(sql)
    const farray = JSON.stringify(arraylist(fResult,user,time,typeMsg,false,0))
    sql = `update newslist set list = '${farray}' where id = ${fuser.id}`
    await mysqlRequest(sql)
}
// 群聊天
const groupChat = async (socket,data) =>{
    const {user,group,type,msg,groupMsg,nick} = data
    // 创建房间
    const time = Date.now()
    let typeMsg = msg
    // 图片类型
    if(type == 1){ 
        typeMsg = "[图片]"
    }
    socket.to(group.id).emit("receiveNewsList",{...group,msg:typeMsg,type:1,time,flag: true})
    socket.emit('receiveNewsList',{...group,msg:typeMsg,type:1,time,flag: false})
    // 此方法除发送者不可接受
    socket.to(group.id).emit("receiveChat",{id:user.id,time,type,msg:typeMsg,groupMsg,nick})
    // 向发送者发消息
    socket.emit("receiveChat",{id:user.id,time,type,msg:typeMsg,groupMsg,nick})
    // 聊天信息数据入库
    let sql
    if(groupMsg == 0){
        sql = `insert into groupchat values (${group.id},${group.id},${time},'${msg}',${type},${groupMsg},'${nick}')`
    }else{
        sql = `insert into groupchat values (${group.id},${user.id},${time},'${msg}',${type},${groupMsg},'${nick}')`
    }
    await mysqlRequest(sql)
}