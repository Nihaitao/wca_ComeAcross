// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  let user = await db.collection('userinfo').where({
    openid: event.userInfo.openId
  }).get()
  console.log(user)
  if (user.data.length > 0) {
    console.log(1)
    console.log(event.user)
    return await db.collection('userinfo').where({
      openid: event.userInfo.openId
    }).update({data: event.user})
  } else {
    console.log(2)
    let newuser = event.user
    newuser.openid = event.userInfo.openId
    console.log(newuser)
    try {
      return await db.collection('userinfo').add({
        // data 字段表示需新增的 JSON 数据
        data: newuser
      })
    } catch (e) {
      console.error(e)
    }
    // db.collection('userinfo').add({
    //   data: newuser
    //   })
    //   .then(res => {
    //     console.log(3)
    //     console.log(res)
    //   })
    //   .catch(console.error)
  }

}