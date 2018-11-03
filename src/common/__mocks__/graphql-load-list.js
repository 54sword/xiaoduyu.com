import merge from 'lodash/merge'

export default ({
  dispatch,
  getState,
  reducerName,
  name,
  actionType,
  restart,
  filters,
  schemaName = '',
  processList = data => data,
  cache = false,
  api = '',
  type = 'query',
  // accessToken = '',
  callback = () => {}
}) => {
  return new Promise(async (resolve, reject) => {

    let select = filters.select || ``,
        state = getState(),
        list = state[reducerName][name] || {};

    filters = filters.variables || filters.query || {};

    if (!api) {
      api = schemaName;
    }

    // 让列表重新开始
    if (restart) list = {};

    // 已经加载所有，没有更多了
    if (Reflect.has(list, 'more') && !list.more) {
      resolve([ null, list ]);
      callback([ null, list ]);
      return
    }

    // 如果正在加载中，则阻止本次请求
    if (list.loading) return;

    if (!Reflect.has(list, 'data')) list.data = [];

    // 添加页面size和number
    if (!Reflect.has(list, 'filters')) {
      if (!Reflect.has(filters, 'page_number')) filters.page_number = 1;
      if (!Reflect.has(filters, 'page_size')) filters.page_size = 25;
      filters.page_number = parseInt(filters.page_number);
      filters.page_size = parseInt(filters.page_size);
      list.filters = filters;
    } else {
      // 如果以及存在筛选条件，那么下次请求，进行翻页
      filters = list.filters;
      filters.page_number += 1;
    }

    list.loading = true;

    if (actionType) dispatch({ type: actionType, name, data: list });

    //mock返回数据替代请求
    let err = null;
    let data = [{
      _id: '123',
      name: 'MOCK_LOAD_POSTS',
      brief: 'MOCK_LOAD_POSTS',
      description: 'MOCK_LOAD_POSTS',
      avatar: '',
      background: '',
      follow_count: 0,
      posts_count: 0,
      comment_count: 0,
      sort: 100,
      create_at: '2017-01-28T15:08:36.323Z',
      language: 0,
      recommend: true,
      user_id: '123',
      follow: null,
      parent_id: null,
      children: []
    }];

    if (err) {

      list.loading = false;

      resolve([ null, list ]);
      callback([ null, list ]);

      // resolve([ err ]);
      // callback([ err ]);
      return
    }

    list.data = list.data.concat(processList(merge([], data)));
    list.filters = filters;
    list.loading = false;

    // 如果列表不存在count，那么查询count
    if (!Reflect.has(list, 'count')) {

      let s = Object.assign({}, filters);
      delete s.page_size;
      delete s.page_number;
      delete s.sort_by;

      //mock返回数据替代请求
      let err = null;
      let data = { count: 1, __typename: 'countPosts' };

      // console.log(data);

      if (data) list.count = data.count;

    }

    list.more = list.filters.page_size * list.filters.page_number > list.count ? false : true

    if (actionType) dispatch({ type: actionType, name, data: list });

    resolve([ null, list ]);
    callback([ null, list ]);
  })

}
