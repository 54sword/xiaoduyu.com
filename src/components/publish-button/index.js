import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'
import { showSign } from '../../actions/sign'

// 纯组件
export class PublishButton extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { me, children, showSign } = this.props
    if (!me || !me._id) return (<span></span>)
    if (!me.phone) return (<Link to="/write-posts">{children}</Link>)
    if (me.phone) return (<Link to="/settings/binding-phone">{children}</Link>)
    // if (me.phone) return (<a href="javascript:void(0)" onClick={showSign}>{children}</a>)
  }

}

PublishButton.propTypes = {
  me: PropTypes.object.isRequired,
  showSign: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    me: getProfile(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showSign: bindActionCreators(showSign, dispatch)
  }
}

PublishButton = connect(mapStateToProps,mapDispatchToProps)(PublishButton)

export default PublishButton
