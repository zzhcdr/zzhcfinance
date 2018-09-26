// pages/report/report.js
var entity = require("../../entity")
var util = require("../../utils/util.js")
import * as echarts from '../../ec-canvas/echarts.min';
var app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  addsubject: function () {
    wx.navigateTo({
      url: '../subject/subject_add',
    })
  },

  addaccount:function()
  {
      wx.navigateTo({
        url: '../account/account_add',
      })
  },

  addrecord:function()
  {
      wx.navigateTo({
        url: '../voucher/voucheradd',
      })
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
  echartInit(e) {
    initChart(e.detail.canvas, e.detail.width, e.detail.height);
  }

})