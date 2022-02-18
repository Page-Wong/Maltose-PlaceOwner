// pages/equipmentRepairApply/equipmentRepairApply.js
const app = getApp()
var ajax = require('../../utils/ajax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    data:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
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
    if (this.data.id) {
      ajax({
        url: app.globalData.host + "/Equipment/Get",
        data: {
          id: that.data.id
        },
        success: function (res) {
          if (res.data) {
            that.setData({
              data: res.data
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

  save: function (e) {
    var that = this

    ajax({
      loadingText: "正在保存...",
      url: app.globalData.host + '/EquipmentRepairApply/SaveRepair',
      method: "POST",
      data: {
        EquipmentId: that.data.id,
        PlaceId: that.data.data.placeDto.id,
        ProblemDescription: e.detail.value.problemDescription,
        PlaceContact: e.detail.value.contact,
        PlaceContactPhone: e.detail.value.phone,
      },
      success: function (res) {
        if (res.data) {
          if (res.data.result == "Success") {
            wx.showModal({
              title: "提示",
              content: "提交成功",
              showCancel: false,
              success: function(){
                wx.navigateBack({
                  delta: 1
                })
              }
            })
            
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            })
          }
        } else {
          wx.showModal({
            title: "提示",
            content: "提交出错",
            showCancel: false
          })
        }
      }
    })
  }
})