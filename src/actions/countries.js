import graphql from '../common/graphql';

// 获取国家
export function loadCountries() {
  return (dispatch, getState) => {
  return new Promise(async resolve => {

      let countries = getState().countries;

      if (countries && countries.length > 0) {
        resolve([null, countries]);
        return
      }

      let [ err, res ] = await graphql({
        api: 'countries',
        fields: `
          code
          name
          abbr
        `,
      });

      if (!err) {
        dispatch({ type: 'SET_COUNTRIES', countries: res });
        resolve([null, res])
      } else {
        resolve([err])
      }

  })
  }
}
