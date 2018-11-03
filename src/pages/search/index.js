import React from 'react';
import { withRouter } from 'react-router';

// redux
import { loadPostsList } from '../../store/actions/posts';
import parseUrl from '../../common/parse-url';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
import PeopleList from '../../components/people/list';
// import Sidebar from '../../components/sidebar';
// import Bundle from '../../components/bundle';
// import NewPostsButton from '../../components/new-posts-button';

// style
import './style.scss';

let general = {
  variables: {
    sort_by: "create_at",
    deleted: false,
    weaken: false
  }
}

@Shell
@withRouter
export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      q: '',
      type: ''
    }
    this.search = this.search.bind(this);
    this.switchType = this.switchType.bind(this);
  }

  componentDidMount() {

    const { q = '', type = '' } = this.props.location.params || {};
    const { search } = this.refs;

    this.setState({
      type,
      q: decodeURIComponent(q)
    });

    search.value = decodeURIComponent(q);
  }

  componentWillReceiveProps(props) {
    const { search } = this.refs;
    // 组件url发生变化
    if (this.props.location.pathname + this.props.location.search != props.location.pathname + props.location.search) {
      let params = props.location.search ? parseUrl(props.location.search) : {};
      const { q = '', type = '' } = params;
      search.value = decodeURIComponent(q);
      this.setState({
        type,
        q: decodeURIComponent(q)
      });
    }
  }

  search(event) {
    event.preventDefault();
    const { search } = this.refs;
    const { type } = this.state;

    if (!search.value) return search.focus();

    this.props.history.push(`/search?q=${search.value}${type && type == 'user' ? '&type=user' : '' }`);
    this.setState({ q: search.value });
  }

  switchType(type) {

    const { q } = this.state;

    if (!type) {
      this.props.history.push(`/search?q=${q}`);
    } else {
      this.props.history.push(`/search?q=${q}&type=${type}`);
    }

  }

  render() {

    const self = this;
    const { q, type } = this.state;

    return(<div>
      <Meta title="搜索" />

      <form className="container" onSubmit={this.search}>
        <div className="row mb-2">

          <div className="col-9">
            <input type="text" className="form-control" ref="search" placeholder="输入关键词搜索" />
          </div>

          <div className="col-3">
            <button type="submit" className="btn btn-block btn-primary">搜索</button>
          </div>

        </div>
      </form>

      <ul className="nav" styleName="tab-bar">
        <li className="nav-item">
          <a className="nav-link" styleName={type == '' ? 'active' : null} href="javascript:void(0)" onClick={()=>{ self.switchType(''); }}>帖子</a>
        </li>
        <li className="nav-item">
          <a className="nav-link"  styleName={type == 'user' ? 'active' : null} href="javascript:void(0)" onClick={()=>{ self.switchType('user'); }}>用户</a>
        </li>
      </ul>

      {(()=>{
        if (!q) return

        if (!type) {
          return (<PostsList
            id={q}
            filters={{
              variables: {
                title: q,
                sort_by: "create_at",
                deleted: false,
                weaken: false
              }
            }}
            scrollLoad={true}
            />)
        } else if (type == 'user') {
          return (<PeopleList
            name={q}
            filters={{
              variables: {
                nickname: q
              }
            }}
            />)
        }

      })()}

    </div>)
  }

}
