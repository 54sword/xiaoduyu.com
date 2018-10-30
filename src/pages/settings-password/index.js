import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updatePassword } from '../../store/actions/user';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';

@Shell
@connect(
  (state, props) => ({
  }),
  dispatch => ({
    updatePassword: bindActionCreators(updatePassword, dispatch)
  })
)
export default class ResetPassword extends Component {

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

        <div className="card">
          <div className="card-header">修改密码</div>
          <div className="card-body" style={{padding:'20px'}}>

            <div className="form-group">
              <input type="password" className="form-control" placeholder="当前密码" ref="currentPassword"></input>
            </div>

            <div>
              <Link to="/forgot">忘记当前密码？找回密码</Link>
              <br /><br />
            </div>

            <div className="form-group">
              <input type="password" className="form-control" placeholder="新密码" ref="newPassword"></input>
            </div>

            <div className="form-group">
              <input type="password" className="form-control" placeholder="重复新密码" ref="confirmNewPassword"></input>
            </div>

            <a className="btn btn-primary" href="javascript:void(0);" onClick={this.submit}>提交</a>

          </div>

        </div>

      </div>
    )

  }

}
