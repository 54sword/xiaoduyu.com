import cloneObj from '../clone';

type Actions = {
  type: string
  name?: string
  data?: any
  id?: string
  view_count?: string
  audience_count?: string
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
      if (action.id) state[action.id].data[0].audience_count += 1;
      break;

    case 'REMOVE_AUDIENCE_BY_LIVE_ID':
      if (action.id) state[action.id].data[0].audience_count += -1;
      break;

    case 'UPDATE_LIVE_STATE_BY_LIVE_ID':
      if (action.id) {
        state[action.id].data[0].audience_count = action.audience_count;
        state[action.id].data[0].view_count = action.view_count;
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

export const getLiveListById = (state: any, id: string) => state.live[id]