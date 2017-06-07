

// 到达页尾事件
const keydown = (function(){

  // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
  if (typeof window == 'undefined' || typeof document == 'undefined') {
    return {
      add: (name, fn)=>{},
      remove: (name)=>{}
    }
  }

  let keyList = []
  let listenList = {}

  const onkeydown = (e)=>{
    var keyNum = window.event ? e.keyCode :e.which;
    if (keyList.indexOf(keyNum) == -1) {
      keyList.push(keyNum)
    }
  }
  
  const onkeyup = (e)=>{
    for (let i in listenList) {
      listenList[i](keyList)
    }
    keyList = []
  }

  if (window.attachEvent) {
    window.attachEvent('onkeydown', onkeydown)
    window.attachEvent('onkeyup', onkeyup)
  } else {
    window.addEventListener('keydown', onkeydown, false)
    window.addEventListener('keyup', onkeyup, false)
  }

  return {
    add: (id, callback) => {
      listenList[id] = callback
    },
    remove: (id) => {
      delete listenList[id]
    },
    getKeyList: () => {
      return keyList
    }
  }

}())

export default keydown
