import React from 'react';
// import PropTypes from 'prop-types';

// class
import ListClass from '../../class/list';

// redux
// import { bindActionCreators } from 'redux';
import { connect, useStore, useSelector } from 'react-redux';
import { loadBlockList, removeBlock } from '@actions/block';
import { getBlockListById } from '@reducers/block';

// components
// import HTMLText from '@components/html-text';
// import Loading from '@components/ui/loading';

// style
import './index.scss';

interface Props {
  // 列表id
  id: string;
  // 查询条件
  query: object;
  // 启动滚动加载
  scrollLoad?: boolean;
  // 显示分页
  showPagination?: boolean;
  // 渲染项的类型
  itemType?: string;
}

export default function(props: Props) {

  const { id } = props;

  const store = useStore();

  const list = useSelector((state: any) => {
    return getBlockListById(state, id)
  });

  const remove = function(item: any) {
    return async () => {

      let params: any = {}

      if (item.people_id) params.people_id = item.people_id._id;
      if (item.posts_id) params.posts_id = item.posts_id._id;
      if (item.comment_id) params.comment_id = item.comment_id._id;

      let [ err, res ] = await removeBlock({ args: params, id: item._id })(store.dispatch, store.getState);

      if (res && res.success) {
        Toastify({
          text: '取消成功',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
        }).showToast();
      } else if (err && err.message) {
        Toastify({
          text: err.message,
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
      }

    }
  }

  return (<ListClass
    {...props}
    {...list}
    load={params=>loadBlockList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      return (<div key={item._id} className="list-group-item">

        <a
          href="javascript:void(0)"
          styleName="cancel"
          className="btn btn-outline-secondary btn-sm"
          onClick={remove(item)}>取消</a>

        {item.posts_id ?
          item.posts_id.title
          : null}

        {item.people_id ?
          <div styleName="people">
            <img src={item.people_id.avatar_url} />
            {item.people_id.nickname}
          </div>
          : null}

        {/* {item.comment_id ?
          <HTMLText content={item.comment_id.content_html} />
          : null} */}

      </div>)
    }}
  />)

}