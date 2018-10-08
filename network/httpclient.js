var util = require("../utils/util.js")

var isConnected = true;

function HttpClient() 
{
  this.host = "http://192.168.0.118:8080";
  //this.host = "https://erp.zzhcdr.com";
  this.method_get = "GET";
  this.method_post = "POST";
  this.serverCode = 0;
  this.responseData = {},
  this.getServerHeartServ = "/getserverheartserv"
}

HttpClient.prototype.testConnection = function()
{
  var dao = require("../dao.js")
  var appDao = new dao.AppDao();
  var that = this;
  wx.request({
    url: that.host + that.getServerHeartServ,
    data: {},
    method: that.method_get,
    success:function(){
      isConnected = true;
    },
    fail: function (ex) {
      isConnected = false;
      appDao.clearData();
    }
  })
}

HttpClient.prototype.request = function (metaData) 
{
  
  var that = this;
  if(!isConnected)
  {
    wx.showToast({
      title: '连接服务器失败',
    })
    
    return;
  }
  
  wx.showLoading({
    title: '数据请求中...',
    mask: true
  })
  if (typeof (metaData.params)  == "undefined")
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
      if(metaData.successFun)
      {
        metaData.successFun();
      }
      
    },
    fail: function (ex) {
      console.log(ex)
      wx.showToast({
        title: '请求服务器失败',
      })
      if (metaData.successFun)
      {
        metaData.failFun(ex);
      }
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}

module.exports.HttpClient = HttpClient;