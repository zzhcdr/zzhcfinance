// pages/record/record_add.js
var util = require("../../utils/util.js")
var dao = require("../../dao.js")
var app = getApp();
var appDao = new dao.AppDao();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seldebitsubject:{},
    seldebitaccount: {},
    selcreditsubject: {},
    selcreditaccount: {},
    name:"",
    balance: 0,
    date:'',
    debitMultiIndex: [0, 0],
    creditMultiIndex: [4, 0],
    objectMultiArray: [[]],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onShow();
  },

  showDebitAccount: function () {
    var subjects = appDao.getSubjects();
    var data = {
      seldebitsubject: {},
      seldebitaccount: {}
    }
    var subjectIndex = this.data.debitMultiIndex[0];
    var accountIndex = this.data.debitMultiIndex[1];
    data.seldebitsubject = subjects[subjectIndex];
    data.seldebitaccount = data.seldebitsubject.capitalAccountsById[accountIndex];
    this.setData(data);
  },

  showCreditAccount: function () {
    var subjects = appDao.getSubjects();
    var data = {
      selcreditsubject: {},
      selcreditaccount: {}
    }
    var subjectIndex = this.data.creditMultiIndex[0];
    var accountIndex = this.data.creditMultiIndex[1];
    data.selcreditsubject = subjects[subjectIndex];
    data.selcreditaccount = data.selcreditsubject.capitalAccountsById[accountIndex];
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
    appDao.querySubjectType({
      callFun: function () {
        var subjects = appDao.getSubjects();
        var today = new Date();
        that.setData({
          date: util.formatDate(today)
        });
        var data = {
          objectMultiArray: [[]]
        };
        data.objectMultiArray[0] = subjects;
        data.objectMultiArray[1] = subjects[0].capitalAccountsById;
        that.setData(data);
        that.showDebitAccount();
        that.showCreditAccount();
      }
    })
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

  datePickerChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },

  add:function(e)
  {
    var that = this;
    if(that.data.name == "" || that.data.balance == "")
    {
      wx.showToast({
        title: '名称或金额不能为空',
      })
      return;
    }
    wx.showLoading({
      title: '正在请求服务器...',
      mask:true
    });

    appDao.addRecord({
      data:{
        debitid: that.data.seldebitaccount.id,
        creditid: that.data.selcreditaccount.id,
        txtName: that.data.name,
        txtAmount: that.data.balance,
        txtDate: that.data.date,
      },
      callFun:function()
      {
        wx.showToast({
          title: '添加记录成功',
          icon: 'success'
        });
        setTimeout(function () {
          wx.navigateBack();
        }, 1000);
      }
    })
  },

  bindDebitMultiPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      debitMultiIndex: e.detail.value
    })
    this.showDebitAccount();
  },

  bindDebitMultiPickerColumnChange: function (e) {
    var subjects = appDao.getSubjects();
    var column = e.detail.column;
    var columnVal = e.detail.value;
    //console.log('修改的列为', column, '，值为', columnVal);
    var data = {
      debitMultiIndex: this.data.debitMultiIndex,
      objectMultiArray: this.data.objectMultiArray,
    };
    data.debitMultiIndex[column] = columnVal;
    if (column == 0) {
      data.objectMultiArray[1] = subjects[data.debitMultiIndex[0]].capitalAccountsById;
    }
    this.setData(data);
  },

  bindCreditMultiPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      creditMultiIndex: e.detail.value
    })
    this.showCreditAccount();
  },

  bindCreditMultiPickerColumnChange: function (e) {
    var subjects = appDao.getSubjects();
    var column = e.detail.column;
    var columnVal = e.detail.value;
    //console.log('修改的列为', column, '，值为', columnVal);
    var data = {
      creditMultiIndex: this.data.creditMultiIndex,
      objectMultiArray: this.data.objectMultiArray
    };
    data.creditMultiIndex[column] = columnVal;
    if (column == 0)
    {
      data.objectMultiArray[1] = subjects[data.creditMultiIndex[0]].capitalAccountsById;
    }
    this.setData(data);
  }

})