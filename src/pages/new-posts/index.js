import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList } from '../../store/actions/posts';
import { getPostsById } from '../../store/reducers/posts';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsEditor from '../../components/editor-posts';
import Loading from '../../components/ui/loading';

@Shell
@connect(
  (state, props) => ({
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)
export default class createPosts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      loading: true
    }

    this.successCallback = this.successCallback.bind(this)
  }

  async componentDidMount() {

    const { posts_id } = this.props.location.params;
    const { loadPostsList, notFoundPgae } = this.props;

    if (posts_id) {

      let [ err, res ] = await loadPostsList({
        id: 'edit_'+posts_id,
        filters: {
          variables: { _id: posts_id },
          select: `
          _id
          comment_count
          content
          content_html
          create_at
          deleted
          device
          follow_count
          ip
          last_comment_at
          like_count
          recommend
          sort_by_date
          title
          topic_id{
            _id
            name
          }
          type
          user_id{
            _id
            nickname
            brief
            avatar_url
          }
          verify
          view_count
          weaken
          follow
          like
          `
        }
      });

      if (!res || !res.data || !res.data[0]) {
        notFoundPgae('主题不存在');
      } else {
        this.setState({
          loading: false,
          posts: res.data[0]
        })
      }

    } else {
      this.setState({
        loading: false
      })
    }

  }

  successCallback(posts) {

    const { posts_id } = this.props.location.params;

    if (posts_id) {
      this.props.history.push(`/posts/${posts_id}`)
    } else {
      this.props.history.push(`/posts/${posts._id}`)
    }

  }

  render() {

    const { loading, posts } = this.state;

    if (loading) return <Loading />

    return (<div>
      <Meta title={'创建帖子'} />
      {posts ?
        <PostsEditor successCallback={this.successCallback} {...posts} /> :
        <PostsEditor successCallback={this.successCallback} />}
    </div>)
  }

}
