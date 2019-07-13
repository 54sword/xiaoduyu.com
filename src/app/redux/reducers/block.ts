import cloneObj from '../clone';

type Actions = {
  type: string
  name?: string
  data?: any
  state?: any
  id?: string
}

type InitialState = {
  [key: string]: any;
}

const initialState: InitialState = {}

export default (state = cloneObj(initialState), action: Actions) => {
  
  switch (action.type) {

    case 'SET_BLOCK_STATE':
      state = action.state;

    case 'SET_BLOCK_LIST_BY_ID':
      const { name, data } = action;
      if (name && data) state[name] = data;
      break;

    case 'REMOVE_BLOCK_BY_ID':
      for (let i in state) {
        let data = state[i].data
        if (data.length > 0) {
          for (let n = 0, max = data.length; n < max; n++) {
            if (data[n]._id == action.id) {
              data.splice(n, 1)
              break
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

export const getBlockListById = (state: any, id: string) => state.block[id] || null
