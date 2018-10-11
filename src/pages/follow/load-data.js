import { loadPostsList } from '../../actions/posts';

let general = {
  variables: {
    method: 'user_follow',
    sort_by: "sort_by_date",
    deleted: false,
    weaken: false
  }
}

export default ({ store, match }) => {
  return new Promise(resolve => {
    
    Promise.all([
      new Promise(async resolve => {
        let [ err, result ] = await loadPostsList({
          id: 'follow',
          filters: general
        })(store.dispatch, store.getState);
        resolve([ err, result ])
      })
      // new Promise(async resolve => {
      //   let [ err, result ] = await loadPostsList({
      //     id: '_follow',
      //     filters: recommend
      //   })(store.dispatch, store.getState);
      //   resolve([ err, result ])
      // })
    ]).then(value=>{
      resolve({ code:200 });
    });

  })
}
