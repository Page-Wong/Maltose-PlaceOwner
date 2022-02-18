// pages/placeEdit/placeEdit.js
const app = getApp()
var ajax = require('../../utils/ajax.js')
var upload = require('../../utils/upload.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxImgCount:9,
    place:{
      id: "",
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      phone: "",
      contact: "",
      introduction: ""
    },
    imgUrls: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.id){
      this.setData({
        place: {
          id:options.id
        }
      })
      this.getMaterialPageList(options.id)
      this.getInfo(options.id)
    } else {
      this.locationTap()
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

  locationTap: function () {
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          wx.chooseLocation({
            success(res){
              var it = that.data.place
              it.name = res.name
              it.address = res.address
              it.latitude = res.latitude
              it.longitude = res.longitude
              that.setData({
                place: it
              })
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
        pageSize: 10,
        ownerObjId: id
      },
      success: function (res) {
        if (res.data.rows && res.data.rows.length > 0) {
          var imgUrls = []
          res.data.rows.forEach(function (item, index) {
            imgUrls.push({
              id: item.id,
              url:app.globalData.host + '/Place/GetThumbnail?id=' + item.id
              })
          })
          that.setData({
            imgUrls: imgUrls
          })

        }
      }
    })
  },

  getInfo: function (id) {
    var that = this
    ajax({
      url: app.globalData.host + '/Place/Get',
      data: {
        id: id
      },
      success: function (res) {
        if (res.data) {  

          var it = that.data.place

          it.name= res.data.name ? res.data.name : "",
          it.address = res.data.street ? res.data.street : "",
          it.longitude= res.data.mapPointX ? res.data.mapPointX : "",
          it.latitude= res.data.mapPointY ? res.data.mapPointY : "",
          it.phone= res.data.phone ? res.data.phone : "",
          it.contact= res.data.contact ? res.data.contact : "",
          it.introduction= res.data.introduction ? res.data.introduction : ""
          that.setData({
            place: it
          })
        }
      }
    })
  },

  save: function(e){
    var that = this
    that.data.place.name = e.detail.value.name
    that.data.place.address = e.detail.value.address
    that.data.place.phone = e.detail.value.phone
    that.data.place.contact = e.detail.value.contact
    that.data.place.introduction = e.detail.value.introduction

    ajax({
      loadingText: "正在保存...",
      url: app.globalData.host + '/Place/WxEdit',
      method: "POST",
      data: {
        id: that.data.place.id,
        name: that.data.place.name,
        address: that.data.place.address,
        longitude: that.data.place.latitude,
        latitude: that.data.place.longitude,
        phone: that.data.place.phone,
        contact: that.data.place.contact,
        introduction: that.data.place.introduction
      },
      success: function (res) {
        if (res.data) {
          if(res.data.result == "Success"){

            wx.showModal({
              title: "提示",
              content: "保存成功",
              showCancel: false,
              success: function () {
                if (that.data.place.id == "") {
                  that.data.place.id = res.data.id
                  that.setData({
                    place: that.data.place
                  })
                } else {
                  wx.navigateBack({
                    delta: 1
                  })
                }                
              }
            })
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false
            })
          }
        } else{
          wx.showModal({
            title: "提示",
            content: "保存出错",
            showCancel: false
          })
        }
      }
    })
  },

  remove: function () {
    var that = this

    wx.showModal({
      title: '提示',
      content: '是否确认删除？',
      success: function (res) {
        if (res.confirm) {
          ajax({
            loadingText: "正在删除...",
            url: app.globalData.host + '/Place/Delete',
            method: "POST",
            data: {
              id: that.data.place.id
            },
            success: function (res) {
              if (res.data) {
                if (res.data.result == "Success") {
                  wx.showToast({
                    title: "删除成功",
                    icon: 'success',
                    mask: true
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500)
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    mask: true
                  })
                }
              } else {
                wx.showToast({
                  title: '删除出错',
                  icon: 'none',
                  mask: true
                })
              }
            }
          })
        }
      }
    })
    
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (pics) {
        if (pics.tempFilePaths.length + that.data.imgUrls.length > that.data.maxImgCount){
          wx.showModal({
            title: '提示',
            content: "图片总数不能超过" + that.data.maxImgCount + "张",
            showCancel: false
          })
          return
        }
        pics.tempFilePaths.forEach(function(item, index){
          upload({
            url: app.globalData.host + '/Place/AddMaterial',
            filePath: item,
            name: 'dir_file',
            formData: {
              'ownerObjId': that.data.place.id
            },
            success(res) {
              var data = JSON.parse(res.data)
              if (data.result == "Success") {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                  imgUrls: that.data.imgUrls.concat({id:data.data.id, url:item})
                })
              } else {
                wx.showToast({
                  title: data.message,
                })
              }
            }
          })
        })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.imgUrls.map(it => it.url) // 需要预览的图片http链接列表
    })
  },
  deleteImage: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认删除图片？',
      success: function (res){
        if(res.confirm){
          ajax({
            loadingText: "正在删除...",
            url: app.globalData.host + '/Place/DeleteMaterial',
            method: "POST",
            data: {
              id: that.data.imgUrls[e.currentTarget.dataset.index].id
            },
            success: function (res) {
              if (res.data) {
                if (res.data.result == "Success") {
                  wx.showToast({
                    title: "删除成功",
                    icon: 'success',
                    mask: true
                  })
                  that.data.imgUrls.splice(e.currentTarget.dataset.index, 1)
                  that.setData({
                    imgUrls: that.data.imgUrls
                  })
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    mask: true
                  })
                }
              } else {
                wx.showToast({
                  title: '删除出错',
                  icon: 'none',
                  mask: true
                })
              }
            }
          })
        }
      }
    })
  }
})