import React, { Component } from 'react';

import './style.scss';
import convertHTML from '@utils/convert-html';

export default class HTMLText extends Component {

  static defaultProps = {
    // 隐藏一半
    hiddenHalf: false
  }

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      halfContent: '',
      isMount:false
    }
  }

  componentDidMount() {
    this.setState({
      isMount: true
    })
  }

  componentWillMount() {

    let { content, hiddenHalf } = this.props;

    if (!content) return;

    this.state.content = convertHTML(content);

    if (hiddenHalf) {
      content = content.substr(0, parseInt(content.length/2));
      this.state.halfContent = convertHTML(content);
    } else {
      this.state.halfContent = this.state.content;
    }

  }
  
  componentWillReceiveProps(props) {
    if (this.props.content != props.content) {
      this.props = props;
      this.componentWillMount();
    }
  }

  render() {
    let { content, halfContent, isMount } = this.state;
    const { hiddenHalf } = this.props;

    if (!content) '';

    return <div>
      
      <div
        styleName="content"
        className="html-content"
        dangerouslySetInnerHTML={{__html:hiddenHalf ? halfContent : content}}
        />

      {hiddenHalf && isMount ?
        <div styleName="more-tips">
          <div>
            <span styleName="lock">剩余50%的内容登陆后可查看</span>
          </div>
          <div styleName="sign">
            <a href="javascript:void(0)" className="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#sign" data-type="sign-up">注册</a>
            <a href="javascript:void(0)" className="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#sign" data-type="sign-in">登录</a>
          </div>
        </div>
        : null}

    </div>
  }
}
