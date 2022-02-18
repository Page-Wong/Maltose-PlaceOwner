// pages/placeManager/placeManager.js

const app = getApp()
var ajax = require('../../utils/ajax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    imgUrls:{},
    startPage: 1,
    pageSize: 10,
    searchLoading: true, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“已加载全部”的变量，默认false，隐藏
    searchLoadingNone: false  //“暂无数据”的变量，默认false，隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      that.setData({
        startPage: that.data.startPage + 1,  //每次触发上拉事件，把searchPageNum+1
      })
      that.search(false)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  search: function (isFirst) {
    var that = this
    if (isFirst) {
      this.setData({
        startPage:1
      })
    }
    ajax({
      url: app.globalData.host + '/Place/GetAllPageList',
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
        else if (isFirst && res.data.rows.length <= 0){
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
          that.setData({
            dataList: that.data.dataList.concat(res.data.rows)
          })
          res.data.rows.forEach(function(item, index){
            if (!that.data.imgUrls[item.id]) {
              that.getMaterialPageList(item.id)
            }
          })
        }
      }
    })
  },
  getMaterialPageList: function (id) {
    var that = this
    ajax({
      url: app.globalData.host + '/Place/GetMaterialPageList',
      data: {
        startPage: 1,
        pageSize: 1,
        ownerObjId: id
      },
      success: function (res) {
        if (res.data.rows && res.data.rows.length>0){
          that.data.imgUrls[id] = app.globalData.host + '/Place/GetThumbnail?id=' + res.data.rows[0].id
         
          that.setData({
            imgUrls: that.data.imgUrls
          })
        }
      }
    })
  }
})