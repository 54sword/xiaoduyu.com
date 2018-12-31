
import merge from 'lodash/merge';

let initialState = {
  // 是否有新的feed
  // feed: false,
  // 订阅是否有新的更新
  // subscribe: false,
  // 优选是否有新的更新
  // excellent: false
}

export default function() {

  return (state = merge({}, initialState, {}), action = {}) => {

    switch (action.type) {

      case 'SET_TIPS_BY_ID':
        state[action.id] = action.status;
        return merge({}, state, {});

      // 清空
      case 'CLEAN':
        return merge({}, initialState, {});

      default:
        return state
    }

  }

}

export const getTipsById = (state, id) => {
  return state.tips[id] || false
}
