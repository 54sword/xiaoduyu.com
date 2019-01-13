import React from 'react';
import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadBlockList, removeBlock } from '@actions/block';
import { getBlockListById } from '@reducers/block';

// components
import HTMLText from '@components/html-text';
import Loading from '@components/ui/loading';

// style
import './index.scss';

@connect(
  (state, props) => ({
    list: getBlockListById(state, props.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadBlockList, dispatch),
    removeBlock: bindActionCreators(removeBlock, dispatch)
  })
)
export class BlockList extends React.Component {

  static defaultProps = {
    // 滚动底部加载更多
    scrollLoad: false
  }

  static propTypes = {
    // 列表id
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    const { list, id, scrollLoad } = this.props;
    if (!list.data) this.loadDate();
    if (scrollLoad) ArriveFooter.add(id, this.loadDate);
  }

  componentWillUnmount() {
    const { id, scrollLoad } = this.props;
    if (scrollLoad) ArriveFooter.remove(id);
  }

  componentWillReceiveProps(props) {
    if (props.id != this.props.id) {
      this.componentWillUnmount();
      this.props = props;
      this.componentDidMount();
    }
  }

  async loadDate(restart = false) {
    const { id, filters, loadList } = this.props;
    let _filters = JSON.parse(JSON.stringify(filters));
    await loadList({ id, args: _filters, restart });
  }

  remove(item) {
    return async () => {
      const { removeBlock } = this.props;

      let params = {}

      if (item.people_id) params.people_id = item.people_id._id;
      if (item.posts_id) params.posts_id = item.posts_id._id;
      if (item.comment_id) params.comment_id = item.comment_id._id;

      let [ err, res ] = await removeBlock({ args: params, id: item._id });

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

  render() {

    const { data = [], loading, more, count } = this.props.list;

    return(<div className="list-group">
      {data.map(item=>{
        return (<div key={item._id} className="list-group-item">

          <a
            href="javascript:void(0)"
            styleName="cancel"
            className="btn btn-outline-secondary btn-sm"
            onClick={this.remove(item)}>取消</a>

          {item.posts_id ?
            item.posts_id.title
            : null}

          {item.people_id ?
            <div styleName="people">
              <img src={item.people_id.avatar_url} />
              {item.people_id.nickname}
            </div>
            : null}

          {item.comment_id ?
            <HTMLText content={item.comment_id.content_html} />
            : null}

        </div>)
      })}

      {!loading && !more && data.length == 0 ? '没有数据' : null}

      {loading ? <Loading /> : null}

    </div>)
  }

}

export default BlockList;
