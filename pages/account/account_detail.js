// pages/voucher/voucherlist.js
var entity = require("../../entity.js")
var util = require("../../utils/util.js")
var app = getApp();
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
    accountinitbalance:0,
    accountbalance:0
  },

  loadVouche: function () {
    var that = this;
    wx.showLoading({
      title: '数据请求中...',
      mask:true
    })
    wx.request({
      url: app.globalData.host + '/getaccountvoucherserv',
      data: {
        accountid: that.data.accountid
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
            voucherlist: vouchers
          }
        );
      },
      complete:function()
      {
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var subjectid = options.subjectid;
    var selsubject = app.getSubject(subjectid);
    this.setData({
      subjects: app.globalData.subjects,
      selsubject: selsubject,
      voucherlist: [],
      accountsubjectid: subjectid,
      accountid:options.id,
      accountname:options.name,
      accountinitbalance: options.initbalance,
      accountbalance:options.balance
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
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("account.detail.onUnload")
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
    this.setData({
      accountinitbalance: e.detail.value
    });
  },

  onupdate: function () {
    var that = this;
    wx.showLoading({
      title: '更新账户信息中...',
      mask:true
    })
    wx.request({
      url: app.globalData.host + '/modifycapitalaccountserv',
      header: util.getheader(),
      data: {
        id: that.data.accountid,
        name: that.data.accountname,
        subjectid: that.data.selsubject.id,
        initbalance: that.data.accountinitbalance
      },
      success: function (res) {
        wx.showToast({
          title: '更新账户成功',
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '更新账户失败',
        })
      },
      complete:function()
      {
        wx.hideLoading();
      }
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
            wx.request({
              url: app.globalData.host + '/removecapitalaccountserv',
              header: util.getheader(),
              data: {
                id: that.data.accountid,
              },
              success: function (e) {
                wx.showToast({
                  title: '删除成功',
                  complete:function()
                  {
                    setTimeout(function () {
                      wx.navigateBack({});
                    }, 1000);
                  }
                })
              },
              fail: function (e) {
                wx.showToast({
                  title: '删除失败',
                })
              },
              complete:function()
              {
                wx.hideLoading();
              }
            })
          }
      }
    })
  },

})