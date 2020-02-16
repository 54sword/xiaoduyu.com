import cloneObj from '../clone';

type Actions = {
  type: string
  name: string
  data: any
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {}

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {

    case 'ADD_LIKE_LIST_BY_ID':
      state[action.name] = action.data;
      break;

    case 'CLEAN':
      state = {};
      break;

    default:
      return state
  }

  return cloneObj(state);

}

export const getLikeListById = (state: any, id: string) => state.like[id]