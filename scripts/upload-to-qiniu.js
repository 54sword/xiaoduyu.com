// 上传dist/client目录里面的文件到七牛
var glob = require("glob");
var qiniu = require("qiniu");
var config = require('../config/server.config.js');

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

var bucket = config.qiniu.BUCKET;

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

function upload(files, callback) {

  //要上传文件的本地路径
  var filePath = files;
  var fileName = filePath.split('/');
  fileName = fileName[fileName.length - 1];

  //生成上传 Token
  var token = uptoken(bucket, fileName);

  //构造上传函数
  function uploadFile(uptoken, key, localFile, callback){
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

  var index = files.length;

  var run = function() {
    index = index - 1

    if (files[index]) {

      if (files[index].indexOf('/sw.sj') != -1) {
        run()
      } else {
        upload(files[index], function(){
          run()
        })
      }

    } else {
      console.log('所有文件上传完毕');
      // 全部上传完成，退出
      process.exit()
    }

  }

  console.log('开始执行静态文件上传，上传到七牛');

  run();

})

// process.exit()