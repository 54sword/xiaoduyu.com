import React, { PropTypes } from 'react'
import Qiniu from 'react-qiniu'

import styles from './style.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { getProfile } from '../../reducers/account'
// import { updateProfile } from '../../actions/account'
import { getQiNiuToken } from '../../actions/qiniu'

import Loading from '../../components/loading'

class QiniuUploadImage extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      files: [],
      token: '',
      url: '',
      uploadKey: ''
    }

    this.onDrop = this._onDrop.bind(this)
    this.onUpload = this._onUpload.bind(this)
  }

  componentWillMount() {

    const self = this
    const { getQiNiuToken } = this.props

    getQiNiuToken({
      callback: (data) =>{
        if (data) {
          self.setState({ token: data.token, url: data.url })
        }
      }
    })

  }

  _onUpload(files) {

    const self = this
    const { upload } = this.props
    const { url } = this.state

    self.setState({ loading: true })

    let count = 0

    files.map(function (f) {

      f.onprogress = function(e) {

        if (e.percent == 100 && e.currentTarget.status && e.currentTarget.status == 200) {

          upload(url+'/'+JSON.parse(e.currentTarget.response).key)

          count = count + 1

          // console.log(count + ' - ' + files.length)

          if (count >= files.length) {
            self.setState({ loading: false })
          }

          /*
          self.setState({
            preview: f.preview,
            avatarUrl: 'http://houseimg.huarenmatch.com/'+JSON.parse(e.currentTarget.response).key,
            showCropper: true,
            loading: false
          })
          */
        }
      }

    })
  }

  _onDrop(files) {
    // console.log(files)
  }

  render() {

    if (!this.state.token) {
      return (<span></span>)
    }

    const { loading, token } = this.state
    const { multiple = true, name = '上传图片' } = this.props

    return (
      <div>
        {loading ? <Loading /> : null}
        <Qiniu
          onDrop={this.onDrop}
          size={100}
          multiple={multiple}
          accept="image/*"
          token={this.state.token}
          uploadKey={this.state.uploadKey}
          onUpload={this.onUpload}>
          <div className={styles.buttonbox}>
            <a href="javascript:void(0)" className="button-white">{name}</a>
          </div>
        </Qiniu>
      </div>
    );
  }
}

QiniuUploadImage.propTypes = {
  getQiNiuToken: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getQiNiuToken: bindActionCreators(getQiNiuToken, dispatch)
  }
}

QiniuUploadImage = connect(mapStateToProps,mapDispatchToProps)(QiniuUploadImage)


export default QiniuUploadImage
