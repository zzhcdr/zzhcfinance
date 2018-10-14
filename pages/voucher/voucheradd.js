// pages/record/record_add.js
var util = require("../../utils/util.js")
var dao = require("../../dao.js")
var app = getApp();
var appDao = new dao.AppDao();
var subjectTypes = [];
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
    debitMultiIndex: [0,0,0],
    creditMultiIndex: [4,0,0],
    debitMultiArray: [[]],
    creditMultiArray: [[]],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var today = new Date();
    that.setData({
      date: util.formatDate(today)
    });
    appDao.querySubjectType({
      callFun: function () {
        subjectTypes = appDao.getSubjectTypes();
        var creditMultiIndex = that.data.creditMultiIndex;

        var data = {
          debitMultiArray: [[]],
          creditMultiArray: [[]],
        };

        data.debitMultiArray[0] = subjectTypes;
        data.debitMultiArray[1] = subjectTypes[0].accountSubjectsById;
        data.debitMultiArray[2] = subjectTypes[0].accountSubjectsById[0].capitalAccountsById;

        data.creditMultiArray[0] = subjectTypes;
        data.creditMultiArray[1] = subjectTypes[creditMultiIndex[0]].accountSubjectsById;
        data.creditMultiArray[2] = data.creditMultiArray[1][creditMultiIndex[1]].capitalAccountsById;

        that.setData(data);
        that.showDebitAccount();
        that.showCreditAccount();
      }
    });
    
  },

  showDebitAccount: function () {
    var data = {
      seldebitsubject: {},
      seldebitaccount: {}
    }
    var typeIndex = this.data.debitMultiIndex[0];
    var subjectIndex = this.data.debitMultiIndex[1];
    var accountIndex = this.data.debitMultiIndex[2];
    data.seldebitsubject = subjectTypes[typeIndex].accountSubjectsById[subjectIndex];
    data.seldebitaccount = data.seldebitsubject.capitalAccountsById[accountIndex];
    this.setData(data);
  },

  showCreditAccount: function () {
    var data = {
      selcreditsubject: {},
      selcreditaccount: {}
    }
    var typeIndex = this.data.creditMultiIndex[0];
    var subjectIndex = this.data.creditMultiIndex[1];
    var accountIndex = this.data.creditMultiIndex[2];

    data.selcreditsubject = subjectTypes[typeIndex].accountSubjectsById[subjectIndex];
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
    this.setData({
      debitMultiIndex: e.detail.value
    })
    this.showDebitAccount();
  },

  bindDebitMultiPickerColumnChange: function (e) {
    var column = e.detail.column;
    var columnVal = e.detail.value;
    var data = {
      debitMultiIndex: this.data.debitMultiIndex,
      debitMultiArray: this.data.debitMultiArray,
    };
    data.debitMultiIndex[column] = columnVal;
    switch(column)
    {
      case 0:
        data.debitMultiArray[1] = subjectTypes[data.debitMultiIndex[0]].accountSubjectsById;
        data.debitMultiArray[2] = data.debitMultiArray[1][data.debitMultiIndex[1]]._capitalAccountsById;
      break;
      case 1:
        data.debitMultiArray[2] = data.debitMultiArray[1][data.debitMultiIndex[1]]._capitalAccountsById;
      break;
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
    var column = e.detail.column;
    var columnVal = e.detail.value;
    //console.log('修改的列为', column, '，值为', columnVal);
    var data = {
      creditMultiIndex: this.data.creditMultiIndex,
      creditMultiArray: this.data.creditMultiArray
    };
    data.creditMultiIndex[column] = columnVal;

    switch (column) {
      case 0:
        data.creditMultiArray[1] = subjectTypes[data.creditMultiIndex[0]].accountSubjectsById;
        data.creditMultiArray[2] = data.creditMultiArray[1][data.creditMultiIndex[1]]._capitalAccountsById;
        break;
      case 1:
        data.creditMultiArray[2] = data.creditMultiArray[1][data.creditMultiIndex[1]]._capitalAccountsById;
        break;
    }
    this.setData(data);
  }

})