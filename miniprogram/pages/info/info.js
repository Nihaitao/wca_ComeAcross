// pages/info/info.js
Page({

      /**
       * 页面的初始数据
       */
      data: {
        userInfo: {},
        mapHeight: '55vh',
        targetId:''
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
        this.setData({ targetId: options.id})
        this.getData()
      },
      getData:function(){
        wx.cloud.callFunction({
          name: 'userinfo',
          data: {
            openid: this.data.targetId
          }
        }).then(res => {
          let user = res.result.user.data[0]
          let location = res.result.location.data[0]
          this.setData({
            userInfo: {
              id: this.data.targetId,
              nickName: user.nickName,
              sex: user.gender,
              avatarUrl: user.avatarUrl,
              attention: res.result.attention,
              fans: res.result.fan,
              relation: { 0: '未关注', 1: '已关注', 2: '互相关注' }[res.result.relationType],
              markers: [{
                latitude: location.latitude,
                longitude: location.longitude,
              }]
            }
          })
        })
      },
      openActionsheetSh: function(e) {
          let itemList = ['取消关注', '小黑屋'];
          if (this.data.userInfo.relation === '未关注') {
            itemList = ['关注', '小黑屋'];
          }
          var that = this
          wx.showActionSheet({
            itemList: itemList, 
            itemColor: '#007aff',
            success(res) {
              if (res.tapIndex === 0) {
                if (that.data.userInfo.relation === '未关注'){
                  wx.cloud.callFunction({
                    name: 'attention',
                    data: {
                      idolid: that.data.userInfo.id
                    }
                  }).then(res => {
                    wx.showToast({
                      title: '关注成功！'
                    })
                    that.getData()
                  })
                }else{
                  wx.cloud.callFunction({
                    name: 'cancelAttention',
                    data: {
                      idolid: that.data.userInfo.id
                    }
                  }).then(res => {
                    wx.showToast({
                      title: '取关成功！'
                    })
                    that.getData()
                  })
                }                
              } else if (res.tapIndex === 1) {

                wx.showToast({
                  title: '拉黑成功！'
                })
              }
            }
          })
      }
})