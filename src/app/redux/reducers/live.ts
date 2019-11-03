import cloneObj from '../clone';

type Actions = {
  type: string
  name?: string
  data?: any
  id?: string
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {}

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {

    case 'ADD_LIVE_LIST_BY_ID':
      const { name, data } = action;
      if (name && data) state[name] = data;
      break;

    case 'ADD_AUDIENCE_BY_LIVE_ID':
      console.log('+1');
      if (action.id) state[action.id].data[0].audience_count += 1;
      break;

    case 'REMOVE_AUDIENCE_BY_LIVE_ID':
      console.log('-1');
      if (action.id) state[action.id].data[0].audience_count += -1;
      break;

    default:
      return state;
  }

  return cloneObj(state);
}

export const getLiveListById = (state: any, id: string) => state.live[id]