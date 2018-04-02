import React, { Component } from 'react'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'
import { updateUser, loadUserInfo } from '../../actions/user'

// components
import Shell from '../../components/shell'
import Meta from '../../components/meta'

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    updateUser: bindActionCreators(updateUser, dispatch)
  })
)
export class ResetNickname extends Component {
  
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    const { nickname } = this.refs;
    nickname.focus();
  }

  async submit() {

    const self = this
    const { updateUser, loadUserInfo } = this.props
    const { nickname } = this.refs

    if (!nickname.value) {
      nickname.focus()
      return
    }

    let [ err, result ] = await updateUser({
      nickname: nickname.value
    });

    loadUserInfo({});
  }

  render() {

    const { me } = this.props

    return (
      <div>
        <Meta title='名字' />

        <div className="container">

          <div className="list">
            <input type="text" defaultValue={me.nickname} ref="nickname" placeholder="请输入你的名字"></input>
          </div>

          <div className="list">
            <a className="center" href="javascript:void(0);" onClick={this.submit}>提交</a>
          </div>

        </div>
      </div>
    )

  }

}

export default Shell(ResetNickname)
