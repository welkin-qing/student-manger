var mysql = require('mysql')
//mysql
var db = mysql.createConnection({
  'host': 'localhost',
  'user': 'root',
  'password': '123456wq',
 // 'port': '3306',
  'database': 'kxgl'
},console.log("数据库连接成功！"));
// 连接数据库
db.connect();
// 将这个模块公有化
// 使得其他js文件可以通过require语句来引入。
module.exports = db;
