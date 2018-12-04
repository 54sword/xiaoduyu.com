import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updatePassword } from '../../../store/actions/user';
import { getProfile, getUnlockToken } from '../../../store/reducers/user';

@connect(
  (state, props) => ({
    me: getProfile(state),
    unlockToken: getUnlockToken(state)
  }),
  dispatch => ({
    updatePassword: bindActionCreators(updatePassword, dispatch)
  })
)
export default class ResetPassword extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false
    };
    this.submit = this.submit.bind(this);
    this.show = this.show.bind(this);
  }

  async submit(event) {

    const { updatePassword, unlockToken } = this.props;
    const { newPassword, confirmNewPassword } = this.state;

    if (!newPassword.value) return newPassword.focus()
    if (!confirmNewPassword.value) return confirmNewPassword.focus()

    if (newPassword.value != confirmNewPassword.value) {
      alert('新密码两次输入不相同')
      return
    }

    let [err, res] = await updatePassword({
      new_password: newPassword.value,
      unlock_token: unlockToken || ''
    });

    if (res && res.success) {
      Toastify({
        text: '密码修改成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #18c31a, #14a22f)'
      }).showToast();

      newPassword.value = '';
      confirmNewPassword.value = '';

      this.setState({
        show: false
      })

    } else {
      Toastify({
        text: err,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    }

  }

  show() {

    const { unlockToken } = this.props;

    if (!unlockToken) {
      $('#unlock-token-modal').modal({
        show: true
      }, {
        complete: (res)=>{
          if (res) {
            this.setState({
              show: true
            });
          }
        }
      });
    } else {
      this.setState({
        show: true
      });
    }

  }

  render() {

    const { me, unlockToken } = this.props;
    const { show } = this.state;

    if (!me.phone && !me.email) return '';

    return (
        <div className="card">
          <div className="card-header">密码</div>
          <div className="card-body">

          {show &&
              <div>
                <div className="form-group"><input type="password" className="form-control" placeholder="新密码" ref={(e)=>{ this.state.newPassword = e; }}></input></div>
                <div className="form-group"><input type="password" className="form-control" placeholder="重复新密码" ref={(e)=>{ this.state.confirmNewPassword = e; }}></input></div>
                <div><a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.submit}>提交</a></div>
              </div>}
          
          {!show &&
              <div className="d-flex justify-content-between">
                <div>{me.has_password ? '已设置' : '未设置'}</div>
                <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.show}>{me.has_password ? '修改' : '设置'}</a>
              </div>}
              
          </div>
        </div>
    )

  }

}
