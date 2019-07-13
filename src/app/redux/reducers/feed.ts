import cloneObj from '../clone';

type Actions = {
  type: string
  data?: any
  id?: string
  name?: string
  state?: any
  update?: any
  status?: boolean
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {}

export default (state = cloneObj(initialState), action: Actions) => {
  switch (action.type) {

    case 'SET_FEED':
      state = action.state;
      break;

    case 'SET_FEED_LIST_BY_ID':
      var { name, data } = action;
      if (name && data) state[name] = data;
      break;

    case 'UPDATE_COMMENT_LIKE':

      var { id, status } = action;

      for (let i in state) {
        state[i].data.map((item: any, key: number)=>{
          if (item.comment_id && item.comment_id._id == id) {
            state[i].data[key].comment_id.like = status;
            state[i].data[key].comment_id.like_count += status ? 1 : -1;
          }
        })
      }

      break;

    default:
      return state;
  }
  return cloneObj(state);
}

export const getFeedListById = (state: any, id: string) => state.feed[id]