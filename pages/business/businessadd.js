// pages/business/businessadd.js
var util = require("../../utils/util.js")
var dao = require("../../dao.js")
var app = getApp();
var appDao = new dao.AppDao();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    note:"",
    reporter: "",
    date: '',
    files: [],
    readers: [
      { id: 'USA', name: '美国' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var today = new Date();
    that.setData({
      date: util.formatDate(today),
      reporter: app.globalData.currUser.name
    });
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

  onNoteInput:function(e)
  {
    this.setData({
      note: e.detail.value
    });
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

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：')
    console.log(e.detail.value)
  },

  onDeleteVoucher: function (e) {
    var that = this;
    wx.showModal({
      title: '系统提醒',
      content: '是否删除凭据',
      success: function (res) {
        if (res.confirm) {
          var itemid = e.currentTarget.id;
          var itemType = e.currentTarget.dataset.type;
          var deleteIndex = 0;
          var fileName = itemid;
          
          deleteIndex = that.data.files.indexOf(itemid);
          that.data.files.splice(deleteIndex, 1);
          that.setData({
            files: that.data.files
          });

        } else if (res.cancel) {
          return false;
        }
      }
    })
  },

  onUploadVoucher: function () {

    var that = this;
    var httpClient = new http.HttpClient();
    if (that.data.uploadindex < that.data.files.length) {
      var tipTitle = '上传附件中 ' + (that.data.uploadindex + 1) + "/" + that.data.files.length
      wx.showLoading({
        title: tipTitle,
      })
      var file = that.data.files[that.data.uploadindex]
      const uploadTask = wx.uploadFile({
        url: httpClient.host + '/uploadvoucherserv', //仅为示例，非真实的接口地址
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
        complete: function (res) {
          wx.hideLoading();
          that.onUploadVoucher();
        }
      })

      uploadTask.onProgressUpdate((res) => {
        console.log('上传进度', res.progress)
      })
    } else {
      that.setData({
        uploadedfiles: that.data.uploadedfiles.concat(that.data.files),
        files: [],
        uploadindex: 0,
      });
      wx.hideLoading();
      wx.showToast({
        title: '上报业务成功',
      })
    }
  },

  add:function()
  {
    var that = this;
    appDao.addBusiness(
      {
        data:{
          note:that.data.note,
          date:that.data.date
        },
        callFun:function(res)
        {
          console.log(res);
          if (that.data.files.length > 0) {
            that.onUploadVoucher();
          } else {
            wx.showToast({
              title: '上报业务成功'
            })
          }
        }
      }
    );
  },



})