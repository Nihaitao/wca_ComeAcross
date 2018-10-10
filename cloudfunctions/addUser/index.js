// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const userinfo = {
  "_id": "W5oEnP1aG3 - S5gyN",
  "avatarUrl": "https: //wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epqbvU7lny5j0f9GcaxT2BIiboTBR8MWQj6jyzmRXsWvSUI9VqBF2Xv5FXbVcUyxfhdjjGTzeIuHUQ/132",
  "city": "",
  "country": "Christmas Island",
  "gender": 1,
  "iconPath": "/tmp/wxc53e77afa628c117.o6zAJs060dXyGKymfmPriteed3uk.B7k2UDdteLscabc424bf94ec5c7c95de1cea5f41d8aa.jpeg",
  "language": "zh_CN",
  "nickName": "Diviner",
  "openid": "oF2SA4n5tz8wcokiVjJJtoCOvxUU",
  "province": "",
  "location": {
    "accuracy": 65,
    "altitude": 0,
    "horizontalAccuracy": 65,
    "latitude": 28.25529,
    "longitude": 112.83134,
    "speed": -1,
    "verticalAccuracy": 65
  },
  "attention": ["sdadasdddssssss", "sdadasdddssssssfffffffffff"],
  "fan": ["sdadasdddssssss", "sdadasdddssssssfffffffffff"],
  "blacklist": ["sdadasdddssssss", "sdadasdddssssssfffffffffff"],
  "closefriend": ["sdadasdddssssss", "sdadasdddssssssfffffffffff"],
  "comeacross": {
    "codeinfo": "dd",
    "expirytime": 1536832295000,
    "latitude": 20.23529,
    "longitude": 118.93134,
    "message": "有没有一起散步的小伙伴，我在这里，求偶遇"
  }
}

const comeacrossHistory = {
  "codeinfo": "dd",
  "time": 1536832295000,
  "mins":20,
  "latitude": 20.23529,
  "longitude": 118.93134,
  "message": "有没有一起散步的小伙伴，我在这里，求偶遇",
  "openid":"dasdasdasdsd"
}
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