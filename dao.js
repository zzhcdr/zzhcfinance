var http = require("network/httpclient")
var entity = require("entity")
var httpClient = new http.HttpClient();
var app = getApp();

var loginserv = "/loginserv"
var getsubjecttypeserv = "/getsubjecttypeserv"
var getaccountvoucherserv = "/getaccountvoucherserv"
var getvoucherserv = "/getvoucherserv"
var addcapitalaccountserv = "/addcapitalaccountserv"
var removecapitalaccountserv = "/removecapitalaccountserv"
var modifycapitalaccountserv = "/modifycapitalaccountserv"
var addcapitalrecordserv = "/addcapitalrecordserv"
var removevoucherserv = "/removevoucherserv"
var modifyvoucherserv = "/modifyvoucherserv"
var deletevoucherattachmentserv = "/deletevoucherattachmentserv"
var modifysubjectstatusserv = "/modifysubjectstatusserv"


function AppDao() {}

AppDao.prototype.clearData = function()
{
  this.setSubjectTypes();
  this.setVouchers();
}

AppDao.prototype.setSubjectTypes = function(subjectTypes)
{
  if (typeof (subjectTypes)  == "undefined")
  {
    subjectTypes = [];
  }
  app.globalData.subjectTypes = subjectTypes;
}

AppDao.prototype.getSubjectTypes = function () {
  app.globalData.subjectTypes.forEach(function(subjectType){
    subjectType.refresh();
  });
  return app.globalData.subjectTypes;
}

AppDao.prototype.setVouchers = function (vouchers) {
  if (typeof(vouchers) == "undefined") {
    vouchers = [];
  }
  app.globalData.vouchers = vouchers;
}

AppDao.prototype.getVouchers = function () {
  return app.globalData.vouchers;
}

AppDao.prototype.getSubjects = function(onlyOpened)
{
  var subjects = []
  var subjectTypes = this.getSubjectTypes();
  subjectTypes.forEach(function(typeData){
    typeData.accountSubjectsById.forEach(function(subject)
    {
      var isAdd = typeof (onlyOpened) == undefined ? true : subject.isopen;
      if(isAdd)
      {
        subjects.push(subject);
      }
    })
  })
  return subjects;
}

AppDao.prototype.getSubject = function (id) {
  var subjects = this.getSubjects();
  var subject = {};
  subjects.forEach(function (item) {
    if (item.id == id) {
      subject = item;
    }
  });
  return subject;
}

AppDao.prototype.getAccount = function(id)
{
  var subjects = this.getSubjects();
  var account = {};
  subjects.forEach(function(subject){
    subject.capitalAccountsById.forEach(function (item) {
      if (item.id == id) {
        account = item;
      }
    });
  })
  return account;
}

AppDao.prototype.getrecordlist = function (accountid) {
  var subjects = this.getSubjects();
  var recordlist = [];
  subjects.forEach(function (subject) {
    subject.capitalAccountsById.forEach(function (account) {
      account.capitalRecordsById.forEach(function (record) {
        recordlist.push(record)
      })
    })
  })
  return recordlist;
}

AppDao.prototype.getRecordByVoucher = function (voucherid) {
  var recordlist = [];
  var subjects = this.getSubjects();
  subjects.forEach(function (subject) {
    subject.capitalAccountsById.forEach(function (account) {
      account.capitalRecordsById.forEach(function (record) {
        recordlist.push(record)
      })
    })
  })
  return recordlist;
}

AppDao.prototype.getVoucherByAccount = function(accountid)
{
  var voucherList = [];
  var vouchers = this.getVouchers();
  vouchers.forEach(function(voucher){
    if (voucher.capitalAccountByDebitid.id == accountid || voucher.capitalAccountByCreditid.id == accountid)
    {
      voucherList.push(voucher);
    }
  });
  return voucherList;
}

AppDao.prototype.getVoucherById = function (id) {
  var that = this;
  var voucher = {}
  var vouchers = this.getVouchers();
  vouchers.forEach(function (item) {
    if(item.id == id)
    {
      voucher = item;
    }
  });
  return voucher;
}

AppDao.prototype.login = function(params)
{
  httpClient.request({
    requestUrl: loginserv,
    method: httpClient.method_get,
    params: params.data,
    successFun: function () {
      params.callFun();
    },
    failFun: function (res) {
      console.log(res);
    },
  })
}

