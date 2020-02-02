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