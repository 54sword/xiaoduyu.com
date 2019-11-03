import React from 'react';

// 依赖的外部功能
// import { bindActionCreators } from 'redux';
import { useSelector, useStore } from 'react-redux';
import { loadLiveList } from '@app/redux/actions/live';
import { getLiveListById } from '@app/redux/reducers/live';

// import ItemRich from './components/item-rich';
// import ItemPoor from './components/item-poor';
import Item from './components/images';

// class
import ListClass from '@app/class/list';

interface Props {
  // 列表id
  id: string;
  // 查询条件
  query: object;
  // 启动滚动加载
  scrollLoad?: boolean;
  // 显示分页
  showPagination?: boolean;
  //
  nothing?: string;
}

export default function(props: Props) {

  const { id } = props;

  const store = useStore();

  const list = useSelector((state: any) => {
    return getLiveListById(state, id)
  });   

  return (<div className="row"><ListClass
    {...props}
    {...list}
    load={(params: any)=>loadLiveList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      // return <>
      //   <Item key={item._id} data={item} />
      //   <Item key={item._id} data={item} />
      //   <Item key={item._id} data={item} />
      //   <Item key={item._id} data={item} />
      // </>
      return (<Item key={item._id} data={item} />)
    }}
  /></div>)

}
