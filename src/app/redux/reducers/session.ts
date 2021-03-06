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

    case 'SET_SESSION':
      state = action.state;
      break;

    case 'UPDATE_READ_BY_ID':
      for (let i in state) {
        state[i].data.map((item: any)=>{
          if (item._id == action.id) {
            item.unread_count = 0;
          }
        })
      }
      break;
      
    case 'SET_SESSION_LIST_BY_ID':
      var { name, data } = action;
      if (name && data) state[name] = data;
      break;
      
    case 'UPDATE_SESSION':
      var { id, update } = action
      for (let i in state) {
        state[i].data.map((item: any) => {
          if (item._id == id) {
            for (let i in update) item[i] = update[i]
          }
        })
      }
      break;

    case 'CLEAN_SESSION':
      // state = {};
      return {};
      break;

    case 'CLEAN':
      state = {};
      break;

    default:
      return state;
  }
  return cloneObj(state);
}

export const getSessionListById = (state: any, id: string) => state.session[id]
