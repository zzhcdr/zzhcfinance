var util = require("utils/util.js")
var app = getApp();

function resultentity() {
  this.servercode = '';
  this.data = {};
}

resultentity.prototype.init = function (data) {
  for (var prop in data) {
    this[prop] = data[prop];
    //console.log("prop:" + prop + " - " + this[prop]);
  }
  //console.log(this.uname);
}

function userentity() {
  this.uid = 0;
  this.uname = '';
  this.upwd = 0;
  this.name = 0;
  this.ugroup = 0;
  this.upower = 0;
  this.removed = 0;
  this.logincode = 0;
  this.serverdate = {};
}

userentity.prototype.init = function (data) {
  for (var prop in data) {
    this[prop] = data[prop];
    //console.log("prop:" + prop + " - " + this[prop]);
  }
  //console.log(this.uname);
}

userentity.prototype.getloginresult = function () {
  var result = "";
  switch (this.logincode) {
    case 0:
      break;
    case 1:
      result = "用户不存在";
      break;
    case 2:
      result = "密码错误";
      break;
  }
  return result;
}

function subjectentity() {
  this.id = 0;
  this.name = '';
  this.debit = false;
  this.capitalAccountsById = [];
  this.balance = 0;
}

subjectentity.prototype.init = function (data)
{
  var that = this;
  this.capitalAccountsById = [];
  for (var prop in data) {
    //console.log("prop:" + prop + " - " + this[prop]);
    if (prop =="capitalAccountsById")
    {
      var accountsdata = data[prop];
      accountsdata.forEach(function (accountdata)
      {
        var account = new accountentity();
        account.init(accountdata)
        that.capitalAccountsById.push(account);
      })
    }else
    {
      this[prop] = data[prop];
    }
  }

  this.balance = this.getbalacne();
}

subjectentity.prototype.getbalacne = function () {
  var balance = 0;

  this.capitalAccountsById.forEach(function(account)
  {
    balance += account.getbalacne();
  });
  return balance;
}

function accountentity() {
  this.id = 0;
  this.name = '';
  this.subjectid = 0;
  this.initbalance = 0;
  this.capitalRecordsById = [];
  this.accountSubjectBySubjectid = {};
  this.balance = 0;
}

accountentity.prototype.init = function(data)
{
  var that = this;
  for (var prop in data) {
    var propdata = data[prop];
    //console.log("accountentity.init:"+prop + " - " + propdata);
    if (prop == "capitalRecordsById") {
      propdata.forEach(function (recorddata){
        var record = new recordentity();
        record.init(recorddata)
        //console.log("accountentity.init: name: "+that.name+" id:" +record.id+ " record.title:"+record.title + " - "+ record.money)
        that.capitalRecordsById.push(record);
      });
    } else if (prop == "accountSubjectBySubjectid")
    {
      var subject = new subjectentity();
      subject.init(propdata);
      this.accountSubjectBySubjectid = subject;
    }
    else
    {
      this[prop] = propdata;
    }
  }
  this.balance = this.getbalacne();
}

accountentity.prototype.getbalacne = function () {
  var balance = 0;
  this.capitalRecordsById.forEach(function(record){
    balance += record.money;
  });
  return balance;
}

function recordentity() {
  this.id = 0;
  this.voucherid = '';
  this.accountid = 0;
  this.isincome = false;
  this.title = "";
  this.money = 0;
  this.recorddate = {};
  this.accountVoucherByVoucherid = {};
  this.capitalAccountByAccountid = {};
  this.date = "";
}

recordentity.prototype.init = function(data)
{
  for(var prop in data)
  {
    this[prop] = data[prop];
  }
  this.date = this.getdate();
}

recordentity.prototype.getdate = function()
{
  var recordDate = new Date(this.recorddate);
  return util.formatDate(recordDate);
}

function voucherentity() {
  this.id = '';
  this.title = '';
  this.money = 0;
  this.createdate = {};
  this.attachment = '';
  this.capitalRecordsById = [];
  this.capitalAccountByDebitid = {};
  this.capitalAccountByCreditid = {};
  this.attachmentPics = [];
}

voucherentity.prototype.init = function(data)
{
  var that = this;
  for (var prop in data) {
    var propData = data[prop];
    //console.log("voucherentity.prototype.init:" + prop + " - " + propData)
    if (prop == "capitalRecordsById")
    {
      propData.forEach(function (recorddata) {
          var record = new recordentity();
          record.init(recorddata)
        that.capitalRecordsById.push(record);
      });
    } else if (prop == "capitalAccountByDebitid")
    {
      this.capitalAccountByDebitid = new accountentity();
      this.capitalAccountByDebitid.init(propData);
    } else if (prop == "capitalAccountByCreditid")
    {
      this.capitalAccountByCreditid = new accountentity();
      this.capitalAccountByCreditid.init(propData);
    } else if (prop == "attachment")
    {
      propData = propData == null?"":propData;
      this.attachment = propData;
      if (propData != "")
      {
        if (propData.indexOf(",") == -1) {
          this.attachmentPics.push(propData);
        }else
        {
          this.attachmentPics = propData.split(",");
        }
      }
    }
    else
    {
      this[prop] = propData;
    }
  }
    var fileList = [];
    this.attachmentPics.forEach(function (item) {
      fileList.push(app.globalData.host + "/voucher/" + that.id + '/' + item);
    })
    this.attachmentPics = fileList;
}


module.exports.resultentity = resultentity;
module.exports.userentity = userentity;
module.exports.subjectentity = subjectentity
module.exports.accountentity = accountentity
module.exports.recordentity = recordentity
module.exports.voucherentity = voucherentity