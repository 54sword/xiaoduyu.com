import cloneObj from '../clone';

type Actions = {
  type: string
  id: string
  data: any
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {}

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {

    case 'ADD_LINK_LIST_BY_ID':
      state[action.id] = action.data;
      break;

    case 'CLEAN':
      state = {};
      break;

    default:
      return state
  }

  return cloneObj(state);

}

export const getLinkListById = (state: any, id: string) => state.links[id]