// pages/register/register.js
import Toast from '../../miniprogram_npm/vant-weapp/toast/index';

const app = getApp()
var ajax = require('../../utils/ajax.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    resendInterval: -1,
    sendSmsBtnText: "获取验证码",
    sendSmsBtnDisable: true,
    isAgree: false,
    smscode: "",
    username: "",
    password: "",
    confirmpassword: "",
    mobilenumber: "",
    userInfo: {},
    agreementText: "<p><strong>《注册用户协议》</strong></p>" +
    "<p> 共享广告平台为东莞泷晟信息科技有限公司（以下简称“泷晟信科”）提供的互联网共享广告平台。用户在使用该平台前，需完成注册。请您务必审慎阅读，充分理解以下注册协议中所列条款。若您成功注册，则视为您已了解并完全同意本协议各项内容。</p>" +
      "<p><strong>一．定义</strong></p>" +
      "<p>	1.1 共享广告平台：指用以投放广告和播放广告的共享平台。共享广告平台提供的服务统称为“共享广告服务”。</p>" +
      "<p>	1.2 广告主：指需要通过播放广告的形式向大众宣传、推广产品、服务的用户。</p>" +
      "<p>	1.3 场所主：指通过提供场地，用以放置播放广告的设备，并按照广告订单要求播放广告的用户。</p>" +
      "<p>	1.4 广告素材：指广告主提供的，自行设计制作或依法委托他人设计制作的，用于展示自由品牌或其生产销售的产品、服务的信息内容，包括但不限于图片，视频等。</p>" +
      "<p>	1.5 场所主推广素材：指场所主提供，用于宣传场所自身的素材，包括但不限于图片，视频等。</p>" +
      "<p>	1.6 广告费：指广告主在共享广告平台投放广告所产生的费用。广告费的结算方式以共享广告平台规则为准。</p>" +
      "<p>	1.7 法律法规：指中华人民共和国（包括港澳台地区）客户所在地及广告素材实际投放或展示的国家、地区的相关法律、法规、部门规章及行业规范等。</p>" +
      "<p><strong>二．服务条款</strong></p>" +
      "<p>	2.1 本协议的条款可由泷晟信科根据实际情况进行调整、修订，修改后的协议会实时在共享广告平台进行更新。修改后的协议在发布后即代替原有协议。</p>" +
      "<p>	2.2 已注册用户亦受到修改后协议约束。</p>" +
      "<p><strong>三．用户的权利和义务</strong></p>" +
      "<p>	3.1 用户需提供真实、合法、有效的身份证明文件。包括但不限于个人身份证，企业营业执照，电话号码，邮箱等。在上述信息发生变更时，您应及时通知泷晟信科。</p>" +
      "<p>	3.2 用户应妥善保管个人账号、密码。</p>" +
      "<p>	（1）在发现非自身原因导致的账号异常时，应及时联系泷晟信科处理；</p>" +
      "<p>	（2） 如因用户自身未妥善保管账号密码而产生的任何损失或损害，泷晟信科不承担任何责任；</p>" +
      "<p>	（3）用户不得将账号转让、出售或出借给他人使用。</p>" +
      "<p>	3.3 广告主提供的广告素材需符合《中华人民共和国广告法》等相关法律法规的规定。</p>" +
      "<p>	3.4 用户应当维护互联网秩序和安全，不得实施任何危害网络安全或损害他人权益的行为。</p>" +
      "<p><strong>四．共享广告平台的权利和义务</strong></p>" +
      "<p>	4.1 泷晟信科为共享广告平台用户提供技术支持，并负责共享广告平台的运营、维护。</p>" +
      "<p>	4.2 泷晟信科将采取合理的方式保护用户个人资料的安全。我们将使用必要的可以获得的安全技术和程序来保护您的个人资料不被未经授权的访问、使用或泄漏。</p>" +
      "<p>	4.3 泷晟信科有权对广告主提交的广告素材进行审核并根据法律法规决定是否允许投放播放。泷晟信科并不对审核通过的广告素材的合法性、真实性做确认和担保。</p>" +
      "<p><strong>五．费用和发票</strong></p>" +
      "<p>	5.1 广告费计算</p>" +
      "<p>	（1）广告费以人民币计算。</p>" +
      "<p>	（2）广告费的具体计算标准以共享广告平台规则为准。</p>" +
      "<p>	5.2 发票</p>" +
      "<p>	（1）交易完成后，泷晟信科会向您开具发票。</p>" +
      "<p>	（2）请您提供开具发票所需资料，包括发票抬头名称，交易记录金额等。</p>" +
      "<p><strong>六．不可抗力及免责</strong></p>" +
      "<p>	6.1 因受到不可抗力影响而不能履行或完全履行本协议的一方无需承担违约责任。</p>" +
      "<p>	6.2 出现下列情况时，泷晟信科可能会暂时中止、中断或终止对用户的服务：</p>" +
      "<p>	（1）服务器不稳定或遭受到恶意的网络攻击；</p>" +
      "<p>	（2）共享广告平台所需设备需进行维护升级；</p>" +
      "<p>	（3）因法律、法规、政策调整或政府管制而造成的暂时性服务调整。</p>" +
      "<p><strong>七．法律适用及争议解决</strong></p>" +
      "<p>	7.1 本协议的签订地为中华人民共和国广东省东莞市。</p>" +
      "<p>	7.2 本协议的订立、履行、变更、终止、解除等一切问题均适用中华人民共和国法律。</p>" +
      "<p>	7.3 发生纠纷时，协议签订双方应友好协商；协商不成的，可以通过诉讼方式解决冲突。</p>"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateSmsBtn(wx.getStorageSync("register_sms_delay"))
    this.setData({
      userInfo: app.globalData.userInfo
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
  tapAgreement(e) {
    this.setData({ hideAgreement:false })
  },
  onAgreementClose() {
    this.setData({ hideAgreement: true })
  },
  formReset(e){
    this.setData({
      username: "",
      password: "",
      mobilenumber: "",
      confirmpassword: ""
    })
  },
  formSubmit(e) {
    var that = this
    if (!e.detail.value.mobilenumber) {
      Toast.fail('请授权获取手机号')
    }
    else if (!e.detail.value.username) {
      Toast.fail('请输入用户名')
    }
    else if (!e.detail.value.password) {
      Toast.fail('请输入密码')
    }
    else if (!e.detail.value.confirmpassword) {
      Toast.fail('请输入确认密码')
    }
    else if (e.detail.value.password != e.detail.value.confirmpassword) {
      Toast.fail('密码与确认密码不一致')
    }
    else if (!this.data.isAgree){
      wx.showModal({
        title: '提示',
        content: '请阅读并接受《注册用户服务协议》',
        showCancel: false
      })
    }
    else{
      ajax({
        url: app.globalData.host + '/Account/WxRegister',
        method: 'POST',
        data: {
          mobilenumber: e.detail.value.mobilenumber,
          username: e.detail.value.username,
          password: e.detail.value.password,
          confirmpassword: e.detail.value.confirmpassword,
          smscode: e.detail.value.smscode,
          RegisterType: app.globalData.role
        },
        success: function (res) {
          if (res.data.success) {
            that.updateSmsBtn(0)
            wx.redirectTo({
              url: '../login/login'
            })
          }
          else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
        }
      })
    }

    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  getPhoneNumber(e) {
    let that = this
    if (e.detail.encryptedData && e.detail.iv) {
      ajax({
        url: app.globalData.host + '/WxOpen/getPhoneNumber',
        method: 'GET',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success: function (res) {
          if (res.data.success) {
            that.setData({ phone: res.data.data })
            if (that.data.username == '') {
              that.setData({ username: res.data.data })
            }
          }
          else {
            Toast.fail(res.data.msg)
          }
        }
      }) 
    } else {
      Toast.fail('手机号获取失败')
    }
  },

  sendSmsCodeTap: function () {
    var that = this
    var count = 60
    that.updateSmsBtn(count)
    ajax({
      url: app.globalData.host + "/Account/SendSmsCode",
      method: "POST",
      data: {
        _t: new Date().getTime(),
        phoneNumber: that.data.mobilenumber
      },
      success: function (res) {
        if (res.data.result == 'Success') {
          wx.showModal({
            title: "提示",
            content: "验证码已发送，请留意短信！",
            showCancel: false
          })
        }
        else {
          wx.showModal({
            title: "提示",
            content: res.data.message,
            showCancel: false
          })
          that.updateSmsBtn(0)
        }
      }
    })
  },

  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },

  mobileNumberInput: function(e){
    this.setData({
      mobilenumber: e.detail.value
    })
  },

  updateSmsBtn: function (count){
    var that = this
    var defaultText = "获取验证码"
    if (count){
      that.data.resendInterval = setInterval(function () {
        count--;
        if (count > 0) {
          that.setData({
            sendSmsBtnText: "重新发送(" + count + ")",
            sendSmsBtnDisable: true,
          })
          wx.setStorageSync("register_sms_delay", count)
        } else {
          wx.setStorageSync("register_sms_delay", 0)
          clearInterval(that.data.resendInterval);
          that.setData({
            sendSmsBtnText: defaultText,
            sendSmsBtnDisable: false,
          })
        }
      }, 1000);
    } else {
      wx.setStorageSync("register_sms_delay", 0)
      clearInterval(that.data.resendInterval);
      that.setData({
        sendSmsBtnText: defaultText,
        sendSmsBtnDisable: false,
      })
    }
  }
})