AppDao.prototype.querySubjectType = function (params)
{
  var that = this;
  var subjectTypes = this.getSubjectTypes()
  if (subjectTypes.length == 0)
  {
    httpClient.request({
      requestUrl: getsubjecttypeserv,
      method: httpClient.method_get,
      successFun: function () {
        var serverdata = httpClient.responseData;
        var subjectTypes = [];
        serverdata.forEach(function (typeData) {
          var subjectType = new entity.SubjectTypeEntity();
          subjectType.init(typeData);
          subjectTypes.push(subjectType);
        })
        that.setSubjectTypes(subjectTypes);
        params.callFun();
      },
      failFun: function (res) {
        console.log(res);
      },
    })
  }else
  {
    params.callFun();
  }
}

AppDao.prototype.queryVoucher = function (params) {
  var that = this;
  var vouchers = this.getVouchers();
  if(vouchers.length == 0)
  {
    httpClient.request({
      requestUrl: getaccountvoucherserv,
      method: httpClient.method_get,
      successFun: function () {
        var serverdata = httpClient.responseData;
        var vouchers = [];
        serverdata.forEach(function (voucherdata) {
          var voucher = new entity.voucherentity();
          voucher.init(voucherdata);
          vouchers.push(voucher);
        });
        that.setVouchers(vouchers);
        params.callFun();
      },
      failFun: function (res) {
        console.log(res);
      },
    })
  }else
  {
    params.callFun();
  }
}

AppDao.prototype.addAccount = function (params) {
  var that = this;
  httpClient.request({
    requestUrl: addcapitalaccountserv,
    method: httpClient.method_get,
    params: params.data,
    successFun: function () {
      that.clearData();
      params.callFun(httpClient.responseData);
    },
    failFun: function (res) {
      console.log(res);
    },
  })
}

AppDao.prototype.modifyAccount = function(param)
{
  var paramData = param.data;
  var that = this;
  httpClient.request({
    requestUrl: modifycapitalaccountserv,
    method: httpClient.method_get,
    params: paramData,
    successFun: function () {
      var account = that.getAccount(paramData.id);
      account.name = paramData.name;
      account.subjectid = paramData.subjectid;
      account.initbalance = paramData.initbalance;
      wx.showToast({
        title: '更新账户成功',
      })
    param.callFunc();
    },
    failFun: function (res) {
      wx.showToast({
        title: '更新账户失败',
      })
    },
  })
}

AppDao.prototype.removeAccount = function (accountid) {
  var that = this;
  httpClient.request({
    requestUrl: removecapitalaccountserv,
    method: httpClient.method_get,
    params: {
      id: accountid
    },
    successFun: function () {
      that.clearData();
      wx.showToast({
        title: '删除成功',
        complete: function () {
          setTimeout(function () {
            wx.navigateBack({});
          }, 1000);
        }
      })
    },
    failFun: function (res) {
      wx.showToast({
        title: '删除账户失败',
      })
    },
  })
}

AppDao.prototype.addRecord = function (params) {
  var that = this;
  httpClient.request({
    requestUrl: addcapitalrecordserv,
    method: httpClient.method_get,
    params:params.data,
    successFun: function () {
      that.clearData();
      params.callFun();
    },
    failFun: function (res) {
      console.log(res);
    },
  })
}

AppDao.prototype.removeVoucher = function (params) {
  var that = this;
  httpClient.request({
    requestUrl: removevoucherserv,
    method: httpClient.method_get,
    params: {
      id: params.id
    },
    successFun: function () {
      that.clearData();
      params.callFun();
    },
    failFun: function (res) {
      console.log(res);
    },
  })
}

AppDao.prototype.modifyVoucher = function (params) {
  var that = this;
  httpClient.request({
    requestUrl: modifyvoucherserv,
    method: httpClient.method_get,
    params: params.data,
    successFun: function () {
      that.clearData();
      params.callFun();
    },
    failFun: function (res) {
      console.log(res);
    },
  })
}

AppDao.prototype.deleteVoucherAttachment = function (params)
{
  var that = this;
  httpClient.request({
    requestUrl: deletevoucherattachmentserv,
    method: httpClient.method_get,
    params: params.data,
    successFun: function () {
      that.clearData();
      params.callFun();
    },
    failFun: function (res) {
      console.log(res);
    },
  })
}

AppDao.prototype.modifySubjectStatus = function(params)
{
  var that = this;
  httpClient.request({
    requestUrl: modifysubjectstatusserv,
    method: httpClient.method_get,
    params: {
      id: params.id
    },
    successFun: function () {
      var subject = that.getSubject(params.id);
      subject.isopen = !subject.isopen;
      params.callFun();
    },
    failFun: function (res) {
      console.log(res);
    },
  })
}

AppDao.prototype.getServerHeartServ = function()
{
  var that = this;
  httpClient.request({
    requestUrl: getServerHeartServ,
    method: httpClient.method_get,
    failFun: function (res) {
      that.clearData();
    },
  })
}

module.exports.AppDao = AppDao;