// pages/config/config.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  configsubject: function () {
    wx.navigateTo({
      url: '../subject/subjectlist',
    })
  },
  addsubject: function () {
    wx.navigateTo({
      url: '../subject/subjectadd',
    })
  },

  addaccount: function () {
    wx.navigateTo({
      url: '../account/account_add',
    })
  },

  addrecord: function () {
    wx.navigateTo({
      url: '../voucher/voucheradd',
    })
  },

  addBusiness:function()
  {
    wx.navigateTo({
      url: '../business/businessadd',
    })
  }

})