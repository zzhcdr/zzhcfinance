// pages/login/login.js
var entity = require("../../entity.js");
var http = require("../../network/httpclient.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '欢迎登录',
    inputname:"",
    inputpassword:"",
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  login:function()
  {
    this.setData({
      inputname:"lvch",
      inputpassword: "880216"
    })
    if (this.data.inputname == "")
    {
      wx.showToast({
        title: "账号不能为空",
        duration: 2000,
        icon: "none"
      })
      return;
    }
        
    var params = {
      name: this.data.inputname,
      password: this.data.inputpassword
    }

    var httpClient = new http.HttpClient();

    httpClient.request( {
      requestUrl: httpClient.loginserv,
      method: httpClient.method_get,
      params: params,
      successFun:  function() {
        app.currUser = new entity.userentity();
        app.currUser.init(httpClient.responseData);
        var loginresult = app.currUser.getloginresult();
        if (loginresult == "") {
          wx.reLaunch({
            url: '../report/report',
          })
        } else {
          wx.showToast({
            title: loginresult,
          })
        }
      },
      failFun: function (res) {
        console.log(res);
      },
    } )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
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

  nameinput:function(e)
  {
    this.setData({
      inputname:e.detail.value
    })
  },

  passwordinput: function (e) {
    this.setData({
      inputpassword: e.detail.value
    })
  },
  bindGetUserInfo(e) {
    console.log("userInfo:"+e.detail.userInfo)
    console.log("rawData:" +e.detail.rawData)
    console.log("signature:" +e.detail.signature)
    console.log("encryptedData:" +e.detail.encryptedData)
    console.log("iv:" +e.detail.iv)
  }
})