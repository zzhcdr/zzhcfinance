
function HttpClient() 
{
  this.host = "http://127.0.0.1:8080";
  //this.host = "https://erp.zzhcdr.com";
  this.method_get = "GET";
  this.method_post = "POST";
  this.serverCode = 0;
  this.responseData = {},
  this.loginserv = "/loginserv"
}

HttpClient.prototype.request = function (metaData) 
{
  var util = require("../utils/util.js")
  var that = this;
  wx.showLoading({
    title: '数据请求中...',
    mask: true
  })
  if (metaData.params == undefined)
  {
    metaData.params = {};
  }
  wx.request({
    url: that.host + metaData.requestUrl,
    header: util.getheader(),
    data: metaData.params,
    method:metaData.method,
    success: function (res) {

      if (res && res.header && res.header['Set-Cookie']) {
        wx.setStorageSync('cookieKey', res.header['Set-Cookie']);//保存Cookie到Storage
      }
      var serverdata = res.data;
      that.serverCode = serverdata.servercode
      that.responseData = serverdata.data
      metaData.successFun();
    },
    fail: function (ex) {
      wx.showToast({
        title: '请求服务器失败',
      })
      metaData.failFun(ex);
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}

module.exports.HttpClient = HttpClient;