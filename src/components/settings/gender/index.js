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
    super(props);
    this.state = {
      loading: false,
      show: false
    }
    this.submit = this.submit.bind(this);
    this.show = this.show.bind(this);
  }

  async submit(isMale) {

    const { me, updateUser, loadUserInfo } = this.props

    if (isMale && me.gender == 1 || !isMale && me.gender == 0) {
      this.setState({ show: false });
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
      loadUserInfo({});
      this.setState({ show: false });
    }
    
  }

  show() {
    this.setState({ show: true });
  }

  render() {

    const { me } = this.props;
    const { show, loading } = this.state;
    
    return (
      <div>
        <div className="card">
          <div className="card-header">性别</div>
          <div className="card-body" style={{padding:'20px'}}>

            {!show ?
              <div className="d-flex justify-content-between">
                <div>{me.gender === 0 ? '女' : null}{me.gender === 1 ? '男' : null}</div>
                <a className="btn btn-primary btn-sm" href="javascript:void(0);" onClick={this.show}>修改</a>
              </div>
              :
              <div className="list-group">
                <button type="button" className={`list-group-item list-group-item-action ${me.gender === 1 ? 'active' : ''}`} onClick={()=>{ this.submit(true) }}>
                  男
                </button>
                <button type="button" className={`list-group-item list-group-item-action ${me.gender === 0 ? 'active' : ''}`} onClick={()=>{ this.submit(false) }}>
                  女
                </button>
              </div>}

          </div>
        </div>

      </div>
    )

  }

}
