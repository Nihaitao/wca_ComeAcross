// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  let res = { }
  const user = await db.collection('userinfo').where({
    openid: event.openid
  }).get()
  const location = await db.collection('location').where({
    openid: event.openid
  }).get()
  const attention = await db.collection('attentionFan').where({
    fanid: event.openid,
  }).get()
  const fan = await db.collection('attentionFan').where({
    idolid: event.openid,
  }).get()
  res.user = user
  res.location = location
  res.attention = attention.data.length
  res.fan = fan.data.length
  let test = fan.data.find(item => item.fanid === event.userInfo.openId)
  if (fan.data.find(item => item.fanid === event.userInfo.openId)) {//已关注
    res.relationType = 1
    if (attention.data.find(item => item.idolid === event.userInfo.openId)){//互相关注
      res.relationType = 2
    }
  }else{//未关注
    res.relationType = 0
  }
  return res
}