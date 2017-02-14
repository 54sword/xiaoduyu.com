
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

import { Editor, EditorState, RichUtils, Entity, AtomicBlockUtils, convertToRaw, convertFromRaw, CompositeDecorator } from 'draft-js'

import redraft from 'redraft'

// import FileUpload from '../../components/file-upload'
import QiniuUploadImage from '../../components/qiniu-upload-image'

import styles from './style.scss'

import './Draft.css'
import './RichEditor.css'

import Device from '../../common/device'
import Embed from '../../components/embed'
import Iframe from '../../components/iframe'

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class StyleButton extends React.Component {

  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    )
  }

}

const BLOCK_TYPES = [
  // {label: 'H1', style: 'header-one'},
  // {label: 'H2', style: 'header-two'},
  // {label: 'H3', style: 'header-three'},
  // {label: 'H4', style: 'header-four'},
  // {label: 'H5', style: 'header-five'},
  // {label: 'H6', style: 'header-six'},
  // {label: 'Title', style: 'header-five'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
]

const BlockStyleControls = (props) => {

  const { editorState } = props
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  )
}


// -----

var INLINE_STYLES = [
  {label: '加粗', style: 'BOLD'},
  {label: '斜体', style: 'ITALIC'},
  {label: '下划线', style: 'UNDERLINE'}
  // {label: 'Monospace', style: 'CODE'}
]

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

const Controls = (props) => {

  const { editorState } = props
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  var currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">

      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.toggleBlockType}
          style={type.style}
        />
      )}

      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.toggleInlineStyle}
          style={type.style}
        />
      )}
    </div>
  );
};

// -----

function mediaBlockRenderer(block) {

  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }
  return null;
}

const Audio = (props) => {
  return <audio controls src={props.src} style={styles.media} />;
};

const Image = (props) => {
  return <img src={props.src} style={styles.media} />;
};

const Video = (props) => {
  return <video controls src={props.src} style={styles.media} />;
};

const Media = (props) => {

  const entity = Entity.get(props.block.getEntityAt(0));
  const {src} = entity.getData();
  const type = entity.getType();

  let media;

  if (type === 'image') {
    media = <Image src={src} />;
  } else if (type === 'youtube') {

    let url = 'https://www.youtube.com/embed/' + src
    media = <iframe src={url}></iframe>

  } else if (type === 'youku') {

    let url = 'https://player.youku.com/embed/' + src
    media = <iframe src={url}></iframe>

    // let url = "http://player.youku.com/embed/" + src
    // media = <Iframe src={url} frameborder="0" border="0" width="auto" height="auto" position="" allowfullscreen></Iframe>
    /*
    if (Device.isMobileDevice()) {
      let url = "http://player.youku.com/embed/" + src
      media = <Iframe src={url} frameborder="0" border="0" width="auto" height="auto" position="" allowfullscreen></Iframe>
    } else {
      let url = "http://player.youku.com/player.php/sid/"+src+"/v.swf"
      media = <Embed src={url}></Embed>
    }
    */
  // } else if (type === 'tudou') {
    // let url = "http://www.tudou.com/programs/view/html5embed.action?code="+src
    // media = <Iframe src={url} allowtransparency="true" allowfullscreen="true" allowfullscreenInteractive="true" scrolling="no" border="0" frameborder="0" width="auto" height="auto" position=""></Iframe>
    // <iframe url={url} allowtransparency="true" allowfullscreen="true" allowfullscreenInteractive="true" scrolling="no" border="0" frameborder="0"></iframe>
  } else if (type === 'qq') {

    // let url = "https://v.qq.com/iframe/player.html?vid="+src+"&tiny=0&auto=0"
    // media = <Iframe frameborder="0" src={url} width="auto" height="auto" position="" allowfullscreen></Iframe>
    if (Device.isMobileDevice()) {
      let src = "https://v.qq.com/iframe/player.html?vid="+src+"&tiny=0&auto=0"
      // let url = "https://v.qq.com/iframe/player.html?vid="+src+"&tiny=0&auto=0"
      media = <Iframe src={url} width="auto" height="auto" position=""></Iframe>
    } else {
      let url = "https://imgcache.qq.com/tencentvideo_v1/playerv3/TPout.swf?max_age=86400&v=20161117&vid="+src+"&auto=0"
      // let url = "https://static.video.qq.com/TPout.swf?vid="+src+"&auto=0"
      media = <Embed src={url}></Embed>
    }
  }

  return media;
}

