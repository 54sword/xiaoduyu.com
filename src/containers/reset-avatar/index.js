import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import avatarPicker from '../../common/avatar-picker'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signout } from '../../actions/sign'
import { getProfile } from '../../reducers/user'
import { loadUserInfo, resetAvatar } from '../../actions/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import QiniuUploadImage from '../../components/qiniu-upload-image'


export class ResetAvatar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fileUpload: <div></div>,
      uploadStatus: false
    }
    this.upload = this.upload.bind(this)
  }

  upload(url) {

    const { resetAvatar, loadUserInfo } = this.props

    const self = this

    avatarPicker({
      img: url,
      selectAreaScale: 0.9,
      previews: [],
      imgLoadComplete: function() {},
      done: function(p){

        let avatar = url + "?imageMogr2/crop/!"+parseInt(p.width)+"x"+parseInt(p.height)+"a"+parseInt(p.x)+"a"+parseInt(p.y)+"/thumbnail/!200"

        resetAvatar({
          avatar: avatar,
          callback: (result) => {
            loadUserInfo({})
          }
        })

      }
    })

  }

  componentDidMount() {

    const self = this
    const { loadUserInfo } = this.props

    this.setState({
      fileUpload: <QiniuUploadImage upload={this.upload} multiple={false} name={'上传头像'} />
    });


  }

  render() {

    const { me } = this.props
    const { fileUpload, uploadStatus } = this.state

    if (!me._id) {
      return (<span></span>)
    }

    return (
      <div>
        <Meta meta={{title:'头像'}} />

        <Subnav middle="头像" />
        {uploadStatus ? <Loading /> : null}
        <div className="container">

          <div className={styles.avatar}>
            <img src={me.avatar_url.replace('!50', "!200")} />
          </div>

          <div className="list">
            <a href="javascript:void(0)" className={styles.upload}>{fileUpload}</a>
          </div>

        </div>
      </div>
    )

  }

}

ResetAvatar.contextTypes = {
  router: PropTypes.object.isRequired
}

ResetAvatar.propTypes = {
  me: PropTypes.object.isRequired,
  loadUserInfo: PropTypes.func.isRequired,
  resetAvatar: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    resetAvatar: bindActionCreators(resetAvatar, dispatch)
  }
}

ResetAvatar = connect(mapStateToProps, mapDispatchToProps)(ResetAvatar)

export default Shell(ResetAvatar)
