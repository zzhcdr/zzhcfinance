function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date)
{
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return year + "-" + formatNumber(month) + "-" +formatNumber(day)
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getheader()
{
  var cookie = wx.getStorageSync('cookieKey');
  let headerdata = {};
  if (cookie) {
    headerdata.Cookie = cookie;
  }
  return headerdata;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getheader: getheader
}
