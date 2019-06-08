import React, { useEffect } from 'react';

// components
import ContentLoading from '@components/ui/content-loading';
import Pagination from '@components/pagination';

// 加载数据方法的接口
interface Load {
  // 列表id
  id: string,
  // 筛选条件
  filters: {
    // graphql 查询条件
    variables: object,
    // graphql 选择返回的字段
    select: string
  },
  // 是否让列表重新开始，清空之前的数据重新开始
  restart: boolean
}

// 组件的props接口
interface Props {
  // 列表id
  id: string,
  // graphql 查询条件
  query: {
    page_number?: number
  },
  // graphql 选择返回的字段
  select: string,
  // 加载数据的方法
  load: (load: Load) => void,
  // 列表的数据
  data: Array<any>,
  // 是否加载中
  loading: boolean,
  // 数据总数
  count: number,
  // 是否可以加载更多数据
  more: boolean,
  // 是否显示分页
  showPagination: boolean,
  // 是否支持跳动加载数据
  scrollLoad: boolean,
  // 数据结果为空时候的提醒文案
  nothingTips: string,
  // 查询条件
  filters: {
    page_size: number,
    page_number: number
  },
  // 渲染列表的小项
  renderItem: (data: Array<any>)=>{}
}

export default function List({
    id,
    query,
    select =  '',
    load,
    data = [],
    loading = true,
    count = 0,
    more = true,
    showPagination = false,
    scrollLoad = false,
    nothingTips = '没有更多数据',
    filters,
    renderItem
}: Props): object {

  const loadData = (restart = false) => {
    load({ id, filters: { variables: query, select }, restart });
  }

  useEffect(() => {
    if (data.length == 0 && more) loadData();
    if (scrollLoad) ArriveFooter.add(id, loadData);
    return () => {
      if (scrollLoad) ArriveFooter.remove(id);
    };
  });

  // 没有数据
  if (!loading && data && data.length == 0 && !more) {
    return (<div className="card">
      <div className="card-body text-center text-secondary">
        {nothingTips}
      </div>
    </div>)
  }

  return (<>

    {data.map(item=>renderItem(item))}

    {loading && showPagination ||
      more && scrollLoad ?
      <ContentLoading /> : null}

    {showPagination && filters ?
      <Pagination
        count={count || 0}
        pageSize={filters.page_size || 0}
        pageNumber={filters.page_number || 0}
        onSelect={s=>{
          query.page_number = s;
          loadData(true);
        }}
      />
      : null}

  </>)

}
