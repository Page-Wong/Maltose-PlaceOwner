// pages/programReview/programReview.js

const app = getApp()
var ajax = require('../../utils/ajax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageURL: '/image/play.png',
    userInfo: {},
    dataList: [],
    startPage:1,
    pageSize:10,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    searchLoadingNone: false  //“暂无数据”的变量，默认false，隐藏
  },
// region base function

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      this.setData({
        tips: '请升级微信'
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
    this.search(true)
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
    this.search(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.data.startPage = that.data.startPage + 1,  //每次触发上拉事件，把searchPageNum+1
      that.search(false)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
//endregion

  search: function (isFirst) {
    var that = this
    ajax({
      url: app.globalData.host + '/ProgramReview/GetPageList',
      data: {
        startPage: that.data.startPage,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        if (res.data.rowCount > that.data.startPage * that.data.pageSize) {
          that.setData({
            searchLoading: true,
            searchLoadingComplete: false,
            searchLoadingNone: false
          })
        }
        else if (isFirst && res.data.rows.length <= 0) {
          that.setData({
            searchLoading: false,
            searchLoadingComplete: false,
            searchLoadingNone: true
          })
        }
        else {
          that.setData({
            searchLoading: false,
            searchLoadingComplete: true,
            searchLoadingNone: false
          })
        }
        if (res.data.rows.length > 0) {
          if (isFirst) {
            that.setData({
              dataList: []
            })
          }
          res.data.rows.forEach(function (item, index) {
            that.getProgramAuditStatus(item, function (it, data) {
              it.needAudit = data.result == 'Success'
              it.status = data.message
              that.setData({
                dataList: that.data.dataList.concat(it)
              })
            })
          })
        }
      }
    }) 
  },
  getProgramAuditStatus: function (it, callback){
    ajax({
      url:app.globalData.host + '/ProgramReview/GetProgramAuditStatus',
      data:{
        programId: it.id
      },
      success: function(res){
        callback(it, res.data)        
      }
    })
  }
})