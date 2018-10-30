
let initialState = {}

export default function() {

  return function scroll(state = initialState, action = {}) {

    switch (action.type) {

      case 'SAVE_SCROLL_POSITION':
        state[action.name] = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        return state

      case 'SET_SCROLL_POSITION':

        // 1、先设置置顶
        window.scrollTo(0, state[action.name] || 0);

        // 2、浏览器会执行自带滚动条的位置记录

        // 3、如果存在位置，则覆盖条浏览器的滚动条位置
        if (typeof state[action.name] != 'undefined') {
          // 延迟一点点，覆盖掉浏览器自带的滚动条位置记录
          setTimeout(()=>{
            window.scrollTo(0, state[action.name] || 0);
          });
        }

        return state

      // 清空
      case 'CLEAN':
        return {}

      default:
        return state
    }

  }

}
