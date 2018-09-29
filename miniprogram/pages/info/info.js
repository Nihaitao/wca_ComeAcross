// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    mapHeight: '55vh'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)

    wx.cloud.callFunction({
      name: 'userinfo',
      data: {
        openid: options.id
      }
    }).then(res => {
      console.log(res)
      let user = res.result.user.data[0]
      let location = res.result.location.data[0]
      this.setData({
        userInfo: {
          id: options.id,
          nickName: user.nickName,
          sex: user.gender,
          avatarUrl: user.avatarUrl,
          attention: 185,
          fans: 25,
          markers: [{
            latitude: location.latitude,
            longitude: location.longitude,
          }]
        }
      })
    })
  },
  openActionsheetSh: function(e) {
    // let item = e.currentTarget.dataset.item;
    // let itemList = ['取消关注', '小黑屋'];
    // if (item.fanType === 0) {
    //   itemList = ['关注', '小黑屋'];
    // }
    wx.showActionSheet({
      itemList: ['取消关注', '小黑屋'],
      itemColor: '#007aff',
      success(res) {
        if (res.tapIndex === 0) {
          wx.showToast({
            title: '取关成功！'
          });
        } else if (res.tapIndex === 1) {
          wx.showToast({
            title: '拉黑成功！'
          });
        }
      }
    })
  }
})