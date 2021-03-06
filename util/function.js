// result 数据库查询结果，
// time执行使劲按，
// msg消息列表，
// obj => user/fuser/group,
// flag true/user  false/fuser
const arraylist = (result,obj,time,msg,flag,type)=>{
    let arr = []
    if(result.length > 0 && result[0].list){
        arr = JSON.parse(result[0].list)
    }
    let index = arr.findIndex(item=>{
        return item.id == obj.id
    })
    let bradge = 0
    if(index >= 0){
        bradge = arr[index].bradge + 1
        arr.splice(index ,1)
    }
    arr.unshift({
        id: obj.id,
        nick: obj.nick,
        picUrl: obj.picUrl,
        time,
        bradge: flag ? 0: bradge,
        msg,
        type // 0表示一对一 ，1 表示 群聊
    })
  return arr
}

module.exports = {
    arraylist
}