var http = require("network/httpclient")
var entity = require("entity")
var httpClient = new http.HttpClient();

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

AppDao.prototype.setSubjectTypes = function(subjectTypes)
{
  wx.setStorageSync("subjectTypes", subjectTypes);
}

AppDao.prototype.getSubjectTypes = function () {
  return wx.getStorageSync("subjectTypes");
}

AppDao.prototype.getSubjects = function()
{
  var subjects = []
  var subjectTypes = this.getSubjectTypes();
  subjectTypes.forEach(function(typeData){
    subjects = subjects.concat(typeData.accountSubjectsById);
  })
  return subjects;
}

AppDao.prototype.setVouchers = function (vouchers) {
  wx.setStorageSync("vouchers", vouchers);
}

AppDao.prototype.getVouchers = function () {
  return wx.getStorageSync("vouchers");
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

AppDao.prototype.querySubjectType = function (params)
{
  var that = this;
  httpClient.request({
    requestUrl: getsubjecttypeserv,
    method: httpClient.method_get,
    params: {},
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
}

AppDao.prototype.querySubject = function (params) {
  this.querySubjectType(params);
}

AppDao.prototype.queryVoucher = function (params) {
  var that = this;
  if (params.accountid == undefined)
  {
    params.accountid = 0;
  }
  httpClient.request({
    requestUrl: getaccountvoucherserv,
    method: httpClient.method_get,
    params: {
      accountid: params.accountid
    },
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
}

AppDao.prototype.queryVoucherById = function (params) {
  var that = this;
  httpClient.request({
    requestUrl: getvoucherserv,
    method: httpClient.method_get,
    params: {
      id: params.id
    },
    successFun: function () {
      params.callFun(httpClient.responseData);
    },
    failFun: function (res) {
      console.log(res);
    },
  })
}

AppDao.prototype.addAccount = function (params) {
  var that = this;
  httpClient.request({
    requestUrl: addcapitalaccountserv,
    method: httpClient.method_get,
    params: params.data,
    successFun: function () {
      params.callFun(httpClient.responseData);
    },
    failFun: function (res) {
      console.log(res);
    },
  })
}

AppDao.prototype.modifyAccount = function(params)
{
  var that = this;
  httpClient.request({
    requestUrl: modifycapitalaccountserv,
    method: httpClient.method_get,
    params: params.data,
    successFun: function () {
      wx.showToast({
        title: '更新账户成功',
      })
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

module.exports.AppDao = AppDao;