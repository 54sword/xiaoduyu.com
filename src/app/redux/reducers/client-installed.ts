
import cloneObj from '../clone';

type Actions = {
  type: string
  name: string
}

type InitialState = {
  [key: string]: any
}

const initialState:InitialState = {};

export default (state = cloneObj(initialState), action: Actions) => {
  
  switch (action.type) {
    
    case 'HAS_CLIENT_INSTALLED':
      const { name } = action;
      state[name] = true;
      break;

    default:
      return state;
  }

  return cloneObj(state);
}

export const getClientInstalled = (state: any) => state.clientInstalled
