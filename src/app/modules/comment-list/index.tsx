import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect, useSelector, useStore } from 'react-redux';
import { getCommentListById } from '@reducers/comment';
import { loadCommentList } from '@actions/comment';

// components
import CommentItem from '@modules/comment-list/components/list-item';
// import Pagination from '@components/pagination';
// import Loading from '@components/ui/full-loading';

// class
import ListClass from '../../class/list';

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
    return getCommentListById(state, id)
  });

  return (<ListClass
    {...props}
    {...list}
    load={params=>loadCommentList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      return <CommentItem comment={item} key={item._id} />
    }}
  />)

}

/*
@connect(
  (state, props) => ({
    list: getCommentListById(state, props.name)
  }),
  dispatch => ({
    loadCommentList: bindActionCreators(loadCommentList, dispatch)
  })
)
export default class CommentList extends Component {

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  static defaultProps = {
    // 是否显示翻页
    showPagination: false,
    // 没有数据时候的提示
    nothingTips: '没有更多数据'
  }

  constructor(props) {
    super(props)
    this.state = {};
    this.loadList = this.loadList.bind(this);
  }

  componentDidMount() {
    // const { list } = this.props;
    // if (!list.data || list.data.length == 0) 
    this.loadList();
    // ArriveFooter.add(this.state.name, (this.loadList))
  }

  // componentWillUnmount() {
    // ArriveFooter.remove(this.state.name)
  // }

  loadList(restart = true) {
    const { name, filters, loadCommentList } = this.props;
    loadCommentList({ name, filters, restart });
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      const { loadCommentList } = this.props;
      loadCommentList({ name: props.name, filters: props.filters, restart: true });
    }
  }

  render () {
    
    const { list, showPagination, nothingTips } = this.props;
    const { data, loading, more, filters = {}, count } = list;

    // 没有结果
    if (!loading && data && data.length == 0 && !more) {
      return (<div className="card">
        <div className="card-body text-center text-secondary">
          {nothingTips}
        </div>
      </div>)
    }
    
    return (
      <div ref={e=>this.state.dom=e}>

        <div className="list-group">
          {data && data.map((comment)=>{
            return (<CommentItem comment={comment} key={comment._id} />)
          })}
        </div>

        {loading ? <Loading /> : null}

        {showPagination ?
          <Pagination
            count={count || 0}
            pageSize={filters.page_size || 0}
            pageNumber={filters.page_number || 0}
            onChoose={(e)=>{
              const { dom } = this.state;
              $(window).scrollTop($(dom).offset().top - 100);
              this.props.filters.variables.page_number = e;
              this.loadList(true);
            }}
            />
          : null}

      </div>
    )
  }
}
*/