import React from 'react';
import { withRouter } from 'react-router';

import parseUrl from '../../common/parse-url';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
import PeopleList from '../../components/people/list';

import Box from '../../components/box';
import Sidebar from '../../components/sidebar';

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

    search.focus();
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

    const { q, type } = this.state;

    return(<Box><div>

      <Meta title="搜索" />

      <form onSubmit={this.search}>
        <div className="input-group mb-3">
          <input type="text" className="form-control" ref="search" placeholder="输入关键词搜索" />
          <div className="input-group-append">
            <button type="submit" styleName="search-button" className="btn btn-block btn-primary">搜索</button>
          </div>
        </div>
      </form>

      <div className="nav nav-pills nav-justified" styleName="tab-bar">
        <a className={`nav-link ${type == '' ? 'active' : ''}`} href="javascript:void(0)" onClick={()=>{ this.switchType(''); }}>帖子</a>
        <a className={`nav-link ${type == 'user' ? 'active' : ''}`}  href="javascript:void(0)" onClick={()=>{ this.switchType('user'); }}>用户</a>
      </div>

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
      
    </div>

    <Sidebar showFooter={false}>
      <div></div>
    </Sidebar>

    </Box>)
  }

}
