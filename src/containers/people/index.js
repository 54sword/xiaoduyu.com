import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPeopleById } from '../../actions/people'
import { getPeopleById } from '../../reducers/people'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import Subnav from '../../components/subnav'
import Tabbar from '../../components/tabbar'
import FollowPeople from '../../components/follow-people'

function renderChildren(props) {
  const [ people ] = props.peoples
  return React.Children.map(props.children, child => {
    return React.cloneElement(child, {
      people: people
    })
  })
}

class People extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentTab: 0
    }
    this.setCurrentTab = this.setCurrentTab.bind(this)
  }

  componentWillMount() {
    const self = this
    const { loadPeopleById, displayNotFoundPage } = this.props
    const { id, tabName } = this.props.params
    const [ people ] = this.props.peoples

    if (people) return

    loadPeopleById({ id })
  }

  componentWillReceiveProps(props) {

    const { loadPeopleById, displayNotFoundPage } = this.props

    if (props && this.props.params.id != props.params.id) {
      loadPeopleById({
        id: props.params.id,
        callback: function(err){
          if (!err.success) {
            // displayNotFoundPage()
          }
        }
      })
    }

  }

  setCurrentTab(index) {
    this.setState({
      currentTab: index
    })
  }

  render() {

    let { currentTab } = this.state
    const [ people ] = this.props.peoples
    const { setCurrentTab } = this

    const { id } = this.props.params

    let { go } = this.props.location.query

    if (!people) {
      return (<div></div>)
    }

    const tabName = this.props.children.props.route.path || null

    if (!go) {
      go = -1
    } else {
      go -= 1
    }

    // <Subnav middle={people.nickname} go={go} />

    return (
      <div>
        <Meta meta={{title:people.nickname}} />
        <Nav />
        <div className="container">
          <div className={styles.header}>
            <div className={styles.actions}>
              <span className={styles.follow}>
                <FollowPeople people={people} />
              </span>
            </div>
            <img src={people.avatar_url.replace(/thumbnail/, "large")} />
            <div>{people.nickname}</div>
            <div>{people.brief}</div>
          </div>
          <div className={styles.tab}>
            <Link className={!tabName ? "active" : null} to={`/people/${people._id}/asks?go=${go}`}>主题 {people.question_count > 0 ? people.question_count : null}</Link>
            <Link className={tabName == 'answers' ? "active" : null} to={`/people/${people._id}/answers?go=${go}`}>回复 {people.answer_count > 0 ? people.answer_count : null}</Link>
            <Link className={tabName == 'communities' ? "active" : null} to={`/people/${people._id}/communities?go=${go}`}>话题 {people.follow_node_count > 0 ? people.follow_node_count : null}</Link>
            <Link className={tabName == 'following' ? "active" : null} to={`/people/${people._id}/following?go=${go}`}>关注 {people.follow_people_count > 0 ? people.follow_people_count : null}</Link>
            <Link className={tabName == 'fans' ? "active" : null} to={`/people/${people._id}/fans?go=${go}`}>粉丝 {people.fans_count > 0 ? people.fans_count : null}</Link>
          </div>
        </div>

        <div className="container">
          {renderChildren(this.props)}
        </div>
      </div>
    )

  }

}

People.contextTypes = {
  router: PropTypes.object.isRequired
}

People.propTypes = {
  peoples: PropTypes.array.isRequired,
  loadPeopleById: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    peoples: getPeopleById(state, props.params.id)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadPeopleById: bindActionCreators(loadPeopleById, dispatch)
  }
}

People = connect(mapStateToProps, mapDispatchToProps)(People)

export default Shell(People)
