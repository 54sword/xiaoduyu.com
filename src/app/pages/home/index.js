import React from 'react';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getTab } from '@reducers/tab';

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import Topics from '@modules/topics';
import AppDownload from '@modules/app-download';
import LinksExchange from '@modules/links-exchange';
import OperatingStatus from '@modules/operating-status';
import Footer from '@modules/footer';
// import MixingFeed from '@modules/mixing-feed';
import HotPostsList from '@modules/hot-posts-list';
import Case from '@modules/case';
import AdsByGoogle from '@modules/adsbygoogle';
import ProfileCard from '@modules/profile-card';
// import Test from '@modules/test';

import PostsList from '@modules/posts-list';
import FeedList from '@modules/feed-list';

// layout
// import ThreeColumns from '../../layout/three-columns';
import TwoColumns from '../../layout/two-columns';

import { googleAdSense } from '@config';

@Shell
@connect(
  (state, props) => ({
    tab: getTab(state)
  }),
  dispatch => ({
    // saveTokenToCookie: bindActionCreators(saveTokenToCookie, dispatch)
  })
)
export default class Home extends React.Component {

  constructor(props) {
    super(props)
  }

  // componentWillReceiveProps(props) {
  //   console.log(this.props.location.params);
  // }

  render() {

    const { tab } = this.props;

    console.log(tab);

    return(<>
      <Meta />

      <TwoColumns>
        
        {/* <>
          <Topics />
          <div className="d-none d-lg-block d-xl-block"><AppDownload /></div>
        </> */}
        
        <>
          
          {tab == '' ? 
            <>
              <Topics />
              <PostsList
              id={'home'}
              filters={{
                variables: {
                  sort_by: "sort_by_date",
                  deleted: false,
                  weaken: false
                }
              }}
              scrollLoad={true}
              showTips={true}
              />
            </>
            : null}

          {tab == 'follow' ?
            <FeedList
            id={'feed'}
            filters={{
              variables: {
                preference: true,
                sort_by: "create_at:-1"
              }
            }}
            scrollLoad={true}
            showTips={true}
            />
            : null}

          {tab == 'favorite' ?
            <PostsList
            id={'favorite'}
            filters={{
              variables: {
                method: 'favorite',
                sort_by: "last_comment_at:-1",
                deleted: false,
                weaken: false
              }
            }}
            scrollLoad={true}
            showTips={true}
            />
            : null}
        </>
        
        <>
          
          {/* <ProfileCard /> */}
          {/* <Link to="/new-posts" className="btn btn-primary btn-block mb-2">+创建交流</Link> */}
          {/* <div style={{marginBottom:10}}>
            <a href="https://geo.itunes.apple.com/cn/app/rss-reader-one/id544358974?l=en&mt=8" target="_blank">
              <img src="/rss-reader-one.png" alt="RSS Reader One" width="250" height="250" />
            </a>
          </div> */}
          {googleAdSense.sidebar ? <AdsByGoogle {...googleAdSense.sidebar} /> : null}
          {/* <HotPostsList /> */}

          <div className="card">
          <div className="card-header">推荐</div>
          <div className="card-body p-0">
            <PostsList
              id={'excellent'}
              itemType={'poor'}
              filters={{
                variables: {
                  sort_by: "sort_by_date",
                  deleted: false,
                  weaken: false,
                  recommend: true
                }
              }}
              scrollLoad={false}
              showTips={false}
              />
          </div>
          </div>

          <div className="card">
          <div className="card-header">近7天热门讨论</div>
          <div className="card-body p-0">
            <PostsList
              id={'hot-home'}
              itemType={'poor'}
              filters={{
                variables: {
                  sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
                  start_create_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7),
                  deleted: false,
                  weaken: false,
                  page_size: 9
                }
              }}
              scrollLoad={false}
              showTips={false}
              />
          </div>
          </div>

          <Case />
          <LinksExchange />
          <OperatingStatus />
          <Footer />
        </>

        {/* <>
          <HotPostsList />
          {googleAdSense.sidebar ? <AdsByGoogle {...googleAdSense.sidebar} /> : null}
        </> */}

      </TwoColumns>
    </>)
  }

}
