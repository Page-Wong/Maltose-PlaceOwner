// pages/programPlay/programPlay.js
const app = getApp()
var ajax = require('../../utils/ajax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    program:{},
    id:"",
    url:"",
    html: "",
    isNeedAudit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        id: options.id,
        isNeedAudit: options.isNeedAudit == "true"
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    if (this.data.id){
      ajax({
        url: app.globalData.host + "/Program/Get",
        data:{
          id: that.data.id
        },
        success: function(res){
          if (res.data) {
            if (res.data.content) res.data.content = res.data.content.replace(/"/g, "'").replace(/[\r\n]/g, "")
            that.setData({
              program: res.data,
              url: app.globalData.host + "/ProgramReview/PlayAsync?programId=" + that.data.id,
            })

          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  returnTap: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  auditTap: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['通过', '不通过'],
      success: function (res) {
        if (!res.cancel) {
          ajax({
            url: app.globalData.host + '/ProgramReview/Audit',
            method: 'POST',
            loadingText: "正在提交",
            data: {
              programId: that.data.id,
              result: res.tapIndex
            },
            success: function (res) {
              if (res.data.result == "Success") {

                wx.showModal({
                  title: "提示",
                  content: "审核成功",
                  showCancel: false
                })
              } else {
                wx.showModal({
                  title: "提示",
                  content: res.data.message,
                  showCancel: false
                })
              }
              that.setData({
                isNeedAudit: false
              })
            }
          })
        }
      }
    })
  }
})