import cloneObj from '../clone';

type Actions = {
  type: string
  countries: any
}

const initialState: Array<any> = [];

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {
    
    case 'SET_COUNTRIES':
      state = action.countries;
      break;

    default:
      return state
  }

  return cloneObj(state);

}

// 获取国家列表
export const getCountries = (state: any) => state.countries
