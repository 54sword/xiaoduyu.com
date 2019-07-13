import cloneObj from '../clone';

type Actions = {
  type: string
  types: any
}

const initialState: Array<any> = [];

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {

    case 'ADD_REPORT_TYPES':
      state = action.types;
      break;

    default:
      return state;
  }
  return cloneObj(state);

}

export const getReportTypes = (state: any) => state.reportTypes
