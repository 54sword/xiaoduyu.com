import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPeopleById, loadPeopleList } from '../../actions/people';
import { getPeopleById, getPeopleListByName } from '../../reducers/people';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
// import Nav from '../../components/nav'
// import Subnav from '../../components/subnav'
// import Tabbar from '../../components/tabbar'
// import FollowPeople from '../../components/follow-people'

// style
import styles from './style.scss';

function renderChildren(props) {
  const [ people ] = props.peoples
  return React.Children.map(props.children, child => {
    return React.cloneElement(child, {
      people: people
    })
  })
}

@connect(
  (state, props) => {
    console.log(props);
    return {
    list: getPeopleListByName(state, props.match.params.id)
  }},
  dispatch => ({
    loadPeopleList: bindActionCreators(loadPeopleList, dispatch),
    loadPeopleById: bindActionCreators(loadPeopleById, dispatch)
  })
)
export class People extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentTab: 0
    }
    this.setCurrentTab = this.setCurrentTab.bind(this)
  }

  componentDidMount() {
    const self = this
    const { loadPeopleList, list } = this.props
    const { id, tabName } = this.props.match.params
    // const [ people ] = this.props.peoples

    // console.log(list);

    if (list && list.data && list.data.length > 0) return

    // loadPeopleById({ id })
    loadPeopleList({
      name:id,
      filters: {
        variables: { _id: id }
      }
    })
  }

  setCurrentTab(index) {
    this.setState({
      currentTab: index
    })
  }

  render() {

    let { currentTab } = this.state
    const { list } = this.props
    // const [ people ] = this.props.peoples
    const { setCurrentTab } = this

    const { id } = this.props.match.params

    // let { go } = this.props.location.query
    let go = 1;

    // console.log(list);

    if (!list || !list.data || !list.data[0] || list.loading) {
      return (<div></div>);
    }

    let people = list.data[0];

    // const tabName = this.props.children.props.route.path || null
    const tabName = null

    if (!go) {
      go = -1
    } else {
      go -= 1
    }

    return (
      <div>
        <Meta title={people.nickname} />
        <div className="container">
          <div className={styles.header}>
            <div className={styles.actions}>
              <span className={styles.follow}>
                {/*<FollowPeople people={people} />*/}
              </span>
            </div>
            <img src={people.avatar_url.replace(/thumbnail/, "large")} />
            <div>{people.nickname}</div>
            <div>{people.brief}</div>
          </div>

          <div className={styles.tab}>
            <Link
              className={!tabName ? "active" : null}
              to={`/people/${people._id}/posts`}>
                帖子<span>{people.posts_count > 0 ? people.posts_count : null}</span>
              </Link>
            <Link
              className={tabName == 'follow/posts' ? "active" : null}
              to={`/people/${people._id}/follow/posts`}>
                关注的帖子<span>{people.follow_posts_count > 0 ? people.follow_posts_count : null}</span>
              </Link>
            <Link
              className={tabName == 'comments' ? "active" : null}
              to={`/people/${people._id}/comments`}>
              评论<span>{people.comment_count > 0 ? people.comment_count : null}</span>
              </Link>
            <Link
              className={tabName == 'topics' ? "active" : null}
              to={`/people/${people._id}/topics`}>
              话题<span>{people.follow_topic_count > 0 ? people.follow_topic_count : null}</span>
              </Link>
            <Link
              className={tabName == 'following' ? "active" : null}
              to={`/people/${people._id}/following`}>
              关注的人<span>{people.follow_people_count > 0 ? people.follow_people_count : null}</span>
              </Link>
            <Link
              className={tabName == 'fans' ? "active" : null}
              to={`/people/${people._id}/fans`}>
              粉丝<span>{people.fans_count > 0 ? people.fans_count : null}</span>
              </Link>
          </div>

        </div>

        <div className="container">
          {/*renderChildren(this.props)*/}
        </div>
      </div>
    )

  }

}

export default Shell(People);
