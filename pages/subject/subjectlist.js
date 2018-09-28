// pages/subject/subjectlist.js
var util = require("../../utils/util.js")
var entity = require("../../entity.js")
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjects: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '获取数据中...',
    })
    wx.request({
      url: app.globalData.host + '/getaccountsubjectserv',
      method: 'GET',
      header: util.getheader(),
      success: function (res) {
        var result = new entity.resultentity();
        result.init(res.data)
        var serverdata = result.data;
        app.globalData.subjects = [];
        for (var prop in serverdata) {
          var subjectdata = serverdata[prop];
          var subject = new entity.subjectentity();
          subject.init(subjectdata);
          app.globalData.subjects.push(subject);
        }
        that.setData({
          subjects: app.globalData.subjects
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        wx.hideLoading();
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
    wx.showLoading({
      title: '正在修改中...',
      mask:true
    })
    wx.request({
      url: app.globalData.host + '/modifysubjectstatusserv',
      header: util.getheader(),
      data:{
        id: subjectid
      },
      method:"GET",
      success:function()
      {
        var subject = app.getSubject(subjectid);
        subject.isopen = !subject.isopen;
        wx.showToast({
          title: '修改成功',
        })
      },
      fail:function()
      {
        wx.showToast({
          title: '修改失败',
        })
      },
      complete:function()
      {
          wx.hideLoading();
      }
    })

  }
})