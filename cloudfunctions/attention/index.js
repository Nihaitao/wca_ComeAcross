// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const attention = await db.collection('attentionFan').where({
    fanid: event.userInfo.openId,
    idolid: event.idolid
  }).get()
  if (attention.data.length == 0){
    let newattention = {
      fanid: event.userInfo.openId,
      idolid: event.idolid,
      atttime: Date.parse(new Date())
    }
    return await db.collection('attentionFan').add({
      data: newattention
    }).catch(console.error)
  }else{
    return 0
  }  
}