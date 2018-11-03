import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// tooles
import avatarPicker from '../../vendors/avatar-picker';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../store/reducers/user';
import { loadUserInfo, updateUser } from '../../store/actions/user';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import QiniuUploadImage from '../../components/qiniu-upload-image';

// styles
import './style.scss';

@Shell
@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    updateUser: bindActionCreators(updateUser, dispatch)
  })
)
export default class ResetAvatar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fileUpload: <div></div>,
      uploadStatus: false
    }
    this.upload = this.upload.bind(this)
  }

  upload(url) {

    const { updateUser, loadUserInfo } = this.props

    const self = this

    avatarPicker({
      img: url,
      selectAreaScale: 0.9,
      previews: [],
      imgLoadComplete: function() {},
      done: async function(p){

        let avatar = url + "?imageMogr2/crop/!"+parseInt(p.width)+"x"+parseInt(p.height)+"a"+parseInt(p.x)+"a"+parseInt(p.y)+"/thumbnail/!200"

        let [ err, res ] = await updateUser({
          avatar: avatar
        });

        // callback: (result) => {
          loadUserInfo({})
        // }

      }
    })

  }

  componentDidMount() {

    const self = this
    const { loadUserInfo } = this.props

    this.setState({
      fileUpload: <QiniuUploadImage upload={this.upload} text={'上传头像'} />
    });

  }

  render() {

    const { me } = this.props
    const { fileUpload, uploadStatus } = this.state

    if (!me._id) return (<span></span>);

    return (
      <div>
        <Meta title='头像' />
        {uploadStatus ? <Loading /> : null}

        <div className="card">
          <div className="card-header">头像</div>
          <div className="card-body">

            <div styleName="avatar">
              <img src={me.avatar_url.replace('!50', "!200")} />
            </div>

            <div styleName="upload">
              {fileUpload}
            </div>
            <br /><br />

          </div>
        </div>

      </div>
    )

  }

}
