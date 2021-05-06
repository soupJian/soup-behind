// result 数据库查询结果，time执行使劲按，msg消息列表，obj => user/fuser
const arraylist = (result,obj,time,msg)=>{
    let arr = []
    if(result.length > 0 && result[0].list){
        arr = JSON.parse(result[0].list)
    }
    let index = arr.findIndex(item=>{
        return item.id == obj.id
    })
    let bradge = 0
    if(index >= 0){
        bradge = arr[index].bradge
        arr.splice(index ,1)
    }
    arr.unshift({
        id: obj.id,
        nick: obj.nick,
        picUrl: obj.picUrl,
        time,
        bradge: bradge + 1,
        msg,
    })
  return arr
}

module.exports = {
    arraylist
}