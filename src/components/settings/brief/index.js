import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../../store/reducers/user';
import { updateUser, loadUserInfo } from '../../../store/actions/user';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    updateUser: bindActionCreators(updateUser, dispatch)
  })
)
export default class ResetBrief extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      show: false
    }
    this.submit = this.submit.bind(this);
    this.show = this.show.bind(this);
  }

  async submit() {

    const { me, updateUser, loadUserInfo } = this.props
    const { brief } = this.state;

    if (brief.value == me.brief) {
      this.setState({ show: false });
      return;
    }

    this.setState({ loading: true });

    let [ err, res ] = await updateUser({
      brief: brief.value
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
      this.state.brief.focus();
    });
  }

  render() {

    const { me } = this.props;
    const { show, loading } = this.state;

    return (
      <div>
        <div className="card">
          <div className="card-header">个性签名</div>
          <div className="card-body" style={{padding:'20px'}}>

            {!show ?
              <div className="d-flex justify-content-between">
                <div>{me.brief || '未知签名'}</div>
                <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.show}>修改</a>
              </div>
              :
              <div>
                <div className="form-group">
                  <input className="form-control" defaultValue={me.brief} ref={e=>{ this.state.brief = e; }}></input>
                </div>
                {loading ?
                  <a className="btn btn-primary btn-sm" href="javascript:void(0);">提交中...</a>
                  : <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.submit}>提交</a>}
                
              </div>}

          </div>
        </div>
      </div>
    )

  }

}
