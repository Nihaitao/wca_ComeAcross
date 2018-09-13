// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const db = cloud.database()
  const _ = db.command
  let location = await db.collection('location').where({
    openid: event.userInfo.openId
  }).get()
  if (location.data.length > 0) {
    //更新comeacross
    let comeacross = await db.collection('comeacross').where({
      openid: event.userInfo.openId,
      expirytime: _.gt(Date.parse(new Date()))
    }).get()
    console.log(comeacross)
    if (comeacross.data.length > 0) {
      await db.collection('comeacross').where({
        _id: comeacross.data[0]._id
      }).update({
        data: {
          latitude: event.location.latitude,
          longitude: event.location.longitude
        }
      }).catch(console.error)
    }

    //更新location
    return await db.collection('location').where({
      openid: event.userInfo.openId
    }).update({
      data: event.location
    }).catch(console.error)
  } else {
    //新增
    let newlocation = event.location
    newlocation.openid = event.userInfo.openId
    return await db.collection('location').add({
      data: newlocation
    }).catch(console.error)
  }
}