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
var addbusinessserv = "/addbusinessserv"
var getbusinesslistserv = "/getbusinesslistserv"
var getUserListServ = "/getuserlistserv"
var modifyBusinessServ = "/modifybusinessserv"
var removeBusinessServ = "/removebusinessserv"

function AppDao() {}

AppDao.prototype.clearData = function()
{
  this.setSubjectTypes();
  this.setVouchers();
  this.setBusiness();
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

AppDao.prototype.setBusiness = function (business) {
  if (typeof (business) == "undefined") {
    business = [];
  }
  app.globalData.business = business;
}

AppDao.prototype.getBusiness = function () {
  return app.globalData.business;
}

AppDao.prototype.getBusinessById = function(id)
{
  var businessList = this.getBusiness();
  var business = {};

  businessList.forEach(function(item){
    if(item.id == id)
    {
      business = item;
    }
  });
  return business;
}

AppDao.prototype.setUsers = function(users)
{
  if (typeof (users) == "undefined") {
    users = [];
  }
  app.globalData.users = users;
}

AppDao.prototype.getUsers = function()
{
  return app.globalData.users;
}

AppDao.prototype.getCurrUser = function()
{
  return app.globalData.currUser;
}

AppDao.prototype.getUsersForReader = function()
{
  var readerList = [];
  var userList = this.getUsers();
  userList.forEach(function (user) {
    if (user.uid != app.globalData.currUser.uid)
    {
      var reader = new entity.userentity();
      reader.uid = user.uid;
      reader.name = user.name;
      reader.checked = false;
      readerList.push(reader);
    }
  });
  return readerList;
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
      app.globalData.currUser = new entity.userentity();
      app.globalData.currUser.init(httpClient.responseData);
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
},

AppDao.prototype.addBusiness = function(params)
{
  var that = this;
  httpClient.request({
    requestUrl: addbusinessserv,
    method: httpClient.method_get,
    params: params.data,
    successFun: function () {
      params.callFun(httpClient.responseData);
      that.setBusiness();
    },
    failFun: function (res) {
      console.log(res);
    },
  })
},

AppDao.prototype.queryBusiness = function (params)
{
  var that = this;
  var getBusiness = this.getBusiness()
  if (getBusiness.length == 0) {
    httpClient.request({
      requestUrl: getbusinesslistserv,
      method: httpClient.method_get,
      successFun: function () {
        var businessList = []
        httpClient.responseData.forEach(function(businessData){
          var business = new entity.BusinessEntity();
          business.init(businessData)
          businessList.push(business);
        });
        that.setBusiness(businessList);
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
},

AppDao.prototype.modifyBusiness = function (params)
{
  var that = this;
  httpClient.request({
    requestUrl: modifyBusinessServ,
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

AppDao.prototype.queryUserList = function(params)
{
  var that = this;
  var getUsers = this.getUsers()
  if (getUsers.length == 0) {
    httpClient.request({
      requestUrl: getUserListServ,
      method: httpClient.method_get,
      successFun: function () {
        var usersList = []
        httpClient.responseData.forEach(function (userData) {
          var user = new entity.userentity();
          user.init(userData);
          usersList.push(user)
        });
        that.setUsers(usersList);
        params.callFun();
      },
      failFun: function (res) {
        console.log(res);
      },
    })
  } else {
    params.callFun();
  }
}

AppDao.prototype.RemoveBusiness = function(param)
{
  var that = this;
  httpClient.request({
    requestUrl: removeBusinessServ,
    method: httpClient.method_get,
    params: {
      id:param.id
    },
    successFun: function () {
      that.clearData();
      param.callFun();
    },
    failFun: function (res) {
      console.log(res);
    },
  })

}

module.exports.AppDao = AppDao;