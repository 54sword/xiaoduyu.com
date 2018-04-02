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

    loadUserInfo({});

    // callback: function(res){
    //   if (!res.success) {
    //     alert(res.error)
    //   } else {
    //
    //     alert('修改成功')
    //     self.context.router.goBack()
    //   }
    // }

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
