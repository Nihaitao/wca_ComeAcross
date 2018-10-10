// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const _ = db.command
  let res = {}
  const idolids = await db.collection('attentionFan').where({
    fanid: event.userInfo.openId
  }).field({
    idolid: true
  }).get()
  let idolidArray = []
  if (idolids.data.length > 0) {
    for (let i = 0; i < idolids.data.length; i++) {
      idolidArray.push(idolids.data[i].idolid)
    }
    console.log(idolidArray)
    res.attentionList = await db.collection('userinfo')
      .where({
        openid: _.in(idolidArray)
      }).get()
  }

  const fanids = await db.collection('attentionFan').where({
    idolid: event.userInfo.openId
  }).field({
    fanid: true
  }).get()
  let fanidArray = []
  if (fanids.data.length > 0) {
    for (let i = 0; i < fanids.data.length; i++) {
      fanidArray.push(fanids.data[i].fanid)
    }
    res.fanList = await db.collection('userinfo').where({
      openid: _.in(fanidArray)
    }).get()
  }
  return res
}