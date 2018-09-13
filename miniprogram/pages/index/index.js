const app = getApp()
Page({
  data: {
    userInfo: {},
    markers: [],
    myMarker: null,
    scale: 16,
    codeType: 1,
    codeInfo: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hiddenLoading: true,
    expirytime: 0,
    timecheck: 0 //服务器时间与本地时间的差额
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      wx.redirectTo({
        url: '../welcome/welcome',
      })
    }

    //创建地图
    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.moveToLocation()
  },
  onShow: function() {
    var that = this
    let interval = setInterval(function() {
      if (that.data.userInfo.nickName || that.data.userInfo.avatarUrl) {
        clearInterval(interval)
        that.updateUserInfo()
        that.updateLocation()
        that.getAround()
      }
    })
    //当前广播状态
    wx.cloud.callFunction({
      name: 'comeAcrossState'
    }).then(res => {
      if (res.result.length > 0) {
        let data = res.result[0]
        let markers = that.data.markers
        markers.filter((item, index) => {
          if (item.openid === 0) {
            markers.splice(index, 1)
          }
        })
        let myMarker = {
          openid: 0,
          latitude: data.latitude,
          longitude: data.longitude,
          iconPath: data.iconPath,
          height: 32,
          width: 32,
          callout: {
            content: data.message,
            display: 'ALWAYS',
            borderRadius: 2,
            padding: 5,
            textAlign: 'left',
            color: '#fff',
            bgColor: '#222'
          }
        }
        markers.push(myMarker)
        that.setData({
          markers: markers,
          myMarker: myMarker,
          expirytime: data.expirytime,
          codeInfo: data.codeinfo,
          timecheck: data.nowtime - Date.parse(new Date())
        })
      }
    })
  },

  //更新用户
  updateUserInfo: function() {
    if (this.data.userInfo.avatarUrl != app.globalData.avatarUrl) {
      app.globalData.avatarUrl = this.data.userInfo.avatarUrl
      //下载头像
      wx.downloadFile({
        url: this.data.userInfo.avatarUrl,
        success: res => {
          let user = this.data.userInfo
          user.iconPath = res.tempFilePath.replace('http:/', '').replace('https:/', '')
          this.setData({
            userInfo: user
          })
          wx.cloud.callFunction({
            name: 'addUser',
            data: {
              user: user
            }
          })
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'addUser',
        data: {
          user: this.data.userInfo
        }
      })
    }
  },

  //更新位置
  updateLocation: function() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        wx.cloud.callFunction({
          name: 'addLocation',
          data: {
            location: res
          }
        })
      }
    })
  },

  //获取附近用户
  getAround: function() {
    wx.cloud.callFunction({
      name: 'getAround',
      data: {
        codeInfo: this.data.codeInfo
      }
    }).then(res => {
      // console.log(res)
    })
  },

  //点击头像
  markertap: function(e) {
    let url = '../info/info?Id=' + e.markerId;
    if (e.markerId == 0)
      url = '../setting/setting';
    wx.navigateTo({
      url: url,
    })
  },
  //定位
  myPosition: function() {
    this.mapCtx.moveToLocation();
  },
  //共享我的位置
  shareMyPosition: function() {
    let countdown = this.data.expirytime - Date.parse(new Date) - this.data.timecheck
    if (countdown > 0) {
      wx.showModal({
        title: '位置广播中',
        content: '倒计时' + countdown / 1000 + '秒',
        cancelText: '重播',
        cancelColor: '#FF0000',
        success: res => {
          if (res.cancel) {
            wx.cloud.callFunction({
              name: 'cancelComeAcross'
            }).then(res => {
              wx.navigateTo({
                url: '../shareMyPosition/shareMyPosition'
              })
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../shareMyPosition/shareMyPosition'
      })
    }
  },
  //我的信息
  myself: function() {
    wx.navigateTo({
      url: '../setting/setting'
    })
  },
  //我的信息
  friends: function() {
    wx.navigateTo({
      url: '../friends/friends'
    })
  },
  code: function() {
    if (this.data.codeType === 1) {
      this.setData({
        codeType: 0
      })
    } else {
      this.setData({
        codeType: 1
      })
    }
  }
})