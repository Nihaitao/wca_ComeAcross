// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  const now = Date.parse(new Date())
  if (event.codeType === 1) {//有暗号
    return await db.collection('comeacross').where({
      expirytime: _.gt(now),
      codeinfo: event.codeInfo
    }).get()
  }else{//没有暗号
    //计算当前位置范围内所有用户 todo
    // let location = await db.collection('location').where({
    //   openid: event.userInfo.openId
    // }).get()
    return await db.collection('comeacross').where({
      expirytime: _.gt(now)
    }).get()
  }
}