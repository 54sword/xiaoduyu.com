import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import Actions from '../actions'

class PeopleItem extends Component {

  constructor(props) {
    super(props)
  }

  render () {

    const { people, key } = this.props

    let time = new Date(people.banned_to_post).getTime() - new Date().getTime()
    if (time > 0) {
      time = parseInt(time / (1000 * 60))
    } else if (time < 0) {
      time = 0
    }

    let source = {
      0: 'iPhone',
      1: 'iPad',
      2: 'Android',
      3: 'H5',
      4: '网站',
      5: 'iOS'
    }

    let background = ''
    
    if (time > 0) background = 'list-group-item-secondary'
    if (people.blocked) background = 'list-group-item-danger'

    return (<div key={key} className={`list-group-item ${background}`}>
      <div className="row">
        <div className="col-sm-4">
          <i className="load-demand" data-load-demand={`<img class=${styles.avatar} src=${people.avatar_url} />`}></i>
          <div><Link to={`/people/${people._id}`}>{people.nickname}</Link></div>
          <div>{people.brief}</div>
        </div>

        <div className="col-sm-2">
          {people.block_posts_count ? <p>屏蔽了 {people.block_posts_count} 个帖子</p> : null}
          {people.block_people_count ? <p>屏蔽了 {people.block_people_count} 个用户</p> : null}
          {people.follow_posts_count ? <p>关注了 {people.follow_posts_count} 个帖子</p> : null}
          {people.follow_topic_count ? <p>关注了 {people.follow_topic_count} 个话题</p> : null}
          {people.follow_people_count ? <p>关注了 {people.follow_people_count} 个用户</p> : null}
        </div>

        <div className="col-sm-2">
          最近一次登陆：{people._last_sign_at}<br />
          创建日期：{people._create_at}<br />
          修改昵称：{people._nickname_reset_at}<br />
        </div>

        <div className="col-sm-2">
          {source[people.source]}
        </div>

        <div className="col-sm-2">
          <Actions people={people} />
        </div>

      </div>
    </div>)
  }

}

PeopleItem = CSSModules(PeopleItem, styles)

export default PeopleItem
