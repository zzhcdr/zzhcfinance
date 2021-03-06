// pages/voucher/uploadvoucher.js
var util = require("../../utils/util.js")
var entity = require("../../entity.js")
var dao = require("../../dao.js")
var http = require("../../network/httpclient.js")
var app = getApp();
var appDao = new dao.AppDao();
var subjectTypes = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadindex:0,
    uploadedfiles:[],
    files:[],
    seldebitsubject: {},
    seldebitaccount: {},
    selcreditsubject: {},
    selcreditaccount: {},
    id:"",
    title: "",
    balance: 0,
    date: '',
    attachment:'',
    debitMultiIndex: [0,0,0],
    creditMultiIndex: [4,0,0],
    debitMultiArray: [[]],
    creditMultiArray: [[]],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var voucherid = options.id;
    appDao.querySubjectType({
      callFun:function()
      {
        subjectTypes = appDao.getSubjectTypes();
        that.data.id = voucherid;
        var voucherEntity = appDao.getVoucherById(voucherid);
        var data = {
          title: voucherEntity.title,
          balance: voucherEntity.money,
          date: voucherEntity.createdate,
          attachment: voucherEntity.attachment,
          uploadedfiles: voucherEntity.attachmentPics,
          seldebitaccount: voucherEntity.capitalAccountByDebitid,
          selcreditaccount: voucherEntity.capitalAccountByCreditid,
          seldebitsubject: appDao.getSubject(voucherEntity.capitalAccountByDebitid.subjectid),
          selcreditsubject: appDao.getSubject(voucherEntity.capitalAccountByCreditid.subjectid),
          debitMultiArray: [[]],
          creditMultiArray: [[]]
        }
        var creditMultiIndex = that.data.creditMultiIndex;

        data.debitMultiArray[0] = subjectTypes;
        data.debitMultiArray[1] = subjectTypes[0].accountSubjectsById;
        data.debitMultiArray[2] = subjectTypes[0].accountSubjectsById[0].capitalAccountsById;

        data.creditMultiArray[0] = subjectTypes;
        data.creditMultiArray[1] = subjectTypes[creditMultiIndex[0]].accountSubjectsById;
        data.creditMultiArray[2] = data.creditMultiArray[1][creditMultiIndex[1]].capitalAccountsById;

        that.setData(data);
      }
    })
  },

  showDebitAccount: function () {
    var data = {
      seldebitsubject: {},
      seldebitaccount: {}
    }
    var typeIndex = this.data.debitMultiIndex[0];
    var subjectIndex = this.data.debitMultiIndex[1];
    var accountIndex = this.data.debitMultiIndex[2];
    data.seldebitsubject = subjectTypes[typeIndex].accountSubjectsById[subjectIndex];
    data.seldebitaccount = data.seldebitsubject.capitalAccountsById[accountIndex];
    this.setData(data);
  },

  showCreditAccount: function () {
    var data = {
      selcreditsubject: {},
      selcreditaccount: {}
    }

    var typeIndex = this.data.creditMultiIndex[0];
    var subjectIndex = this.data.creditMultiIndex[1];
    var accountIndex = this.data.creditMultiIndex[2];

    data.selcreditsubject = subjectTypes[typeIndex].accountSubjectsById[subjectIndex];
    data.selcreditaccount = data.selcreditsubject.capitalAccountsById[accountIndex];

    this.setData(data);
  },

  titleinput: function (e) {
    this.setData({
      title: e.detail.value
    });
  },

  balanceinput: function (e) {
    this.setData({
      balance: e.detail.value
    });
  },

  datePickerChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },

  bindDebitMultiPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      debitMultiIndex: e.detail.value
    })
    this.showDebitAccount();
  },

  bindDebitMultiPickerColumnChange: function (e) {
    var subjects = appDao.getSubjects();
    var column = e.detail.column;
    var columnVal = e.detail.value;
    //console.log('修改的列为', column, '，值为', columnVal);
    var data = {
      debitMultiIndex: this.data.debitMultiIndex,
      debitMultiArray: this.data.debitMultiArray,
    };
    data.debitMultiIndex[column] = columnVal;

    switch (column) {
      case 0:
        data.debitMultiArray[1] = subjectTypes[data.debitMultiIndex[0]].accountSubjectsById;
        data.debitMultiArray[2] = data.debitMultiArray[1][data.debitMultiIndex[1]]._capitalAccountsById;
        break;
      case 1:
        data.debitMultiArray[2] = data.debitMultiArray[1][data.debitMultiIndex[1]]._capitalAccountsById;
        break;
    }
    this.setData(data);
  },

  bindCreditMultiPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      creditMultiIndex: e.detail.value
    })
    this.showCreditAccount();
  },

  bindCreditMultiPickerColumnChange: function (e) {
    var subjects = appDao.getSubjects();
    var column = e.detail.column;
    var columnVal = e.detail.value;
    //console.log('修改的列为', column, '，值为', columnVal);
    var data = {
      creditMultiIndex: this.data.creditMultiIndex,
      creditMultiArray: this.data.creditMultiArray
    };
    data.creditMultiIndex[column] = columnVal;

    switch (column) {
      case 0:
        data.creditMultiArray[1] = subjectTypes[data.creditMultiIndex[0]].accountSubjectsById;
        data.creditMultiArray[2] = data.creditMultiArray[1][data.creditMultiIndex[1]]._capitalAccountsById;
        break;
      case 1:
        data.creditMultiArray[2] = data.creditMultiArray[1][data.creditMultiIndex[1]]._capitalAccountsById;
        break;
    }

    this.setData(data);
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

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },

  previewNetworkImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.uploadedfiles // 需要预览的图片http链接列表
    })
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  onupdate: function () {
    var that = this;

    appDao.modifyVoucher(
      {
        data:{
          id: that.data.id,
          title: that.data.title,
          balance: that.data.balance,
          date: that.data.date,
          attachment: that.data.attachment,
          debitid: that.data.seldebitaccount.id,
          creditid: that.data.selcreditaccount.id
        },
        callFun:function()
        {
          if (that.data.files.length > 0) {
            that.onupload();
          } else {
            wx.showToast({
              title: '更新凭据信息成功'
            })
          }
        }
      }
    )
  },

  onDeleteVoucher:function(e)
  {
    var that = this;
    wx.showModal({
      title: '系统提醒',
      content: '是否删除凭据',
      success:function(res)
      {
          if(res.confirm)
          {
            var itemid = e.currentTarget.id;
            var itemType = e.currentTarget.dataset.type;
            var deleteIndex = 0;
            var fileName = itemid;
            if (itemid.lastIndexOf("/") != -1)
            {
              fileName = itemid.substring(itemid.lastIndexOf("/") + 1);
            }
            if(itemType == "network")
            {
              wx.showLoading({
                title: '删除中...',
              })

              appDao.deleteVoucherAttachment(
                {
                  data:{
                    moduleid: "2",
                    id: that.data.id,
                    fileName: fileName
                  },
                  callFun:function()
                  {
                    wx.showToast({
                      title: '删除成功',
                    })
                    deleteIndex = that.data.uploadedfiles.indexOf(itemid);
                    that.data.uploadedfiles.splice(deleteIndex, 1);
                    that.setData({
                      uploadedfiles: that.data.uploadedfiles
                    });
                  }
                }
              )
          }
          else
          {
              deleteIndex = that.data.files.indexOf(itemid);
              that.data.files.splice(deleteIndex, 1);
              that.setData({
                files: that.data.files
              });
          }
          }else if(res.cancel)
          {
            return false;
          }
      }
    })
  },

  onupload:function()
  {

    var that = this;
    var httpClient = new http.HttpClient();
    if (that.data.uploadindex < that.data.files.length)
    {
      var tipTitle = '上传附件中 ' + (that.data.uploadindex + 1) + "/" + that.data.files.length
      wx.showLoading({
        title: tipTitle,
      })
      var file = that.data.files[that.data.uploadindex]
      const uploadTask = wx.uploadFile({
        url: httpClient.host + '/uploadvoucherserv?moduleid=2', //仅为示例，非真实的接口地址
        filePath: file,
        header: util.getheader(),
        formData: {},
        name: that.data.id,
        success: function (res) {
          that.data.uploadindex++;
          var data = res.data
          wx.showToast({
            title: '上传完成',
          })
        },
        complete:function(res)
        {
          wx.hideLoading();
          that.onupload();
        }
      })

      uploadTask.onProgressUpdate((res) => {
        console.log('上传进度', res.progress)
      })
    }else
    {
      that.setData({
        uploadedfiles: that.data.uploadedfiles.concat(that.data.files),
        files:[],
        uploadindex: 0,
      });
      wx.hideLoading();
      wx.showToast({
        title: '更新凭据成功',
      })
    }
  },

  ondelete:function()
  {
    var voucherid = this.data.id;
    wx.showModal({
      title: '系统提醒',
      content: '是否删除凭据',
      success: function (res) {
        if (res.confirm) {
          appDao.removeVoucher({
            id: voucherid,
            callFun: function () {
              wx.showToast({
                title: '删除成功',
                icon: "success",
                complete: function () {
                  setTimeout(function () {
                    wx.navigateBack({});
                  }, 1000);
                }
              })
            }
          })
        }
      }
    })
  },
})