// ------------------------------------

function getEntityStrategy(mutability) {
  return function(contentBlock, callback) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        return Entity.get(entityKey).getMutability() === mutability;
      },
      callback
    );
  };
}

function getDecoratedStyle(mutability) {
  switch (mutability) {
    case 'IMMUTABLE': return styles.immutable;
    case 'MUTABLE': return styles.mutable;
    case 'SEGMENTED': return styles.segmented;
    default: return null;
  }
}

const TokenSpan = (props) => {
  const style = getDecoratedStyle(
    Entity.get(props.entityKey).getMutability()
  )
  return (
    <span {...props} style={style}>
      {props.children}
    </span>
  )
}

const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy('IMMUTABLE'),
    component: TokenSpan,
  },
  {
    strategy: getEntityStrategy('MUTABLE'),
    component: TokenSpan,
  },
  {
    strategy: getEntityStrategy('SEGMENTED'),
    component: TokenSpan,
  }
])

// -----

const stylesa = {
  code: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 20,
  }
};

const addBreaklines = (children) => children.map(child => [child, <br />]);

const renderers = {
  /**
   * Those callbacks will be called recursively to render a nested structure
   */
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
    ITALIC: (children, { key }) => <em key={key}>{children}</em>,
    UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
    CODE: (children, { key }) => <span key={key}>{children}</span>,
  },
  /**
   * Blocks receive children and depth
   * Note that children are an array of blocks with same styling,
   */
  blocks: {
    unstyled: (children) => children.map(child => <p>{child}</p>),
    blockquote: (children, key) => {
      // console.log(key)
      return <blockquote key={key.keys[0]}>{addBreaklines(children)}</blockquote>
    },
    'header-one': (children) => children.map(child => <h1>{child}</h1>),
    'header-two': (children) => children.map(child => <h2>{child}</h2>),
    // You can also access the original keys of the blocks
    'code-block': (children, { keys }) => <pre key={keys[0]} >{addBreaklines(children)}</pre>,
    // or depth for nested lists
    'unordered-list-item': (children, { depth, keys }) => <ul key={keys[keys.length - 1]}>{children.map((child, index) => <li key={keys[index]}>{child}</li>)}</ul>,
    'ordered-list-item': (children, { depth, keys }) => <ol key={keys.join('|')}>{children.map((child, index)=> <li key={keys[index]}>{child}</li>)}</ol>,
    // If your blocks use meta data it can also be accessed like keys
    atomic: (children, data) => {
      return children[0]
      // children.map((child, i) => {
        // console.log(children, data)
    }
    /*
    atomic: (children, { keys, data }) => children.map((child, i) => {
      console.log(child, i)
      // <Atomic key={keys[i] {...data[i]} />
    }),
    */
  },
  /**
   * Entities receive children and the entity data
   */
  entities: {
    // key is the entity key value from raw
    LINK: (children, data, { key }) => <a href={data.url}>{data.title || data.url}</a>,
    youku: (children, data, { key }) => <div data-youku={data.src}></div>,
    tudou: (children, data, { key }) => <div data-tudou={data.src}></div>,
    qq: (children, data, { key }) => <div data-qq={data.src}></div>,
    youtube: (children, data, { key }) => <div data-youtube={data.src}></div>,
    image: (children, data, { key }) => <img src={data.src} />,
    // youku: (children, data, { key }) => <div><Embed src={`http://player.youku.com/player.php/sid/${data.src}/v.swf`}></Embed></div>,
    // tudou: (children, data, { key }) => <div><Iframe src={`http://www.tudou.com/programs/view/html5embed.action?code=${data.src}`} allowtransparency="true" allowfullscreen="true" allowfullscreenInteractive="true" scrolling="no" border="0" frameborder="0" width="auto" height="auto" position=""></Iframe></div>,
    // qq: (children, data, { key }) => <div><Embed src={`http://static.video.qq.com/TPout.swf?vid=${data.src}&auto=0`}></Embed></div>,
  },
}


