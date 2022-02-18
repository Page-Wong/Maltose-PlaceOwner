//index.js
//获取应用实例
const app = getApp()
var ajax = require('../../utils/ajax.js')

Page({
  data: {
    tips: '正在登录',
    userInfo: {},
    isReLogin: false,
    hasUserInfo: false,
    showAuthButton: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    redirectUrl: '',
    redirectType: 'page'
  },
  onLoad: function (e) {
    var that = this;
    if(e.action != null && e.type){
      this.data.redirectUrl = e.redirectUrl
      this.data.redirectType = e.type
    }
    else {
      this.data.redirectUrl = app.globalData.firstPage
      this.data.redirectType = app.globalData.firstPageType
    }
    setTimeout(function () {
      that.setData({
        tips: '请授权登录',
        showAuthButton: true
      })
    }, 1000);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.login()
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.login()
      }
    } else {
      this.setData({
        tips: '请升级微信'
      })
    }    
  },
  showReLogin: function(){
    wx.hideLoading()
    this.setData({
      isReLogin: true
    })
  },
  login: function () {
    this.setData({
      isReLogin: false
    })
    wx.showLoading({
      title: '正在登录',
      mask: true
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          this.directLogin(res.code)
        } else {
          wx.hideLoading()
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  directLogin: function (code) {
    var that = this;
    that.setData({
      tips: '正在登录....'
    })
    //发起登录网络请求
    wx.request({
      url: app.globalData.host + '/WxOpen/onDirectLogin',
      data: {
        code: code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success(res) {
        var cookie = res.header['Set-Cookie']
        wx.setStorageSync('Cookie', cookie)
        that.logon(res)
      },
      fail: function () {
        that.showReLogin()
        console.log('fail')
        wx.stopPullDownRefresh()
        wx.showModal({
          title: "提示",
          content: "网络异常",
          showCancel: false,
          confirmText: "确定",
          confirmColor: "#3CC51F",
        })
      },
      complete(){
        that.setData({
          tips: ''
        })
      }
    })
  },
  authLogin: function () {
    wx.hideLoading()
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.showLoading({
            title: '正在登录',
            mask: true
          })
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              ajax({
                url: app.globalData.host + '/WxOpen/onAuthLogin',
                method: 'POST',
                data: {
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                success: function (res) {
                  that.logon(res)
                }
              })              
            }
          })
        }
      }
    })    
  },
  logon: function (res) {
    //注册成功，跳转到下一页
    if (res.data.success) {
      app.globalData.hasLogin = true

      if (this.data.redirectType == 'tab'){
        wx.switchTab({
          url: this.data.redirectUrl
        })
      }
      else {
        wx.redirectTo({
          url: this.data.redirectUrl
        })
      }
    }
    //微信unionId获取失败，使用 getUserInfo 登录方法
    else if (res.data.msg == 'AuthorizationFailure') {
      this.authLogin()
    }
    //登录帐号无效，转到注册页
    else if (res.data.msg == 'InvalidUser') {
      wx.redirectTo({
        url: "../register/register",
      })
    }
    else {
      this.showReLogin()
      wx.showModal({
        title: "提示",
        content: "登录失败",
        showCancel: false,
        confirmText: "确定",
        confirmColor: "#3CC51F",
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.login()
  }
})
