import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList } from '../../store/actions/posts';

import { getPostsTips } from '../../store/reducers/website';
import { loadNewPosts } from '../../store/actions/posts';
import { getProfile } from '../../store/reducers/user';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import FeedList from '../../components/feed/list';
import PostsList from '../../components/posts/list';
import Sidebar from '../../components/sidebar';
import NewPostsButton from '../../components/new-posts-button';
import Box from '../../components/box';


// style
import './style.scss';


let general = {
  variables: {
    // method: 'user_follow',
    sort_by: "create_at:-1"
    // deleted: false,
    // weaken: false
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

@Shell
@connect(
  (state, props) => ({
    me: getProfile(state),
    postsTips: getPostsTips(state)
  }),
  dispatch => ({
    loadNewPosts: bindActionCreators(loadNewPosts, dispatch)
  })
)
export default class Follow extends React.Component {

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

      {/*
      <NewPostsButton />

      {tips ? <div onClick={()=>{ loadNewPosts(); }} styleName="unread-tip">有新的帖子</div> : null}

      <PostsList
        id={'follow'}
        filters={general}
        scrollLoad={true}
        />
      */}


      <Box>

        <div>
          {tips ? <div onClick={()=>{ loadNewPosts(); }} styleName="unread-tip">有新的帖子</div> : null}
            <FeedList
              id={'follow'}
              filters={general}
              scrollLoad={true}
              />
        </div>

        <Sidebar
          recommendPostsDom={(<PostsList
            id={'_follow'}
            itemName="posts-item-title"
            filters={{
              variables: {
                method: 'user_follow',
                sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
                deleted: false,
                weaken: false,
                page_size: 10,
                start_create_at: (new Date().getTime() - 1000 * 60 * 60 * 24 * 30)+''
              }
            }}
            />)}
          />

      </Box>

      {/*
        <div className="container">
          <div className="row">
            <div className="col-md-8">


            </div>
            <div className="col-md-4">
              <Sidebar
                recommendPostsDom={(<PostsList
                  id={'_follow'}
                  itemName="posts-item-title"
                  filters={{
                    variables: {
                      method: 'user_follow',
                      sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
                      deleted: false,
                      weaken: false,
                      page_size: 10,
                      start_create_at: (new Date().getTime() - 1000 * 60 * 60 * 24 * 30)+''
                    }
                  }}
                  />)}
                />
            </div>
          </div>
        </div>
      */}

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
