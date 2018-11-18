import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { Link } from 'react-router'

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
export default class ResetBrief extends Component {

  constructor(props) {
    super(props)
    this.submitResetBrief = this.submitResetBrief.bind(this)
  }

  componentDidMount() {
    const { brief } = this.refs
    setTimeout(()=>{

      if (typeof brief.selectionStart == "number") {
        brief.selectionStart = brief.selectionEnd = brief.value.length;
      } else if (typeof brief.createTextRange != "undefined") {
        brief.focus();
        var range = brief.createTextRange();
        range.collapse(false);
        range.select();
      }

    });

  }

  async submitResetBrief() {

    const self = this
    const { updateUser, loadUserInfo } = this.props
    const { brief } = this.refs

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
              <textarea className="form-control" defaultValue={me.brief} ref="brief"></textarea>
            </div>
            <a className="btn btn-primary" href="javascript:void(0);" onClick={this.submitResetBrief}>保存</a>
          </div>
        </div>
      </div>
    )

  }

}
