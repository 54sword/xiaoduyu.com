import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './style.scss'

import FollowButton from '../follow-people'

class PeopleItem extends Component {

  constructor(props) {
    super(props)
  }
  
  render () {

    const { people } = this.props

    return (
      <Link to={`/people/${people._id}`}>
        <div className={styles['people-item']}>
          <span className={styles.follow}>
            <FollowButton people={people} />
          </span>
          <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${people.avatar_url} />`}></i>
          <div>{people.nickname}</div>
          <div>
            {people.fans_count > 0 ? <span>{people.fans_count}粉丝</span> : null}
            {people.posts_count > 0 ? <span>{people.posts_count}帖子</span> : null}
            {people.comment_count > 0 ? <span>{people.comment_count}评论</span> : null}
          </div>
        </div>
      </Link>
    )

  }

}

export default PeopleItem
