import cloneObj from '../clone';

type Actions = {
  type: string
  name?: string
  data?: any
  state?: any
  id?: string
  followStatus?: boolean
  peopleId: string
  status: boolean
  update: any
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {}

export default (state = cloneObj(initialState), action: Actions) => {
  switch (action.type) {

    case 'SET_POSTS':
      state = action.state;
      break;

    case 'SET_POSTS_LIST_BY_ID':
      const { name, data } = action;
      if (name && data) state[name] = data;
      break;

    case 'REMOVE_POSTS_LIST_BY_ID':
      if (action.id && state[action.id]) delete state[action.id];
      break;

    // 更新所有列表中 questionid 的 follow 状态
    case 'UPDATE_POSTS_FOLLOW':

      for (let i in state) {
        let data = state[i].data
        if (data.length > 0) {
          for (let n = 0, max = data.length; n < max; n++) {
            if (data[n]._id == action.id) {
              state[i].data[n].follow_count += action.followStatus ? 1 : -1
              state[i].data[n].follow = action.followStatus
            }
          }
        }
      }

      break;

    // 更新所有列表中 questionid 的 follow 状态
    case 'UPDATE_POSTS_AUHTOR_FOLLOW':

      for (let i in state) {
        let data = state[i].data
        if (data.length > 0) {
          for (let n = 0, max = data.length; n < max; n++) {
            if (data[n].user_id._id == action.peopleId) {
              // state[i].data[n].follow_count += followStatus ? 1 : -1
              state[i].data[n].user_id.follow = action.followStatus
            }
          }
        }
      }
      break;
    
      /*
    case 'UPDATE_POSTS_COMMENT_LIKE_STATUS':
      // var { id, status } = action

      for (let i in state) {
        let data = state[i].data

        data.map((post: any)=>{

          if (post.comment && post.comment.length) {

            post.comment.map((comment: any)=>{
              if (comment._id == id) {
                comment.like_count += action.status ? 1 : -1
                comment.like = action.status
              }
            })

          }

        })

      }
      break;
    */

    case 'UPDATE_POSTS_LIKE_STATUS':
      var { id, status } = action

      for (let i in state) {
        let data = state[i].data
        data.map((post: {_id: string, like_count: number, like: boolean })=>{
          if (post._id == id) {
            post.like_count += status ? 1 : -1
            post.like = status
          }
        })
      }
      break;

    case 'UPDATE_POSTS_VIEW':
      var { id } = action
      for (let i in state) {
        state[i].data.map((item: { _id: string, view_count: number }) => {
          if (item._id == id) {
            item.view_count += 1
          }
        })
      }
      break;

    case 'UPDATE_POST':
      var { id, update } = action
      for (let i in state) {
        state[i].data.map((item: any) => {
          if (item._id == id) {
            for (let i in update) item[i] = update[i]
          }
        })
      }
      break;

    case 'REMOVE_POSTS_BY_ID':

      var { id } = action

      for (let i in state) {

        if (i == id) {
          delete state[i]
        } else {
          let data = state[i].data
          if (data.length > 0) {
            for (let n = 0, max = data.length; n < max; n++) {
              if (data[n]._id == id) {
                data.splice(n, 1)
                break
              }
            }
          }
        }
      }
      break;

    default:
      return state;
  }

  return cloneObj(state);
}

export const getPostsListById = (state: any, id: string) => state.posts[id]