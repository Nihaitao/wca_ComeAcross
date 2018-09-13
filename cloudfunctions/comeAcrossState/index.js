// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const db = cloud.database()
  const _ = db.command
  const now = Date.parse(new Date())
  let comeacross = await db.collection('comeacross').where({
    openid: event.userInfo.openId,
    expirytime: _.gt(now)
  }).get()
  if (comeacross.data.length > 0) {
    comeacross.data[0].nowtime = now
  }
  return comeacross.data
}