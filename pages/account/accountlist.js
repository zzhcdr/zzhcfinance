// pages/account/accountlist.js
var dao = require("../../dao.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accounts:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var appDao = new dao.AppDao();
    var subject = appDao.getSubject(options.id);
    this.setData({
      accounts: subject.capitalAccountsById
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

  jumpToDetail: function (event) {
    var data = event.currentTarget.dataset;
    var params = ""
    for (var prop in data) {
      var propdata = data[prop]
      params += "&" + prop + "=" + propdata
    }
    wx.navigateTo({
      url: 'account_detail?' + params,
    })
  },

})