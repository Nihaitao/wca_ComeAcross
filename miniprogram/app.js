//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    // wx.cloud.callFunction({
    //   name: 'login',
    //   data: {},
    //   success: res => {
    //     console.log('[云函数] [login] user openid: ', res.result.openid)
    //     this.globalData.openid = res.result.openid
    //   },
    //   fail: err => {
    //     console.error('[云函数] [login] 调用失败', err)
    //   }
    // })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //下载头像
              wx.downloadFile({
                url: res.userInfo.avatarUrl,
                success: rsp => {
                  res.userInfo.iconPath = rsp.tempFilePath.replace('http:/', '').replace('https:/', '');
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo;

                  wx.cloud.callFunction({
                    name: 'addUser',
                    data: {user:res.userInfo},
                    success: res => {
                      console.log(res)
                    },
                    fail: err => {
                      console.error(err)
                    }
                  })

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })

            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: '',
    latitude: 0,
    longitude: 0
  },
})