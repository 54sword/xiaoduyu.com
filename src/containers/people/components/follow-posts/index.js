import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Shell from '../../../../shell'
// import PeopleList from '../../../../components/people-list'
import FollowPostsList from '../../../../components/follow-posts-list'

// import { loadPeopleById, loadFans } from '../../../../actions/people'

export class FollowPosts extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { people } = this.props

    return (
      <div>
        <FollowPostsList name={people._id} filters={{ user_id: people._id, posts_exsits: 1 }} type={"fans"} />
      </div>
    )

  }

}

export default Shell(FollowPosts)
