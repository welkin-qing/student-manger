//login function  未使用
function login_function(str, password, result) {
  db.query(str, (err, result) => {
    if (err) { throw err }
    console.log(result)
    console.log(result[0].password)
    var pswd = result[0].password
    if (result.length === 0) {
      //console.log("找不到账号！")
      return res.status(200).json({
        err_code: 2,
        message: 'OK'
      })
    } else if (password != pswd) {
      //console.log("密码错误")
      return res.status(200).json({
        err_code: 1,
        message: 'OK'
      })
    }
    else {
      console.log("成功登陆！!")
      return res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    }
  })
}

//date
function formatDate(date) {
  var date = new Date(date);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD +" "+hh + mm + ss;
}
//console.log(formatDate(1581083803659))

  // var str1 = '你好！'
  // var str2 = '你好！'
  // if(str1 == str2){
  //   console.log('一样')
  // }else{
  //   console.log('no')
  // }
  // template.helper('timestamp', function(value, format) {
  //   var date = new Date(value);
  //   var y = date.getFullYear();
  //   var m = date.getMonth() + 1;
  //   m = m < 10 ? ('0' + m) : m;
  //   var d = date.getDate();
  //   d = d < 10 ? ('0' + d) : d;
  //   var h = date.getHours();
  //   h = h < 10 ? ('0' + h) : h;
  //   var minute = date.getMinutes();
  //   var second = date.getSeconds();
  //   minute = minute < 10 ? ('0' + minute) : minute;
  //   second = second < 10 ? ('0' + second) : second;
  //   return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  //   });
  // 时间戳转日期函数
  function timestampToTime(val) {
    var date = new Date(val);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y + M + D + h + m + s;
  }; 
    // template.defaults.imports.timestamp = function(value){
    //   return timestampToTime(value);       
    // }

    // template.defaults.imports.dateFmt = function(ns){
    //   return new Date(parseInt(ns)).toLocaleString();
    //   };