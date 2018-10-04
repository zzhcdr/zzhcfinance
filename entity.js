var util = require("utils/util.js")
var http = require("network/httpclient.js")

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

function SubjectTypeEntity() {
  this.id = 0;
  this.name = '';
  this.accountSubjectsById = [];
  this._balance = 0;
}

SubjectTypeEntity.prototype = {
  set balance(val) {
    this._balance = val;
   },
  get balance()
  {
    var balance = 0;
    this.accountSubjectsById.forEach(function (subject) {
      balance += subject.balance;
    });
    this._balance = balance;
    return this._balance;
  }
}

SubjectTypeEntity.prototype.compare = function(itemA,itemB)
{
  if(itemA.id > itemB.id)
  {
    return 1;
  } else if (itemA.id < itemB.id)
  {
    return -1;
  }else
  {
    return 0;
  }
}

SubjectTypeEntity.prototype.init = function (data) {
  var that  = this;
  this.accountSubjectsById = [];
  for(var prop in data)
  {
    var propData = data[prop];
    if (prop == "accountSubjectsById")
    {
      propData.forEach(function(subjectData){
        var subject = new subjectentity();
        subject.init(subjectData)
        that.accountSubjectsById.push(subject);
      })
    }else
    {
      this[prop] = propData;
    }
  }
  this.accountSubjectsById.sort(this.compare);
}

function subjectentity() {
  this.id = 0;
  this.name = '';
  this.debit = false;
  this.isopen = true;
  this.capitalAccountsById = [];
  this.totalBalance = 0;
}

subjectentity.prototype = {
  set balance(val)
  {
    //this._balance = val;
  },
  get balance()
  {
    var balance = 0;
    this.capitalAccountsById.forEach(function (account) {
      balance += account.getbalacne();
    });
    this.totalBalance = balance;
    return this.totalBalance;
  }
}

subjectentity.prototype.init = function (data)
{
  var that = this;
  this.capitalAccountsById = [];
  for (var prop in data) {
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
}

function accountentity() {
  this.id = 0;
  this.name = '';
  this.subjectid = 0;
  this._capitalRecordsById = [];
  this.accountSubjectBySubjectid = {};
  this._initbalance = 0;
  this.balance = 0;
}

accountentity.prototype = {
  calculateBalance: function () {
    var balance = 0;
    this.capitalRecordsById.forEach(function (record) {
      balance += record.money;
    });
    this.balance = balance + this._initbalance;
  },
  set initbalance(val) {
    this._initbalance = val;
    this.calculateBalance();
  },
  get initbalance() {
    return this._initbalance;
  },

  set capitalRecordsById(val) {
    var that = this;
    val.forEach(function (recorddata) {
      var record = new recordentity();
      record.init(recorddata)
      that._capitalRecordsById.push(record);
    });

    this.calculateBalance();
  },
  get capitalRecordsById() {
    return this._capitalRecordsById;
  },

  init:function(data)
  {
    var that = this;
    for (var prop in data) {
      var propdata = data[prop];
      if (prop == "accountSubjectBySubjectid") {
        var subject = new subjectentity();
        subject.init(propdata);
        this.accountSubjectBySubjectid = subject;
      }
      else {
        this[prop] = propdata;
      }
    }
  }
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
  this.isreimbursed = true;
}

voucherentity.prototype.init = function(data)
{
  var that = this;
  var httpClient = new http.HttpClient();
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
      fileList.push(httpClient.host + "/voucher/" + that.id + '/' + item);
    })
    this.attachmentPics = fileList;
}

module.exports.resultentity = resultentity;
module.exports.userentity = userentity;
module.exports.SubjectTypeEntity = SubjectTypeEntity
module.exports.subjectentity = subjectentity
module.exports.accountentity = accountentity
module.exports.recordentity = recordentity
module.exports.voucherentity = voucherentity