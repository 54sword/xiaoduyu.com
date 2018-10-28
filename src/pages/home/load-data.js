import { loadPostsList } from '../../store/actions/posts';

let general = {
  variables: {
    sort_by: "sort_by_date",
    deleted: false,
    weaken: false
  }
}

export default ({ store, match }) => {
  return new Promise(async resolve => {

    await loadPostsList({
       id: 'home',
       filters: general
    })(store.dispatch, store.getState);

    resolve({ code:200 });

    /*
    Promise.all([
      new Promise(async resolve => {
        let [ err, result ] = await loadPostsList({
          id: 'home',
          filters: general
        })(store.dispatch, store.getState);
        resolve([ err, result ])
      })
      // new Promise(async resolve => {
      //   let [ err, result ] = await loadPostsList({
      //     id: '_home',
      //     filters: recommend
      //   })(store.dispatch, store.getState);
      //   resolve([ err, result ])
      // })
    ]).then(value=>{
      resolve({ code:200 });
    });
    */

  })
}
