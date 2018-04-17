import React, { Component } from 'react'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'
import { loadUserInfo, updateUser } from '../../actions/user'

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
export class ResetGender extends Component {

  constructor(props) {
    super(props)
    this.submitResetGender = this.submitResetGender.bind(this)
  }

  async submitResetGender(isMale) {

    const self = this
    const { me, updateUser, loadUserInfo } = this.props

    if (isMale && me.gender == 1 || !isMale && me.gender == 0) {
      return
    }

    let [err, res] = await updateUser({
      gender: isMale ? 1 : 0
    });

    if (err) {

      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    } else {
      Toastify({
        text: '修改成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();
      this.props.history.goBack();
    }

    loadUserInfo({});

  }

  render() {

    const { me } = this.props

    return (
      <div>
        <Meta title='修改性别' />
        <div className="container">
          <div className="list">
            <a className={me.gender == 1 ? "hook" : ""} href="javascript:void(0)" onClick={()=>{ this.submitResetGender(true) }}>男</a>
            <a className={me.gender == 0 ? "hook" : ""} href="javascript:void(0)" onClick={()=>{ this.submitResetGender(false) }}>女</a>
          </div>
        </div>
      </div>
    )

  }

}

export default Shell(ResetGender)
