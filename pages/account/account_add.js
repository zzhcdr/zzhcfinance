// pages/account/account_add.js
var util = require("../../utils/util.js")
var dao = require("../../dao.js")
var app = getApp();
var appDao = new dao.AppDao();
var subjectTypes = appDao.getSubjectTypes();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectMultiIndex: [0, 0],
    subjectMultiArray: [[]],
    selsubject:{},
    name: "",
    balance: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = {
      subjectMultiArray: [[]]
    };
    data.subjectMultiArray[0] = subjectTypes;
    data.subjectMultiArray[1] = subjectTypes[0].accountSubjectsById;
    data.selsubject = data.subjectMultiArray[1][0]
    this.setData(data);
    this.showSubject();
  },

  showSubject: function () {
    var data = {
      selsubject: {}
    }
    var typeIndex = this.data.subjectMultiIndex[0];
    var subjectIndex = this.data.subjectMultiIndex[1];
    data.selsubject = subjectTypes[typeIndex].accountSubjectsById[subjectIndex];
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

  bindSubjectChange: function (e) {
    var that = this;
    this.setData({
      subjectMultiIndex: e.detail.value
    })
    this.showSubject();
  },

  bindSubjectColumnChange: function (e) {
    var column = e.detail.column;
    var columnVal = e.detail.value;
    //console.log('修改的列为', column, '，值为', columnVal);
    var data = {
      subjectMultiIndex: this.data.subjectMultiIndex,
      subjectMultiArray: this.data.subjectMultiArray,
    };
    data.subjectMultiIndex[column] = columnVal;
    if (column == 0) {
      data.subjectMultiArray[1] = subjectTypes[data.subjectMultiIndex[0]].accountSubjectsById;
    }
    this.setData(data);
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