class MyEditor extends React.Component {

  constructor(props) {
    super(props)

    const { syncContent, content, readOnly } = this.props

    this.state = {
      syncContent: syncContent || null, // 编辑器改变的时候，调给外部组件使用
      readOnly: readOnly || false,
      editorState: content
        ? EditorState.createWithContent(convertFromRaw(JSON.parse(content)), decorator)
        : EditorState.createEmpty(),
      rendered: null,
      scrollY: 0
    }

    this.onChange = this._onChange.bind(this)
    this.toggleBlockType = (type) => this._toggleBlockType(type)
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style)
    this.addVideo = this._addVideo.bind(this)
    this.addImage = this._addImage.bind(this)
    this.addLink = this._addLink.bind(this)
    this.handleKeyCommand = this._handleKeyCommand.bind(this)
    this.timer = null
    this.undo = this._undo.bind(this)
    this.redo = this._redo.bind(this)
    this.onKeyDown = this._onKeyDown.bind(this)
  }

  componentDidMount() {

    const that = this
    this.onChange(this.state.editorState)

    // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

    // document.onkeydown = (event) => {
    //   if (document.activeElement.className == 'public-DraftEditor-content') {
    //     that.state.scrollY = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) - 50
    //   }
    // }

    document.ontouchend = (event) => {
      if (document.activeElement.className == 'public-DraftEditor-content') {
        that.state.scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      }
    }

    // this.refs.editor.focus()
    // console.log(document.getElementsByTagName('public-DraftEditor-content')[0])
  }

  _onKeyDown(event) {
    // alert('23')
    // var e = event || window.event
    // console.log(e.keyCode)
  }

  _onChange(editorState) {

    this.setState({ editorState })

    const that = this
    const { syncContent } = this.state
    const { draftHtml } = this.refs

    if (syncContent) {

      const content = editorState.getCurrentContent()

      let html = redraft(convertToRaw(content), renderers)

      this.setState({
        rendered: html
      })

      setTimeout(()=>{

        // 删除所有空格
        let html = draftHtml.innerHTML.replace(/<!--[\w\W\r\n]*?-->/gmi, '')

        let _html = html.replace(/<p>/gmi, '')
            _html = _html.replace(/<\/p>/gmi, '')

        if (!_html) {
          syncContent('', '')
          // syncContent(JSON.stringify({}), html)
          return
        }

        syncContent(JSON.stringify(convertToRaw(content)), html)

      }, 100)

    }

    if (that.state.scrollY) {
      window.scrollTo(0, that.state.scrollY)
    }

  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    )
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    )
  }

  _addLink() {


    this._promptForMedia('LINK', {url:'xiaoduyu.com',title:'小度鱼'})

    return

    let url = prompt("请输入url地址","");

    if (!url) {
      return
    }
  }

  _addVideo() {

    let url = prompt("请输入视频地址，目前支持优酷、腾讯、土豆","");

    if (!url) {
      return
    }

    if (url.indexOf('qq.com') > -1) {

      let id = url.match(/\?vid\=([0-9a-zA-z\_]{1,})$/) || []
      id = id && id.length > 0 ? id[1] : ''

      if (!id) {
        id = url.match(/\/([0-9a-zA-z\_]{1,})\.html/)
        id = id && id.length > 0 ? id[1] : ''
      }

      if (id) {
        this._promptForMedia('qq', id)
      } else {
        alert('添加失败，可能是不支持该地址格式')
      }

    } else if (url.indexOf('youku.com') > -1) {

      let id = url.match(/\/id\_(.*)\.html/)

      id = id && id.length > 0 ? id[1] : ''

      if (id) {
        this._promptForMedia('youku', id)
      } else {
        alert('添加失败，可能是不支持该地址格式')
      }

    } else if (url.indexOf('youtube.com') > -1) {

        let id = url.match(/\/watch\?v\=([0-9a-zA-z\_\-]{1,})$/) || []

        id = id && id.length > 0 ? id[1] : ''

        if (id) {
          this._promptForMedia('youtube', id)
        } else {
          alert('添加失败，可能是不支持该地址格式')
        }

    // } else if (url.indexOf('tudou.com') > -1) {
    //
    //   let id = url.match(/\/albumplay\/([0-9a-zA-z\_\-]{1,})\/([0-9a-zA-z\_\-]{1,})\.html/) || []
    //   id = id && id.length > 0 ? id[2] : ''
    //
    //   if (!id) {
    //     id = url.match(/\/view\/([0-9a-zA-z\_]{1,})\//) || []
    //     id = id && id.length > 0 ? id[1] : ''
    //   }
    //
    //   if (!id) {
    //     id = url.match(/\/listplay\/([0-9a-zA-z\_\-]{1,})\/([0-9a-zA-z\_\-]{1,})(?=\.html|\/)/) || []
    //     id = id && id.length > 0 ? id[2] : ''
    //   }
    //
    //   if (id) {
    //     this._promptForMedia('tudou', id)
    //   } else {
    //     alert('添加失败，可能是不支持该地址格式')
    //   }

    } else {
      alert('无效的地址')
    }

  }

  _addImage(url) {
    this._promptForMedia('image', url)
  }

  _promptForMedia(type, src) {

    const { editorState } = this.state;
    const entityKey = Entity.create(type, 'IMMUTABLE', {src: src})

    this.onChange(AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    ));
    /*
    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
      )
    });

    this.onChange(this.state.editorState);
    */
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const that = this
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _undo() {
    const that = this
    this.onChange(EditorState.undo(this.state.editorState))
    setTimeout(()=>{
      that.onChange(EditorState.redo(that.state.editorState))
      that.state.editorState.focus()
    })

    // this.onChange(EditorState.redo(this.state.editorState))
  }

  _redo() {
    // const that = this
    this.onChange(EditorState.redo(this.state.editorState))
    // setTimeout(()=>{
    //   that.onChange(EditorState.undo(that.state.editorState))
    // }, 100)
  }

  render() {

    const { editorState, readOnly, rendered } = this.state
    const self = this

    let className = 'RichEditor-editor';

    /*
    const options = {
      url: 'image',
      uploadSuccess: (resp) => {
        self.addImage(resp.image.middle)
      }
    }
    */

    const upload = (imageName) => {
      self.addImage(imageName)
    }

    return(<div className={className}>

            <div ref="draftHtml" style={{display:'none'}}>
              {rendered}
            </div>

            <div className={styles['media-tools']}>
              <span>
                <QiniuUploadImage upload={upload} />
                {/*<FileUpload options={options}>上传图片</FileUpload>*/}
              </span>
              <span>
                <a href="javascript:void(0)" className="button-white" onClick={this.addVideo}>添加视频</a>
              </span>
              {/*
              <span>
                <a href="javascript:void(0)" className="button-white" onClick={this.addLink}>添加链接</a>
              </span>

              <span>
                <a href="javascript:void(0)" onClick={this.undo}>撤销</a>
              </span>

              <span>
                <a href="javascript:void(0)" onClick={this.redo}>恢返回</a>
              </span>
              */}

            </div>

            <Controls
              editorState={editorState}
              toggleBlockType={this.toggleBlockType}
              toggleInlineStyle={this.toggleInlineStyle}
            />

            <Editor
              blockRendererFn={mediaBlockRenderer}
              editorState={editorState}
              blockStyleFn={getBlockStyle}
              onChange={this.onChange}
              handleKeyCommand={this.handleKeyCommand}
              placeholder="请输入正文"
              ref="editor"
              spellCheck
            />

          </div>)
  }
}


export default MyEditor
