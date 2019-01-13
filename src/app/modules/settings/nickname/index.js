import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '@reducers/user';
import { updateUser, loadUserInfo } from '@actions/user';

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
    super(props);
    this.state = {
      loading: false,
      show: false
    };
    this.submit = this.submit.bind(this);
    this.show = this.show.bind(this);
  }

  async submit() {

    const { updateUser, loadUserInfo, me } = this.props;
    const { nickname } = this.state;

    if (!nickname.value) {
      nickname.focus();
      return;
    }

    if (me.nickname == nickname.value) {
      this.setState({ show: false });
      return;
    }

    this.setState({ loading: true });

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

      loadUserInfo({});
      
      this.setState({ show: false });
    }

    this.setState({ loading: false });
  }

  show() {
    this.setState({ show: true }, ()=>{
      this.state.nickname.focus();
    });
  }

  render() {

    const { me } = this.props;
    const { show, loading } = this.state;

    return (
      <div>

        <div className="card">
          <div className="card-header">名字</div>
          <div className="card-body" style={{padding:'20px'}}>

            {!show ?
              <div className="d-flex justify-content-between">
                <div>{me.nickname || ''}</div>
                <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.show}>修改</a>
              </div>
              :
              <div>
                <div>
                  <input type="text" className="form-control" defaultValue={me.nickname} ref={e=>{ this.state.nickname = e; }} placeholder="请输入你的名字"></input>
                </div>
                <br />
                {loading ?
                  <a className="btn btn-primary btn-sm" href="javascript:void(0);">提交中...</a>
                  :
                  <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.submit}>提交</a>}
                
              </div>}

          </div>
        </div>

      </div>
    )

  }

}
