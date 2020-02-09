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