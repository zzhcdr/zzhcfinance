// pages/voucher/uploadvoucher.js
var util = require("../../utils/util.js")
var entity = require("../../entity.js")
var app = getApp();
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
    debitMultiIndex: [0, 0],
    creditMultiIndex: [4, 0],
    objectMultiArray: [[]],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var voucherid = options.id;
    that.data.id = voucherid;
    wx.showLoading({
      title: '数据请求中...',
      mask:true
    })
    wx.request({
      url: app.globalData.host + '/getvoucherserv',
      data:{
        id: voucherid
      },
      header: util.getheader(),
      success:function(res)
      {
        var serverdata = new entity.resultentity();
        serverdata.init(res.data)
        var voucherEntity = new entity.voucherentity();
        voucherEntity.init(serverdata.data);
        var data = {
          title: voucherEntity.title,
          balance: voucherEntity.money,
          date: voucherEntity.createdate,
          attachment: voucherEntity.attachment,
          uploadedfiles: voucherEntity.attachmentPics,
          seldebitaccount: voucherEntity.capitalAccountByDebitid,
          selcreditaccount: voucherEntity.capitalAccountByCreditid,
          seldebitsubject: app.getSubject(voucherEntity.capitalAccountByDebitid.subjectid),
          selcreditsubject: app.getSubject(voucherEntity.capitalAccountByCreditid.subjectid),
        }
        that.setData(data);
      },
      complete:function()
      {
        wx.hideLoading();
      }
    });
    that.showAccount();

  },

  showAccount:function()
  {
    var data = {
      objectMultiArray: [[]]
    };
    data.objectMultiArray[0] = app.globalData.subjects;
    data.objectMultiArray[1] = app.globalData.subjects[0].capitalAccountsById;
    this.setData(data);
  },

  showDebitAccount: function () {
    var data = {
      seldebitsubject: {},
      seldebitaccount: {}
    }
    var subjectIndex = this.data.debitMultiIndex[0];
    var accountIndex = this.data.debitMultiIndex[1];
    data.seldebitsubject = app.globalData.subjects[subjectIndex];
    data.seldebitaccount = data.seldebitsubject.capitalAccountsById[accountIndex];
    this.setData(data);
  },

  showCreditAccount: function () {
    var data = {
      selcreditsubject: {},
      selcreditaccount: {}
    }
    var subjectIndex = this.data.creditMultiIndex[0];
    var accountIndex = this.data.creditMultiIndex[1];
    data.selcreditsubject = app.globalData.subjects[subjectIndex];
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      debitMultiIndex: e.detail.value
    })
    this.showDebitAccount();
  },

  bindDebitMultiPickerColumnChange: function (e) {
    var column = e.detail.column;
    var columnVal = e.detail.value;
    console.log('修改的列为', column, '，值为', columnVal);
    var data = {
      debitMultiIndex: this.data.debitMultiIndex,
      objectMultiArray: this.data.objectMultiArray,
    };
    data.debitMultiIndex[column] = columnVal;
    if (column == 0) {
      data.objectMultiArray[1] = app.globalData.subjects[data.debitMultiIndex[0]].capitalAccountsById;
    }
    this.setData(data);
  },

  bindCreditMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      creditMultiIndex: e.detail.value
    })
    this.showCreditAccount();
  },

  bindCreditMultiPickerColumnChange: function (e) {
    var column = e.detail.column;
    var columnVal = e.detail.value;
    console.log('修改的列为', column, '，值为', columnVal);
    var data = {
      creditMultiIndex: this.data.creditMultiIndex,
      objectMultiArray: this.data.objectMultiArray
    };
    data.creditMultiIndex[column] = columnVal;
    if (column == 0) {
      data.objectMultiArray[1] = app.globalData.subjects[data.creditMultiIndex[0]].capitalAccountsById;
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
    wx.showLoading({
      title: '更新凭据信息中...',
    })
    wx.request({
      url: app.globalData.host +'/modifyvoucherserv',
      data:{
        id:that.data.id,
        title: that.data.title,
        balance: that.data.balance,
        date: that.data.date,
        attachment: that.data.attachment,
        debitid: that.data.seldebitaccount.id,
        creditid: that.data.selcreditaccount.id,
      },
      success:function(res)
      {
        if(that.data.files.length>0)
        {
          that.onupload();
        }else
        {
          wx.hideLoading();
          wx.showToast({
            title: '更新凭据信息成功',
            icon:'none'
          })
        }

      },
      fail:function(res)
      {
        wx.showToast({
          title: '更新凭据信息失败',
        })
      }
    })
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
              wx.request({
                url: app.globalData.host + '/deletevoucherattachmentserv',
                data:{
                  id:that.data.id,
                  fileName: fileName
                },
                success:function(e)
                {
                  wx.hideLoading();
                  wx.showToast({
                    title: '删除成功',
                  })
                  deleteIndex = that.data.uploadedfiles.indexOf(itemid);
                  that.data.uploadedfiles.splice(deleteIndex, 1);
                  that.setData({
                    uploadedfiles: that.data.uploadedfiles
                  });
                },
                fail:function(e)
                {
                  wx.hideLoading();
                  wx.showToast({
                    title: '删除失败',
                  })
                }
              })
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
    if (that.data.uploadindex < that.data.files.length)
    {
      var tipTitle = '上传附件中 ' + (that.data.uploadindex + 1) + "/" + that.data.files.length
      wx.showLoading({
        title: tipTitle,
      })
      var file = that.data.files[that.data.uploadindex]
      const uploadTask = wx.uploadFile({
        url: app.globalData.host + '/uploadvoucherserv', //仅为示例，非真实的接口地址
        filePath: file,
        header: util.getheader(),
        name: that.data.id,
        formData: {},
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
        title: '更新凭据信息成功',
        icon: 'none'
      })
    }
  },

  ondelete:function()
  {
    var voucherid = this.data.id;
    wx.request({
      url: app.globalData.host + '/removevoucherserv',
      data:{
        id: voucherid
      },
      success:function(res)
      {
        wx.showToast({
          title: '删除成功',
          icon:"success",
          complete:function()
          {
            setTimeout(function(){
              wx.navigateBack({});
            },1000);
          }
        })
      },
      fail:function(res)
      {
        wx.showToast({
          title: '删除失败',
        })
      }
    })
  },

})