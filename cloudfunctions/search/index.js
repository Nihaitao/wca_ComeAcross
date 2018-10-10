// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let user = await db.collection('userinfo').where({nickName:event.text}).get()
  
  if (user.data.length > 0) {
    for (let i = 0; i < user.data.length; i++){
      let location = await db.collection('location').where({ openid: user.data[i].openid}).get()
      
    }
  }
}