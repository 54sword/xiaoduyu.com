import cloneObj from '../clone';

type Actions = {
  type: string,
  name?: string,
  data?: any
}

type InitialState = {
  [key: string]: any;
}

const initialState: InitialState = {};

export default (state = cloneObj(initialState), action: Actions) => {
  switch (action.type) {

    case 'SET_AD_LIST_BY_ID':
      const { name, data } = action;
      if (name && data) state[name] = data;
      break;

    default:
      return state;
  }

  return cloneObj(state);
}

export const getADListById = (state: any, id: string) => state.ad[id]
export const getADListDataById = (state: any, id: string) => state.ad[id] ? state.ad[id].data : null