
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

const initialState: InitialState = {
}

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {

    case 'SET_TIPS_BY_ID':
      if (action.id) state[action.id] = action.status;
      break;

    default:
      return state
  }

  return cloneObj(state);

}

export const getTipsById = (state: any, id: string) => state.tips[id] || false
