import cloneObj from '../clone';

type Actions = {
  type: string
  data?: any
  id?: string
  name?: string
  state?: any
  update?: any
  status?: boolean
  selfId?: string
  followStatus?: boolean
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {}

export default (state = cloneObj(initialState), action: Actions) => {
  switch (action.type) {

    case 'SET_FOLLOW':
      state = action.state;

    case 'SET_FOLLOW_LIST_BY_ID':
      var { name, data } = action;
      if (name && data) state[name] = data;
      break;

    // 更新所有列表中 questionid 的 follow 状态
    case 'UPDATE_FOLLOW':
      var { id, selfId, followStatus } = action

      for (let i in state) {
        let data = state[i].data
        if (data.length > 0) {
          data.map((item: any)=>{

            // 更新用户关注状态
            if (item.people_id && item.people_id._id == id) {
              item.people_id.follow = followStatus;
            }

            // 更新自己关注用户的累计数
            if (item.people_id && item.people_id._id == selfId) {
              item.people_id.follow_people_count += followStatus ? 1 : -1;
            }

            // 更新用户关注状态
            if (item.user_id && item.user_id._id == id) {
              item.user_id.follow = followStatus;
            }

            // 更新自己关注用户的累计数
            if (item.user_id && item.user_id._id == selfId) {
              item.user_id.fans_count += followStatus ? 1 : -1;
            }

            if (item.topic_id && item.topic_id._id == id) {
              item.topic_id.follow = followStatus;
            }

            if (item.posts_id && item.posts_id._id == id) {
              item.posts_id.follow = followStatus;
            }

          })
        }
      }
      break;

    case 'CLEAN':
      state = {};
      break;

    default:
      return state;
  }
  return cloneObj(state);
}

export const getFollowListById = (state: any, id: string) => state.follow[id]
