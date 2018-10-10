// pages/business/businessdetail.js
var dao = require("../../dao.js")
var http = require("../../network/httpclient.js")
var util = require("../../utils/util.js")
var app = getApp();
var appDao = new dao.AppDao();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadindex: 0,
    uploadedfiles: [],
    files: [],
    isMyBusiness:0,
    id: "",
    note:"",
    reporter:{},
    createdate:"",
    readers:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var businessDetail = appDao.getBusinessById(id);
    appDao.queryUserList({
      callFun: function () {
        var isMine = app.globalData.currUser.uid == businessDetail.usersByUid.uid;
        that.setData({
          id: id,
          isMyBusiness: isMine,
          readers: appDao.getUsers(),
          note:businessDetail.note,
          reporter: businessDetail.usersByUid,
          createdate: businessDetail.createdate,
          uploadedfiles: businessDetail.attachmentPics,
        })
      }
    })
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
          if (itemid.lastIndexOf("/") != -1) {
            fileName = itemid.substring(itemid.lastIndexOf("/") + 1);
          }
          if (itemType == "network") {
            wx.showLoading({
              title: '删除中...',
            })

            appDao.deleteVoucherAttachment(
              {
                data: {
                  moduleid:"1",
                  id: that.data.id,
                  fileName: fileName
                },
                callFun: function () {
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
          else {
            deleteIndex = that.data.files.indexOf(itemid);
            that.data.files.splice(deleteIndex, 1);
            that.setData({
              files: that.data.files
            });
          }
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
        url: httpClient.host + '/uploadvoucherserv?moduleid=1' , //仅为示例，非真实的接口地址
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

  onUpdate:function()
  {
    var that = this;
    appDao.modifyBusiness({
      data:{
        id: that.data.id,
        note: that.data.note,
        createdate: that.data.createdate,
        reader: ""
      },
      callFun:function(){
        if (that.data.files.length > 0) {
          that.onUploadVoucher();
        } else {
          wx.showToast({
            title: '更新凭据信息成功'
          })
        }
      }
    });
  }

})