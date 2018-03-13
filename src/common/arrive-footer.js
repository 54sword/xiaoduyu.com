
// 到达页尾事件
const arriveFooter = (function(){

  // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
  if (typeof window == 'undefined' || typeof document == 'undefined') {
    return {
      add: (name, fn)=>{},
      remove: (name)=>{}
    }
  }

  let list = []
  let clientHeight = document.documentElement.clientHeight

  const resize = (e)=>{
    clientHeight = document.documentElement.clientHeight
  }

  const scroll = (e)=>{

    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0
    let scrollHeight = document.body.scrollHeight || document.documentElement.scrollTop

    if (scrollTop + clientHeight >= scrollHeight - 150) {

      let timestamp = new Date().getTime()

      list.map((val)=>{

        if (val.timestamp && timestamp - val.timestamp < 1000) {
          return
        }
        
        val.timestamp = timestamp
        val.callback()
      })
    }
  }

  if (window.attachEvent) {
    window.attachEvent('onscroll', scroll)
    window.attachEvent('onresize', resize)
  } else {
    window.addEventListener('scroll', scroll, false)
    window.addEventListener('resize', resize, false)
  }

  return {
    add: (name, fn)=>{
      list.push({ name: name, callback: fn })
    },
    remove: (name)=>{
      for (let i = 0, max = list.length; i < max; i++) {
        if (list[i].name == name) {
          list.splice(i, 1);
          break
        }
      }
    }
  }

}())

export default arriveFooter
