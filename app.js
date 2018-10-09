//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var http = require("network/httpclient")
    var httpClient = new http.HttpClient(); 
    setInterval(function(){
      httpClient.testConnection();
    },5000);
  },

  globalData: {
    appname:"小金库记账本",
    currUser:{},
    subjectTypes:[],
    vouchers:[],
    business:[]
  },
})
