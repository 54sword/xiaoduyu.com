import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

import styles from './style.scss'

import arriveFooter from '../../common/arrive-footer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showSign } from '../../actions/sign'
import { getAccessToken } from '../../reducers/user'
import { loadCommentList } from '../../actions/comment'
import { getCommentListByName } from '../../reducers/comment'

import ListLoading from '../list-loading'
import AnswerItem from '../comment-item'

class AnswerList extends Component {

  constructor(props) {
    super(props)

    const { name, filters } = this.props

    this.state = {
      name: name,
      filters: filters
    }
    this.triggerLoad = this._triggerLoad.bind(this)
  }

  componentWillMount() {

    const self = this
    const { loadCommentList, commentList } = this.props

    if (!commentList.data) {
      self.triggerLoad()
    }

    arriveFooter.add(this.state.name, ()=>{
      self.triggerLoad()
    })

  }

  componentWillUnmount() {
    arriveFooter.remove(this.state.name)
  }

  _triggerLoad(callback) {
    const { loadCommentList } = this.props
    const { name, filters } = this.state
    loadCommentList({ name, filters })
  }

  render () {

    let { commentList, isSignin, showSign } = this.props

    if (!commentList.data) {
      return (<div></div>)
    }

    return (
      <div name="comments">
        <div className="container">
          <div className={styles.answers}>
            {commentList.data.map((answer)=>{
              return (<div key={answer._id}><AnswerItem answer={answer} /></div>)
            })}
          </div>

          {commentList.data.length == 0 ?
            <div className={styles.nothing}>目前尚无回复</div>
          : <ListLoading loading={commentList.loading} more={commentList.more} handleLoad={this.triggerLoad} />}

        </div>
      </div>
    )
  }
}

AnswerList.propTypes = {
  commentList: PropTypes.object.isRequired,
  loadCommentList: PropTypes.func.isRequired,
  showSign: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const name = props.name
  return {
    commentList: getCommentListByName(state, name),
    isSignin: getAccessToken(state)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    showSign: bindActionCreators(showSign, dispatch),
    loadCommentList: bindActionCreators(loadCommentList, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerList)
