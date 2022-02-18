
const app = getApp()

function ajax(config) {
  wx.showLoading({
    title: config.loadingText ? config.loadingText : '加载中...',
    mask: true
  })
  var defaultConfig = {
    method: "GET",
    fail: function () {
      console.log('fail')
      //wx.hideToast()
      wx.stopPullDownRefresh()
      wx.showModal({
        title: "提示",
        content: "网络异常",
        showCancel: false,
        confirmText: "确定",
        confirmColor: "#3CC51F",
      })
    },
    complete: function (e) {
      wx.hideLoading()
      if (e.header['Cache-Control'] == "no-cache, no-store"){
        wx.showLoading({
          title: '连接超时，重新登录',
        }) 
        setTimeout(function () {
          wx.navigateTo({
            url: "/pages/login/login"
          })  
        }, 1000)  
      }
    }
  }
  defaultConfig.header = {}
  if (config.method == 'POST') {
    defaultConfig.header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }

  var cookie = wx.getStorageSync('Cookie')
  if (cookie != null){
    //cookie = '.AspNet.ApplicationCookie=' + cookie
    defaultConfig.header['Cookie'] = cookie
  }

  let _config = Object.assign(defaultConfig, config)
  wx.request(_config)
}

module.exports = ajax