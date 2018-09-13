// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  let comeacross = await db.collection('comeacross').where({
    openid: event.userInfo.openId,
    expirytime: _.gt(Date.parse(new Date()))
  }).get()
  if (comeacross.data.length > 0){
    return await db.collection('comeacross').where({
      _id:comeacross.data[0]._id
    }).update({
      data: {
        expirytime: Date.parse(new Date())
      }
    }).catch(console.error)
  }
}