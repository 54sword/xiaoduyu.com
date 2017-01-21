import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showSign } from '../../actions/sign'
import { getAccessToken } from '../../reducers/user'
import { like, unlike } from '../../actions/like'

class LikeButton extends Component {

  constructor(props) {
    super(props)
    this.handleLike = this.handleLike.bind(this)
  }

  handleLike() {

    const self = this
    const { like, unlike } = this.props
    const { comment, answer } = this.props
    const target = comment || answer
    const status = target.like,
          count = target.like_count,
          targetId = target._id
    let type = ''

    if (comment) {
      type = 'comment'
    } else if (answer) {
      type = 'answer'
    }

    if (status) {

      unlike({
        type: type,
        target_id: targetId
      }, (result) => {

        if (!result.success) {
          alert(result.error)
          return
        }

      })

    } else {

      like({
        type: type,
        target_id: targetId,
        mood: 1
      }, (result) => {

        if (!result.success) {
          alert(result.error)
          return
        }

      })

    }

  }

  render () {

    const { answer, comment } = this.props
    const { isSignin, showSign } = this.props
    const { like_count, like } = answer || comment

    if (!isSignin) {
      return (<span></span>)
      // return (<a href="javascript:void(0)" onClick={showSign}>赞 {like_count && like_count > 0 ? like_count : null}</a>)
    }

    return (
      <a
        href="javascript:void(0)"
        className={like ? 'black-10' : ''}
        onClick={()=>{this.handleLike()}}>
        {like ? "已赞" : '赞'}
        </a>
    )
  }
}

LikeButton.propTypes = {
  showSign: PropTypes.func.isRequired,
  isSignin: PropTypes.bool.isRequired,
  like: PropTypes.func.isRequired,
  unlike: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  return {
    isSignin: getAccessToken(state) ? true : false
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    showSign: bindActionCreators(showSign, dispatch),
    like: bindActionCreators(like, dispatch),
    unlike: bindActionCreators(unlike, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LikeButton)
