// pages/transaction/translist.js
var entity = require("../../entity.js")
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucherlist: [],
    curraccountid: 0
  },

  loadVouche: function () {
    var that = this;
    var curraccountid = app.globalData.curraccountid;
    wx.request({
      url: app.globalData.host + '/getaccountvoucherserv',
      data: {
        accountid: curraccountid
      },
      success: function (res) {
        var vouchers = [];
        var result = new entity.resultentity();
        result.init(res.data);
        result.data.forEach(function (voucherdata) {
          var voucher = new entity.voucherentity();
          voucher.init(voucherdata);
          vouchers.push(voucher);
        });
        that.setData(
          {
            voucherlist: vouchers,
            curraccountid: curraccountid
          }
        );
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      voucherlist: []
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
    this.loadVouche();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.toClearData();
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
    app.globalData.curraccountid = 0;
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
      curraccountid: 0
    })
  }


})