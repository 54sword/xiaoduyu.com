import React, { Component, PropTypes } from 'react'
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
// import Nav from '../../components/nav'
import Subnav from '../../components/subnav'
// import FileUpload from '../../components/file-upload'
// import Loading from '../../components/loading'
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
    /*
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
    */

    this.setState({
      fileUpload: <QiniuUploadImage upload={this.upload} multiple={false} name={'上传头像'} />
      // fileUpload: <FileUpload options={options}>上传头像</FileUpload>
    });

    // this.upload()

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
            <span className={styles.upload}>{fileUpload}</span>
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
  // cropAvatar: PropTypes.func.isRequired,
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
    // cropAvatar: bindActionCreators(cropAvatar, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    resetAvatar: bindActionCreators(resetAvatar, dispatch)
  }
}

ResetAvatar = connect(mapStateToProps, mapDispatchToProps)(ResetAvatar)

export default Shell(ResetAvatar)
