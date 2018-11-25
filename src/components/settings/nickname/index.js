import React, { Component } from 'react'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../../store/reducers/user'
import { updateUser, loadUserInfo } from '../../../store/actions/user'

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    updateUser: bindActionCreators(updateUser, dispatch)
  })
)
export default class ResetNickname extends Component {

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
            <div>
              <input type="text" className="form-control" defaultValue={me.nickname} ref="nickname" placeholder="请输入你的名字"></input>
            </div>

            <br />

            <div>
              <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.submit}>提交</a>
            </div>
            <br />

          </div>
        </div>

      </div>
    )

  }

}
