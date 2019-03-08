import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '@reducers/user';
import { loadUserInfo, updateUser } from '@actions/user';


@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    updateUser: bindActionCreators(updateUser, dispatch)
  })
)
export default class Theme extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
    this.onChange = this.onChange.bind(this);
  }

  async onChange(e) {

    let theme = parseInt(e.target.value);

    const { me, updateUser, loadUserInfo } = this.props

    let [err, res] = await updateUser({
      theme
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

      $('html').attr('id', theme == 1 ? 'light-theme' : 'dark-theme');

      this.setState({ show: false });
    }
    
  }

  render() {

    const { me } = this.props;
    
    return (
      <div>
        <div className="card">
          <div className="card-header">主题</div>
          <div className="card-body" style={{padding:'20px'}}>
            <select onChange={this.onChange} defaultValue={me.theme || '1'}>
              <option value="1">浅色</option>
              <option value="2">暗色</option>
            </select>
          </div>
        </div>

      </div>
    )

  }

}
