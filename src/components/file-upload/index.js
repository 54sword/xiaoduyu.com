import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import _FileUpload from 'react-fileupload'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getAccessToken } from '../../reducers/user'
// import { setLoadingDisplay } from '../../actions/loading'

import { api_url } from '../../../config'

class FileUpload extends Component {

  constructor(props) {
    super(props)
    this.state = {
      baseUrl: {
        'avatar': '/upload-avatar',
        'image': '/upload-image'
      },
      options: {}
    }
  }

  componentWillMount() {
    
    const { accessToken } = this.props

    const { url, accept, beforeUpload, uploading, uploadSuccess, uploadError,
            uploadFail, numberLimit
          } = this.props.options

    this.state.options = {
      baseUrl: api_url + this.state.baseUrl[url],
      param:{ fid:0 },
      requestHeaders: { 'AccessToken': accessToken },
      numberLimit: numberLimit || 1,
      accept: accept || 'image/*',
      fileFieldName : 'file',
      chooseAndUpload: true,
      beforeUpload : beforeUpload || function(files, mill){
        if (files[0].size < 1024*1024*5) {
          files[0].mill = mill
          return true
        }
        alert('文件不能大于5M')
        return false
      },
      doUpload: function() {
        // setLoadingDisplay(true)
      },
      uploading : function(progress){
        if (uploading) uploading(progress)
      },
      uploadSuccess : function(resp){
        // setLoadingDisplay(false)
        if (uploadSuccess) uploadSuccess(resp)
      },
      uploadError : function(err){
        // setLoadingDisplay(false)
        if (uploadError) uploadError(err)
      },
      uploadFail : function(resp){
        // setLoadingDisplay(false)
        if (uploadFail) uploadFail(resp)
      }
    }

  }

  render() {
    return (<_FileUpload options={this.state.options}>
              <button ref="chooseAndUpload">{this.props.children}</button>
            </_FileUpload>)
  }

}

FileUpload.contextTypes = {
}

FileUpload.propTypes = {
  accessToken: PropTypes.string.isRequired,
  // setLoadingDisplay: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    accessToken: getAccessToken(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // setLoadingDisplay: bindActionCreators(setLoadingDisplay, dispatch)
  }
}


FileUpload = connect(mapStateToProps, mapDispatchToProps)(FileUpload)

export default FileUpload
