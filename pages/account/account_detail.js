// pages/voucher/voucherlist.js
var entity = require("../../entity.js")
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
    selsubject: {},
    voucherlist: [],
    accountsubjectid:0,
    accountid: 0,
    accountname:"",
    initBalanceVal:0,
    accountinitbalance:0,
    accountbalance:0
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.data.accountid = options.id;

    this.showAccount();    

  },

  showAccount:function()
  {
    var that = this
    appDao.querySubjectType({
      callFun:function()
      {
        var account = appDao.getAccount(that.data.accountid);
        var subjects = appDao.getSubjects();
        var subjectid = account.subjectid;
        var selsubject = appDao.getSubject(subjectid);

        that.setData({
          subjects: subjects,
          selsubject: selsubject,
          accountsubjectid: subjectid,
          accountid: account.id,
          accountname: account.name,
          accountinitbalance: account.initbalance,
          accountbalance: account.balance
        })
      }
    })
  },

  loadVouche: function () {
    var that = this;
    var id = that.data.accountid;
    appDao.queryVoucher(
      {
        accountid: id,
        callFun:function()
        {
          that.setData(
            {
              voucherlist: appDao.getVoucherByAccount(id)
            }
          )
        }
      }
    )

    
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
    this.loadVouche();
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
    this.toClearData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    wx.setNavigationBarTitle({
      title: '加载中...',
    })
    this.loadVouche();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    wx.setNavigationBarTitle({
      title: app.globalData.appname,
    })
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

  previewNetworkImage: function (e) {
    var pics = e.currentTarget.dataset.pics;
    if (pics.length > 0) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: pics  // 需要预览的图片http链接列表
      })
    }
  },

  toClearData: function () {
    this.setData({
      voucherlist: [],
      accountid: 0,
      accountname:"",
      accountbalance:0
    })
  },

  nameinput: function (e) {
    this.setData({
      accountname: e.detail.value
    });
  },

  bindSubjectChange: function (e) {
    var that = this;
    this.setData({
      selsubject: that.data.subjects[e.detail.value]
    })
  },

  initbalanceinput: function (e) {
    this.data.initBalanceVal = e.detail.value;
  },

  onupdate: function () {
    var that = this;
    var paramData = that.data;
    paramData.accountinitbalance = Number.parseInt(paramData.initBalanceVal);
    if (isNaN(paramData.accountinitbalance))
    {
      paramData.accountinitbalance = 0;
    }
    appDao.modifyAccount({
      data:{
        id: paramData.accountid,
        name: paramData.accountname,
        subjectid: paramData.selsubject.id,
        initbalance: paramData.accountinitbalance   
      },
      callFunc: that.showAccount
    })
  },

  ondelete: function (e) {
    var that = this;
    wx.showModal({
      title: '系统提醒',
      content: '是否删除账户',
      success: function (res) {
        if (res.confirm) {
            wx.showLoading({
              title: '删除中...',
              mask:true
            })
          appDao.removeAccount(that.data.accountid)
          }
      }
    })
  },

})