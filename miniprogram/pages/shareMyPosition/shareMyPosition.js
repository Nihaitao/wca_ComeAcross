const app = getApp()
Page({
  data: {
    message:"有没有一起散步的小伙伴，我在这里，求偶遇"
  },

  onReady: function () {
   //根据系统时间，用户性别改变title的一些逻辑
  },
  formSubmit: function (e) {
    wx.cloud.callFunction({
      name: 'comeAcross',
      data: e.detail.value
    }).then(res=>{
      console.log(res)
      }).catch(res => {
        console.log(res)
    })
  }

})