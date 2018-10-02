// pages/subject/subjectlist.js
var util = require("../../utils/util.js")
var entity = require("../../entity.js")
var dao = require("../../dao.js")
var app = getApp();
var appDao = new dao.AppDao();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectTypes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    appDao.querySubject({
      all:"1",
      callFun:function()
      {
        that.setData({
          subjectTypes: wx.getStorageSync("subjectTypes")
        });
      }
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

  onStatusChange:function(e)
  {
    var subjectid = e.currentTarget.id;
    appDao.modifySubjectStatus({
      id: subjectid,
      callFun:function()
      {
        
        wx.showToast({
          title: '修改成功'
        })
      }
    })
  }
})