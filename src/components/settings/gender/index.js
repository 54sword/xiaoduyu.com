import React, { Component } from 'react'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../../store/reducers/user'
import { loadUserInfo, updateUser } from '../../../store/actions/user'


@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    updateUser: bindActionCreators(updateUser, dispatch)
  })
)
export default class ResetGender extends Component {

  constructor(props) {
    super(props)
    this.submitResetGender = this.submitResetGender.bind(this)
  }

  async submitResetGender(isMale) {

    const self = this
    const { me, updateUser, loadUserInfo } = this.props

    if (isMale && me.gender == 1 || !isMale && me.gender == 0) {
      this.props.history.goBack();
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
        <div className="card">
          <div className="card-header">名字</div>
          <div className="card-body" style={{padding:'20px'}}>
            <div className="form-group">
              <a className="form-control" href="javascript:void(0)" onClick={()=>{ this.submitResetGender(true) }}>男</a>
            </div>
            <div className="form-group">
              <a className="form-control" href="javascript:void(0)" onClick={()=>{ this.submitResetGender(false) }}>女</a>
            </div>
          </div>
        </div>

      </div>
    )

  }

}
