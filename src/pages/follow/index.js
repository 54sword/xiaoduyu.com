import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList } from '../../actions/posts';
import { getPostsTips } from '../../reducers/website';
import { loadNewPosts } from '../../actions/posts';
import { getProfile } from '../../reducers/user';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
import Sidebar from '../../components/sidebar';
import NewPostsButton from '../../components/new-posts-button';


// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';


let general = {
  variables: {
    method: 'user_follow',
    sort_by: "sort_by_date",
    deleted: false,
    weaken: false
  }
}

let recommend = {
  variables: {
    method: 'user_follow',
    sort_by: "comment_count,like_count,sort_by_date",
    deleted: false,
    weaken: false,
    page_size: 10,
    start_create_at: (new Date().getTime() - 1000 * 60 * 60 * 24 * 30) + ''
  },
  select: `
    _id
    title
    user_id{
      _id
      avatar_url
    }
  `
}

@connect(
  (state, props) => ({
    me: getProfile(state),
    postsTips: getPostsTips(state)
  }),
  dispatch => ({
    loadNewPosts: bindActionCreators(loadNewPosts, dispatch)
  })
)
@CSSModules(styles)
export class Follow extends React.Component {

  static loadData({ store, match }) {
    return new Promise(resolve => {

      Promise.all([
        new Promise(async resolve => {
          let [ err, result ] = await loadPostsList({
            id: 'follow',
            filters: general
          })(store.dispatch, store.getState);
          resolve([ err, result ])
        }),
        new Promise(async resolve => {
          let [ err, result ] = await loadPostsList({
            id: '_follow',
            filters: recommend
          })(store.dispatch, store.getState);
          resolve([ err, result ])
        })
      ]).then(value=>{
        resolve({ code:200 });
      });

    })
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    const { me, postsTips, loadNewPosts } = this.props;

    if (postsTips['/follow'] && new Date(postsTips['/follow']).getTime() > new Date(me.last_find_posts_at).getTime()) {
      loadNewPosts();
    }

  }

  render() {

    const self = this;
    const { me, postsTips, loadNewPosts } = this.props;
    let tips = false;

    if (postsTips['/follow'] && new Date(postsTips['/follow']).getTime() > new Date(me.last_find_posts_at).getTime()) {
      tips = true;
    }

    return(<div>

      <Meta title="关注" />


      <NewPostsButton />

      {tips ? <div onClick={()=>{ loadNewPosts(); }} styleName="unread-tip">有新的帖子</div> : null}

      <PostsList
        id={'follow'}
        filters={general}
        scrollLoad={true}
        />

      {/*
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <NewPostsButton />
            {tips ? <div onClick={()=>{ loadNewPosts(); }} styleName="unread-tip">有新的帖子</div> : null}
            <PostsList
              id={'follow'}
              filters={general}
              scrollLoad={true}
              />
          </div>
          <div className="col-md-3">
            <Sidebar
              recommendPostsDom={(<PostsList
                id={'_follow'}
                itemName="posts-item-title"
                filters={recommend}
                />)}
              />
          </div>
        </div>
      </div>
      */}


    </div>)
  }

}

export default Shell(Follow);
