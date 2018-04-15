import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// tooles
import avatarPicker from '../../vendors/avatar-picker';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../reducers/user';
import { loadUserInfo, updateUser } from '../../actions/user';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import QiniuUploadImage from '../../components/qiniu-upload-image';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    updateUser: bindActionCreators(updateUser, dispatch)
  })
)
@CSSModules(styles)
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
        <Meta title='头像' />
        {uploadStatus ? <Loading /> : null}

        <div className="container">

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">首页</Link></li>
              <li className="breadcrumb-item"><Link to="/settings">设置</Link></li>
              <li className="breadcrumb-item active" aria-current="page">头像</li>
            </ol>
          </nav>

          <div styleName="avatar">
            <img src={me.avatar_url.replace('!50', "!200")} />
          </div>

          <div className="list">
            {fileUpload}
            {/*<a href="javascript:void(0)" styleName="upload"></a>*/}
          </div>

        </div>
      </div>
    )

  }

}

export default Shell(ResetAvatar)
