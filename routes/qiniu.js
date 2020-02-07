var qiniu = require('qiniu-js')

var observable = qiniu.upload(file, key, token, putExtra, config)
var subscription = observable.subscribe(observer) // 上传开始

