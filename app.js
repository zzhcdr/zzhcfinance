//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  globalData: {
    appname:"小金库记账本",
    userInfo: null,
    currUser:{},
    subjects:[],
    //host: "http://127.0.0.1:8080"
    host: "https://erp.zzhcdr.com"
  },

  getvoucherlist:function()
  {
    var voucherlist = [];
    return voucherlist;
  },

  getrecordlist:function(accountid)
  {
      var recordlist = [];
      this.globalData.subjects.forEach(function(subject){
        subject.capitalAccountsById.forEach(function(account){
          account.capitalRecordsById.forEach(function(record){
            recordlist.push(record)
          })
        })
      })
      return recordlist;
  },

  getRecordByVoucher:function(voucherid)
  {
    var recordlist = [];
    this.globalData.subjects.forEach(function (subject) {
      subject.capitalAccountsById.forEach(function (account) {
        account.capitalRecordsById.forEach(function (record) {
          recordlist.push(record)
        })
      })
    })
    return recordlist;
  },

  getSubject:function(id)
  {
    var subject = {};
    this.globalData.subjects.forEach(function(item){
      if(item.id == id)
      {
        subject = item;
      }
    });
    return subject;
  }

})
