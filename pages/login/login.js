// pages/login/login.js
var entity = require("../../entity.js");
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
    var that = this;
    
    that.setData({
      inputname:"lvch",
      inputpassword: "880216"
    })
    
    if (that.data.inputname == "")
    {
      wx.showToast({
        title: "账号不能为空",
        duration: 2000,
        icon: "none"
      })
      return;
    }
    
    wx.showLoading({
      title: '登录中...',
    });
   
      wx.request({
        url: app.globalData.host+ '/loginserv',
        data:{
          name: that.data.inputname,
          password: that.data.inputpassword
        },
        method:'GET',
        success:function(res)
        {
          wx.hideLoading();
          if (res && res.header && res.header['Set-Cookie']) {
            wx.setStorageSync('cookieKey', res.header['Set-Cookie']);//保存Cookie到Storage
          }
          var serverdata = res.data;
          var result = new entity.resultentity();
          result.init(serverdata)
          app.currUser = new entity.userentity();
          app.currUser.init(result.data);
          var loginresult = app.currUser.getloginresult();
          if (loginresult == "")
          {
            wx.reLaunch({
              url: '../report/report',
            })
          } else 
          {
            wx.showToast({
              title: loginresult,
              icon:"none"
            })
          }
        },
        fail:function(res)
        {
          wx.hideLoading();
          console.log(res);
        }
      })
  }
  ,

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