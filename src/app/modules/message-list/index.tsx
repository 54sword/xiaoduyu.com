import React from 'react';

// 依赖的外部功能
import { useSelector, useStore } from 'react-redux';
import { loadMessageList } from '@actions/message';
import { getMessageListById } from '@reducers/message';

// 依赖组件
import Item from './components/list-item';

// class
import ListClass from '../../class/list';

// styles
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
  // 没有数据的时候显示内容
  nothing?: any;
}

export default function(props:Props) {

  const { id } = props;
  const store = useStore();
  const list = useSelector((state: any) => {
    return getMessageListById(state, id)
  });
  
  return (<ListClass
    {...props}
    {...list}
    load={params=>loadMessageList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      return (<div key={item._id}>
        {item._create_at ? <div className="text-center text-secondary">{item._create_at}</div> : null}
        <Item message={item} />
      </div>)
    }}
    renderHead={({ loadData }: any)=>{

      if (list && list.more) {
        return (<div styleName="more">
            <a href="javascript:void(0)" onClick={()=> { loadData(); }}>加载更多</a>
          </div>)
      } else {
        return null
      }

    }}
  />)

}