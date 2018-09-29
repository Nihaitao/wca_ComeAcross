// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  let res = { }
  let user = await db.collection('userinfo').where({
    openid: event.openid
  }).get()
  let location = await db.collection('location').where({
    openid: event.openid
  }).get()
  res.user = user
  res.location = location
  return res
}