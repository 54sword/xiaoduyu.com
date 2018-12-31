import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList } from '../../../store/actions/posts';
import { getPostsById } from '../../../store/reducers/posts';
import { isMember } from '../../../store/reducers/user';

// style
import './index.scss'

// components
import HTMLText from '../../html-text';
// import AdminAction from '../admin-action';
import Follow from '../../follow';
import Like from '../../like';
import EditButton from '../../edit-button';
import ReportMenu from '../../report-menu';
import Share from '../../share';

import Modal from '../../bootstrap/modal';
import Loading from '../../ui/loading';

import PostsDetail from '../../posts/detail';
import CommentList from '../../comment/list';
import EditorComment from '../../editor-comment';

// import connectRedux from '../../../common/connect-redux'


@connect(
  (state, props) => ({
    // posts: getPostsById(state, props.id),
    isMember: isMember(state)
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)
export default class PostsModal extends React.Component {

  // static propTypes = {
  //   id: PropTypes.string.isRequired
  // }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      posts: null,
      posts_id: ''
    }
  }

  componentDidMount() {

    $('#posts-modal').on('show.bs.modal', async e => {
      const { posts_id } = e.relatedTarget;
      // const { loadPostsList } = this.props;

      this.setState({ loading: false, posts_id });

      // let [ err, res ] = await loadPostsList({
      //   id: posts_id,
      //   filters: {
      //     variables: { _id: posts_id }
      //   }
      // });

      // let options = {
      //   loading: false,
      //   posts: null
      // }

      // if (res && res.data && res.data[0]) {
      //   options.posts = res.data[0];
      // }

      // this.setState(options);

      // console.log(err);
      // console.log(res);

    });

    /*
    const { id, loadPostsList } = this.props;

    loadPostsList({
      id,
      filters: {
        variables: { _id: id }
      }
    })
    */
  }

  componentWillUnmount() {
    this.setState({
      loading: true,
      posts_id: ''
    })
  }

  componentWillReceiveProps(props) {
    /*
    if (props.id != this.props.id) {
      this.props = props;
      this.componentDidMount();
    }
    */
  }

  render() {

    // const { posts, isMember } = this.props;

    const { loading, posts_id } = this.state;

    let body = <Loading />;

    if (posts_id) {
      body = (<div>
        <PostsDetail id={posts_id} />
        <CommentList
                name={posts_id}
                filters={{
                  variables: {
                    deleted: false,
                    weaken: false,
                    posts_id: posts_id,
                    parent_id: 'not-exists',
                    page_size:10
                  }
                }}
                />

      <EditorComment posts_id={posts_id} />
      </div>)
    }

    return (<div>
      <Modal
        id="posts-modal"
        // size={true}
        body={body}
        />
    </div>)


    if (!posts) return <div>loading...</div>
    

    return(<div styleName="box">

        <div styleName="head">

          <Link to={`/people/${posts.user_id._id}`}>
            <img styleName="author-avatar" src={posts.user_id.avatar_url} />
            <b>{posts.user_id.nickname}</b>
          </Link>

          <div styleName="menu"><ReportMenu /></div>

          <div>
            <span><Link to={`/topic/${posts.topic_id._id}`}>{posts.topic_id.name}</Link></span>
            {posts.view_count ? <span>{posts.view_count} 浏览</span> : null}
            {posts.like_count ? <span>{posts.like_count} 个赞</span> : null}
            {posts.answers_count ? <span>{posts.answers_count} 个评论</span> : null}
            {posts.follow_count ? <span>{posts.follow_count} 人关注</span> : null}
            <span>{posts._create_at}</span>
          </div>

        </div>

        <h1 styleName="h1">{posts.title}</h1>

        {posts.content_html ?
          <div styleName="detail"><HTMLText content={posts.content_html} hiddenHalf={!isMember && posts.recommend ? true : false} /></div>
          :null}

        <div styleName="actions">
          <Like posts={posts} />
          <Follow posts={posts} />
          <Share posts={posts} />
          <EditButton posts={posts} />
        </div>


      {/* <AdminAction posts={posts} /> */}

    </div>)
  }

}
