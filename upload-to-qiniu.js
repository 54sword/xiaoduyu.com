
// 上传build目录里面的文件到七牛
var glob = require("glob");
var qiniu = require("qiniu");

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'V7Tt-TvFyxpd0r6w0iyg6L4PkZOv0oRUsB1xymfm';
qiniu.conf.SECRET_KEY = 'CIK0hDp3gPBBxaEA_gHyWiqVgmDldoG4a_yDg4iE';

//要上传的空间
var bucket = 'qn-cdn';

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

function upload(files, callback) {

  //要上传文件的本地路径
  var filePath = files
  var fileName = filePath.split('/')
  fileName = fileName[fileName.length - 1]

  //生成上传 Token
  var token = uptoken(bucket, fileName);

  //构造上传函数
  function uploadFile(uptoken, key, localFile, callback) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, callback);
  }

  //调用uploadFile上传
  uploadFile(token, fileName, filePath, function(err, ret){

    if(!err) {
      console.log('上传成功:' + files)
      // 上传成功， 处理返回值
      console.log(ret.hash, ret.key, ret.persistentId);
      callback()
    } else {
      // 上传失败， 处理返回代码
      console.log('上传失败:' + files)
      console.log(err);
      callback()
    }

  });

}


// 读取build下面所有的目录
glob("./dist/client/*", {}, function (er, files) {

  var index = files.length

  var run = function() {
    index = index - 1

    if (files[index]) {
      upload(files[index], function(){
        run()
      })
    } else {
      // 全部上传完成，退出
      process.exit()
    }

  }

  run()

})


// process.exit()
