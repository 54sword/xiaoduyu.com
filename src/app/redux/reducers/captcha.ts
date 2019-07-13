import cloneObj from '../clone';

type Actions = {
  type: string
  data: any
  id: string
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {}

export default (state = cloneObj(initialState), action: Actions) => {
  
  switch (action.type) {

    case 'ADD_CAPTCHA_ID':
      const { id, data } = action;
      if (id && data) state[id] = data;
      break;

    default:
      return state;
  }

  return cloneObj(state);
}

export const getCaptchaById = (state: any, id: string) => state.captcha[id] || null
