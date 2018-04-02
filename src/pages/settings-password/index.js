import React, { Component } from 'react'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updatePassword } from '../../actions/user'

// components
import Shell from '../../components/shell'
import Meta from '../../components/meta'

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    updatePassword: bindActionCreators(updatePassword, dispatch)
  })
)
export class ResetPassword extends Component {

  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    const { currentPassword } = this.refs
    currentPassword.focus()
  }

  async submit() {
    const self = this
    const { updatePassword } = this.props
    const { currentPassword, newPassword, confirmNewPassword } = this.refs

    if (!currentPassword.value) return currentPassword.focus()
    if (!newPassword.value) return newPassword.focus()
    if (!confirmNewPassword.value) return confirmNewPassword.focus()

    if (newPassword.value != confirmNewPassword.value) {
      alert('新密码两次输入不相同')
      return
    }

    let [err, res] = await updatePassword({
      current_password: currentPassword.value,
      new_password: newPassword.value
    });

    if (res && res.success) {
      Toastify({
        text: '密码修改成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #18c31a, #14a22f)'
      }).showToast();
      
      currentPassword.value = '';
      newPassword.value = '';
      confirmNewPassword.value = '';

    } else {
      Toastify({
        text: err,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    }

    // callback: function(result){
    //   if (!result.success) {
    //     alert(result.error)
    //   } else {
    //     alert('密码修改成功，请重新登录')
    //     window.location.href = '/'
    //     // self.context.router.goBack()
    //   }
    // }

  }

  render() {

    return (
      <div>
        <Meta title='修改密码' />
        <div className="container">

          <div className="list">
            <input type="password" placeholder="当前密码" ref="currentPassword"></input>
            <input type="password" placeholder="新密码" ref="newPassword"></input>
            <input type="password" placeholder="重复新密码" ref="confirmNewPassword"></input>
          </div>

          <div className="list">
            <a className="center" href="javascript:void(0);" onClick={this.submit}>确认修改</a>
          </div>

        </div>
      </div>
    )

  }

}

export default Shell(ResetPassword)
