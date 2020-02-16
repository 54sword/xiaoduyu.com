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

    case 'SET_MESSAGE':
      state = action.state;

    case 'SET_MESSAGE_LIST_BY_ID':
      var { name, data } = action;
      if (name && data) state[name] = data;
        break;
      
    case 'UPDATE_MESSAGE':
      var { id, update } = action
      for (let i in state) {
        state[i].data.map((item: any) => {
          if (item._id == id) {
            for (let i in update) item[i] = update[i]
          }
        })
      }
      break;
      
    case 'CLEAN_MESSAGE':
      return {};

    case 'CLEAN':
      state = {};
      break;

    default:
      return state;
  }
  return cloneObj(state);
}

export const getMessageListById = (state: any, id: string) => state.message[id]
