// pages/report/report.js

var util = require("../../utils/util.js")
var dao = require("../../dao.js")
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    todaydate: '',
    subjects:[],
    vouchers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var today = new Date();
    this.setData({
      todaydate: util.formatDate(today)
    });
  },

  clearData : function()
  {
    var data = {
      todaydate: '',
      subjects: [],
      vouchers: []
    };
    this.setData(data);
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
    var that = this;
    var appdao = new dao.AppDao();
    appdao.querySubjectType({
      callFun:function()
      {
        that.setData({
          subjects: appdao.getSubjects()
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.clearData();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.clearData();
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



  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  datePickerChange: function (e) {
    this.setData({
      todaydate: e.detail.value
    });
  }

})