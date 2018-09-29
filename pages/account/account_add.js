// pages/account/account_add.js
var util = require("../../utils/util.js")
var dao = require("../../dao.js")
var app = getApp();
var appDao = new dao.AppDao();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjects: [],
    selsubject:{},
    name: "",
    balance: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var subjects = appDao.getSubjects();
    this.setData({
      subjects: subjects,
      selsubject: subjects[0]
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

  bindPickerChange: function (e) {
    var that = this;
    this.setData({
      selsubject: that.data.subjects[e.detail.value]
    })
  },

  nameinput: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  balanceinput: function (e) {
    this.setData({
      balance: e.detail.value
    });
  },

  add: function (e) {
    var that = this;
    if (that.data.name == "" ) {
      wx.showToast({
        title: "名称不能为空",
        duration: 2000,
        icon: "none"
      })
      return;
    }
    wx.showLoading({
      title: '正在请求服务器...',
      mask:true
    });

    appDao.addAccount({
      data:{
        subjectid: that.data.selsubject.id,
        txtName: that.data.name,
        initbalance: that.data.balance
      },
      callFun:function()
      {
        wx.showToast({
          title: "添加成功"
        })
        setTimeout(function () {
          wx.reLaunch({
            url: '../account/account',
          })
        }, 1000);
      }
    })
  },
})