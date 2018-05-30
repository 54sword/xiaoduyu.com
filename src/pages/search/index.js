import React from 'react';
import { withRouter } from 'react-router';

// redux
import { loadPostsList } from '../../actions/posts';
import parseUrl from '../../common/parse-url';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
// import Sidebar from '../../components/sidebar';
// import Bundle from '../../components/bundle';
// import NewPostsButton from '../../components/new-posts-button';

// style
// import CSSModules from 'react-css-modules';
// import styles from './style.scss';

let general = {
  variables: {
    sort_by: "create_at",
    deleted: false,
    weaken: false
  }
}

@withRouter
export class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      q: ''
    }
    this.search = this.search.bind(this)
  }

  componentDidMount() {

    const { q = '' } = this.props.location.params || {};
    const { search } = this.refs;

    this.setState({
      q: decodeURIComponent(q)
    });

    search.value = q;
  }
  
  componentWillReceiveProps(props) {
    const { search } = this.refs;
    // 组件url发生变化
    if (this.props.location.pathname + this.props.location.search != props.location.pathname + props.location.search) {
      let params = props.location.search ? parseUrl(props.location.search) : {};
      const { q = '' } = params;
      search.value = q;
      this.setState({
        q: decodeURIComponent(q)
      });
    }
  }

  search(event) {
    event.preventDefault();
    const { search } = this.refs;

    if (!search.value) return search.focus();

    this.props.history.push(`/search?q=${search.value}`);
    this.setState({ q: search.value });
  }

  render() {

    const { q } = this.state;

    return(<div>
      <Meta title="搜索" />

      <form className="container" onSubmit={this.search}>
        <div className="row mb-2">

          <div className="col-10">
            <input type="text" className="form-control" ref="search" placeholder="输入关键词搜索" />
          </div>

          <div className="col-2">
            <button type="submit" className="btn btn-block btn-primary">搜索</button>
          </div>

        </div>
      </form>

      {q ?
        <PostsList
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
          />
        : null}

    </div>)
  }

}

export default Shell(Search);
