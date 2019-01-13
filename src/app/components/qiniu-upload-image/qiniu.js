import React from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';

// style
import './qiniu.scss';

export default class Qiniu extends React.Component {

  static defaultProps = {
    text: '上传图片',
    size: 1024*1024*2,
    accept: '*',
    multiple: true,
    uploadUrl: (()=>{
      if (typeof window == 'undefined' || typeof document == 'undefined') return '';
      return window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com';
    })(),
    onUpload: (file)=>{}
  }

  static propTypes = {
    token: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.upload = this.upload.bind(this);
  }

  onChange(e) {

    e.preventDefault();

    const self = this;

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    let maxFiles = (this.props.multiple) ? files.length : 1;

    let arr = [];

    for (var i = 0; i < maxFiles; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
      files[i].upload = ((file)=>{
        return () => self.upload(file)
      })(files[i]);

      arr.push(files[i]);
    }

    this.props.onUpload(arr);
  }

  upload(file) {

    if (!file || file.size === 0) return null;

    const key = file.preview.split('/').pop() + '.' + file.name.split('.').pop();

    return new Promise(resolve=>{

      // const input = document.querySelector('input[type="file"]');
      const data = new FormData();
      data.append('file', file);
      data.append('token', this.props.token);
      data.append('key', key);
      data.append('x:filename', file.name);
      data.append('x:size', file.size);

      fetch(this.props.uploadUrl, {
        method: 'POST',
        body: data
      })
      .then(data=>{
        resolve(data)
      })
      .catch((error)=>{
        resolve(error)
      });

    });

  }

  render() {

    const { text, accept, multiple } = this.props

    return (<a href="javascript:void(0)" styleName="file">{text}<input type="file" accept={accept} multiple={multiple} onChange={this.onChange} /></a>)
  }

}
