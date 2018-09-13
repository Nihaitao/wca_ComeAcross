// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  let exit = await db.collection('comeacross').where({
    openid: event.userInfo.openId,
    expirytime: _.gt(Date.parse(new Date()))
  }).get()
  if (exit.data.length > 0){
    return false
  }
  let user = await db.collection('userinfo').where({
    openid: event.userInfo.openId
  }).get()
  let location = await db.collection('location').where({
    openid: event.userInfo.openId
  }).get()
  let comeacross = {
    openid: user.data[0].openid,
    nickName: user.data[0].nickName,
    iconPath: user.data[0].iconPath,
    latitude: location.data[0].latitude,
    longitude: location.data[0].longitude,
    message: event.message,
    codeinfo: event.code,
    expirytime: getTime(event.minutes)
  }
  return await db.collection('comeacross').add({
    data: comeacross
  }).catch(console.error)
}

function getTime(minutes) {
  let time = new Date()
  let min = time.getMinutes()
  time.setMinutes(min + minutes * 1)
  return Date.parse(time)
}