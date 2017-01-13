import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import avatarPicker from '../../common/avatar-picker'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signout } from '../../actions/sign'
import { getProfile } from '../../reducers/user'
import { changeNickname, loadUserInfo, cropAvatar } from '../../actions/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'
import FileUpload from '../../components/file-upload'
import Loading from '../../components/loading'


class ResetAvatar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fileUpload: <div></div>,
      uploadStatus: false
    }
  }

  componentDidMount() {

    const self = this
    const { cropAvatar, loadUserInfo } = this.props

    let options = {
      url: 'avatar',
      numberLimit: 1,
      uploadSuccess : function(resp){

        avatarPicker({
          img: resp.data,
          selectAreaScale: 0.9,
          previews: [],
          imgLoadComplete: function() {

            self.setState({
              uploadStatus: false
            })

          },
          done: function(area){
            cropAvatar({
              x: area.x,
              y: area.y,
              width: area.width,
              height: area.height,
              callback: function(){
                loadUserInfo({})
              }
            })
          }
        })

      },

      beforeUpload: () => {
        self.setState({
          uploadStatus: true
        })
      },

      uploadFail: (resp)=>{
        console.log(resp)
        alert('上传失败')
        self.setState({
          uploadStatus: false
        })
      }

    }

    this.setState({
      fileUpload: <FileUpload options={options}>上传头像</FileUpload>
    });

  }

  render() {

    const { me } = this.props
    const { fileUpload, uploadStatus } = this.state

    return (
      <div>
        <Meta meta={{title:'头像'}} />
        <Subnav middle="头像" />
        {uploadStatus ? <Loading /> : null}
        <div className="container">

          <div className={styles.avatar}>
            <img src={me.avatar_url.replace(/thumbnail/, "large")} />
          </div>

          <div className="list">
            <a className="center" href="javascript:void(0);">
              <div className={styles['upload-button']}>{fileUpload}</div>
            </a>
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
  cropAvatar: PropTypes.func.isRequired,
  loadUserInfo: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    cropAvatar: bindActionCreators(cropAvatar, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  }
}

ResetAvatar = connect(mapStateToProps, mapDispatchToProps)(ResetAvatar)

export default Shell(ResetAvatar)
