import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'
import { showSign } from '../../actions/sign'
import BindingPhone from '../binding-phone'

// 纯组件
export class PublishButton extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { me, children, showSign } = this.props
    if (!me || !me._id) return (<span></span>)

    let html = ''

    // if (!me.phone) {
    //   html = (<a href="javascript:void(0)" onClick={()=>{ this.show() }}>{children}</a>)
    // }
    // if (me.phone) {
      html = (<Link to="/write-posts">{children}</Link>)
    // }

    return (<div>
      {html}
      {/*<BindingPhone show={(s)=>{ this.show = s; }} />*/}
    </div>)
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
