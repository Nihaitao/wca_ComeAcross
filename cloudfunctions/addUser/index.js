// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  let user = await db.collection('userinfo').where({
    openid: event.userInfo.openId
  }).get()
  if (user.data.length > 0) {
    //更新
    return await db.collection('userinfo').where({
      openid: event.userInfo.openId
    }).update({
      data: event.user
    }).catch(console.error)
  } else {
    //新增
    let newuser = event.user
    newuser.openid = event.userInfo.openId
    return await db.collection('userinfo').add({
      data: newuser
    }).catch(console.error)
  }
}