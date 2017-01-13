import React, { Component, PropTypes } from 'react'
// import { Link } from 'react-router'

import styles from './style.scss'

import FollowButton from '../../../follow-people'

class PeopleItem extends Component {

  constructor(props) {
    super(props)
  }

  render () {

    const { people } = this.props

    return (
      <div className={styles['people-item']}>
        <span className={styles.follow}>
          <FollowButton people={people} />
        </span>
        <img className={styles.avatar} src={people.avatar_url} />
        <div>{people.nickname}</div>
        <div>{people.fans_count} 粉丝 | {people.question_count} 提问 ｜ {people.answer_count} 答案</div>
      </div>
    )

  }

}

export default PeopleItem
