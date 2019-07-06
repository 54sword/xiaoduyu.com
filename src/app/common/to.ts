
// Peomise 结果处理，返回数组 [err, res]
// err 为错误结果，res 为正确结果
export default function to(promise: any) {

  if (!promise || !Promise.prototype.isPrototypeOf(promise)) {
    return new Promise((resolve, reject)=>{
      reject(new Error("requires promises as the param"));
    }).catch((err)=>{
      return [err, null];
    });
  }

  return promise.then((data: any) => {
    return [null, data];
  })
  .catch((err: any) => [err]);

}
