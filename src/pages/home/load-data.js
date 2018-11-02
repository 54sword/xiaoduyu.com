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

  });
}
