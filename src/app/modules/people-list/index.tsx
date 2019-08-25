import React from 'react'

// redux
import { useSelector, useStore } from 'react-redux';
import { loadPeopleList } from '@app/redux/actions/people'
import { getPeopleListById } from '@app/redux/reducers/people'

// components
import PeopleItem from './components/list-item';
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
  // 没有数据的时候显示内容
  nothing?: any;
}

export default function(props:Props) {

  const { id } = props;
  const store = useStore();
  const list = useSelector((state: any) => {
    return getPeopleListById(state, id)
  });
  
  return (<ListClass
    {...props}
    {...list}
    load={(params: any)=>loadPeopleList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      return (<div key={item._id}>
        <PeopleItem people={item} />
      </div>)
    }}
    // renderHead={({ loadData }: any)=>{

    //   if (list && list.more) {
    //     return (<div className="text-center pt-3 pb-3">
    //         <a href="javascript:void(0)" onClick={()=> { loadData(); }}>加载更多</a>
    //       </div>)
    //   } else {
    //     return null
    //   }

    // }}
  />)

}