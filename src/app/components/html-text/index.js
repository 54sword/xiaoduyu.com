import React, { Component } from 'react';

import hljs from 'highlight.js';

import './style.scss';
import convertHTML from './convert';

export default class HTMLText extends Component {

  static defaultProps = {
    // 隐藏一半
    hiddenHalf: false,

    // 内容没有展开情况下，最大高度
    maxHeight: 0
  }

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      halfContent: '',
      isMount:false,
      
      // 内容折叠情况下的高度
      contentHeight: 0,
      // 是否展开
      expand: false
    }
    
    this.contentRef = React.createRef();

    let { content, hiddenHalf } = this.props;

    if (!content) return;

    

    this.state.content = convertHTML(content);

    /*
    if (hiddenHalf) {
      let _content = (content+'').substr(0, parseInt(content.length/2));
      this.state.halfContent = convertHTML(_content);
      // console.log(this.state.halfContent);
    } else {
      this.state.halfContent = this.state.content;
    }
    */

  }

  componentDidMount() {

    // highlight 代码高亮
    if (typeof hljs != 'undefined') {
      $('pre').each(function(i, block) {
        // hljs.registerLanguage('javascript', _javascript);
        hljs.highlightBlock(block);
      });
    }

    // let { content, hiddenHalf } = this.props;

    this.setState({
      isMount: true,
      contentHeight: this.contentRef && this.contentRef.current ? this.contentRef.current.offsetHeight : 0
    });

  }

  /*
  componentWillMount() {

    let { content, hiddenHalf } = this.props;

    if (!content) return;

    this.state.content = convertHTML(content);

    console.log(content);

    if (hiddenHalf) {
      let _content = (content+'').substr(0, parseInt(content.length/2));
      this.state.halfContent = convertHTML(_content);
    } else {
      this.state.halfContent = this.state.content;
    }

  }
  */
  
  componentWillReceiveProps(props) {
    if (this.props.content != props.content) {
      this.props = props;
      // this.componentDidMount();
      
      let { content } = this.props;

      if (!content) return;
      
      this.state.content = convertHTML(content);

    }
  }

  render() {
    let { content, halfContent, isMount, contentHeight, expand } = this.state;
    const { hiddenHalf, maxHeight } = this.props;

    // console.log(halfContent);

    if (!content) return '';

    return <div>
      
      {!hiddenHalf ?
        <div
          ref={this.contentRef}
          style={!expand && maxHeight && contentHeight > maxHeight ? { maxHeight: `${maxHeight}px`, overflow: 'hidden' } : null }
          styleName="content"
          dangerouslySetInnerHTML={{__html:content}}
          // className="markdown-body"
          // dangerouslySetInnerHTML={{__html:hiddenHalf ? halfContent : content}}
          />
          : null}
        
      {(()=>{
        if (!maxHeight || contentHeight < maxHeight) return null;
        return (<div styleName="expand-button">
          <a
            href="javascript:void(0)"
            className="text-primary"
            onClick={(e)=>{
              e.stopPropagation();
              this.setState({ expand: this.state.expand ? false : true });
            }}
            >
            {!expand && maxHeight && contentHeight > maxHeight ? '展开全部' : '收起'}
          </a>
          </div>)
      })()}

      {hiddenHalf && isMount ?
        <div styleName="more-tips">
          <div>
            <span styleName="lock">需要登陆后才能阅读正文</span>
          </div>
          <div styleName="sign">
            <a href="javascript:void(0)" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#sign" data-type="sign-up">注册</a>
            <a href="javascript:void(0)" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#sign" data-type="sign-in">登录</a>
          </div>
        </div>
        : null}

    </div>
  }
}
