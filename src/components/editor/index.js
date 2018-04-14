
import React from 'react'
import ReactDOM from 'react-dom'
import { Editor, EditorState, RichUtils, Entity, AtomicBlockUtils, convertToRaw, convertFromRaw, CompositeDecorator, Modifier } from 'draft-js'

import redraft from 'redraft'

import QiniuUploadImage from '../qiniu-upload-image'

import 'draft-js/dist/Draft.css'
import './RichEditor.css'

// import Device from '../../common/device'
// import Embed from '../../components/embed'
import Iframe from './components/iframe'

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}


function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    color: '#3b5998',
    textDecoration: 'underline',
  },
};

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
      <span className={className + ' ' + this.props.className} onMouseDown={this.onToggle}></span>
    )
  }

}

const BLOCK_TYPES = [
  // { className: 'title', label: 'H1', style: 'header-one'},
  { className: 'title', label: 'H2', style: 'header-two'},
  // { className: 'title', label: 'H3', style: 'header-three'},
  // { className: 'title', label: 'H4', style: 'header-four'},
  // { className: 'title', label: 'H5', style: 'header-five'},
  // { className: 'title', label: 'H6', style: 'header-six'},
  // { className: 'title', label: 'Title', style: 'header-five'},
  { className: 'blockquote', label: 'Blockquote', style: 'blockquote'},
  { className: 'ul', label: 'ul', style: 'unordered-list-item'},
  { className: 'ol', label: 'ol', style: 'ordered-list-item'},
  { className: 'code-block', label: 'code', style: 'code-block'}
]


var INLINE_STYLES = [
  { className:"bold", label: 'bold', style: 'BOLD'},
  { className:"italic", label: 'italic', style: 'ITALIC'},
  { className:"underline", label: 'underline', style: 'UNDERLINE'}
  // {label: 'Monospace', style: 'CODE'}
]

// 编辑器控制器
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
          className={type.className}
          style={type.style}
        />
      )}

      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.toggleInlineStyle}
          className={type.className}
          style={type.style}
        />
      )}

      <span className="RichEditor-styleButton image">
        <QiniuUploadImage upload={props.addImage} name=" " />
      </span>

      <span href="javascript:void(0)" className="RichEditor-styleButton video" onClick={props.addVideo} data-toggle="tooltip" data-placement="top" title="Tooltip on top"></span>
      <span href="javascript:void(0)" className="RichEditor-styleButton link" onClick={props.addLink} data-toggle="tooltip" data-placement="top" title="Tooltip on top"></span>
      {/*<span href="javascript:void(0)" className="RichEditor-styleButton music" onClick={props.addMusic}></span>*/}

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

const Media = (props) => {

  const entity = Entity.get(props.block.getEntityAt(0))
  const { src } = entity.getData()
  const type = entity.getType()

  let media;

  if (type === 'link') {
    media = <a href={src} target="_blank" rel="nofollow">{src}</a>
  } else if (type === 'image') {
    media = <img src={src} />
  } else if (type === 'youtube') {
    let url = 'https://www.youtube.com/embed/' + src
    media = <iframe src={url}></iframe>
  } else if (type === 'youku') {
    let url = 'https://player.youku.com/embed/' + src
    media = <iframe src={url}></iframe>
  } else if (type === 'qq') {
    let url = "https://v.qq.com/iframe/player.html?vid="+src+"&tiny=0&auto=0"
    media = <Iframe src={url} width="auto" height="auto" position=""></Iframe>
  } else if (type === '163-music-song') {
    let url = "//music.163.com/outchain/player?type=2&id="+src+"&auto=1&height=66"
    media = <Iframe src={url} width="auto" height="86" position=""></Iframe>
  } else if (type === '163-music-playlist') {
    let url = "//music.163.com/outchain/player?type=0&id="+src+"&auto=1&height=430"
    media = <Iframe src={url} width="auto" height="450" position=""></Iframe>
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

/*
function getDecoratedStyle(mutability) {
  return null;
  switch (mutability) {
    // case 'IMMUTABLE': return styles.immutable;
    // case 'MUTABLE': return styles.mutable;
    // case 'SEGMENTED': return styles.segmented;
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
function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}
*/

/*
const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={{ color: '#3b5998', textDecoration: 'underline' }}>
      {props.children}
    </a>
  );
};
*/

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
    CODE: (children, { key }) => <span key={key}>{children}</span>
  },
  /**
   * Blocks receive children and depth
   * Note that children are an array of blocks with same styling,
   */
  blocks: {
    unstyled: (children) => children.map((child, keys)=> <p key={keys}>{child}</p>),
    blockquote: (children, key) => {
      // console.log(key)
      return <blockquote key={key.keys[0]}>{addBreaklines(children)}</blockquote>
    },
    'header-one': (children) => children.map((child, keys) => <h1 key={keys}>{child}</h1>),
    'header-two': (children) => children.map((child, keys) => <h2 key={keys}>{child}</h2>),
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
    youku: (children, data, { key }) => <div key={key} data-youku={data.src}></div>,
    tudou: (children, data, { key }) => <div key={key} data-tudou={data.src}></div>,
    qq: (children, data, { key }) => <div key={key} data-qq={data.src}></div>,
    youtube: (children, data, { key }) => <div key={key} data-youtube={data.src}></div>,
    image: (children, data, { key }) => <img key={key} src={data.src} />,
    '163-music-song': (children, data, { key }) => <div key={key} data-163musicsong={data.src}></div>,
    '163-music-playlist': (children, data, { key }) => <div key={key} data-163musicplaylist={data.src}></div>,
    LINK: (children, data, { key }) => <a key={key} href={data.url} target="_blank" rel="nofollow">{children}</a>
  }
}


export class MyEditor extends React.Component {

  constructor(props) {
    super(props)

    const { syncContent, content, readOnly, placeholder } = this.props


    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    this.state = {
      syncContent: syncContent, // 编辑器改变的时候，调给外部组件使用
      readOnly: readOnly,
      editorState: content
        ? EditorState.createWithContent(convertFromRaw(JSON.parse(content)), decorator)
        : EditorState.createEmpty(decorator),
      rendered: null,
      placeholder: placeholder
    }

    this.onChange = this._onChange.bind(this)
    this.toggleBlockType = (type) => this._toggleBlockType(type)
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style)
    this.addVideo = this._addVideo.bind(this)
    this.addImage = this._addImage.bind(this)
    this.addLink = this._addLink.bind(this)
    this.addMusic = this._addMusic.bind(this)
    this.handleKeyCommand = this._handleKeyCommand.bind(this)
    // this.undo = this._undo.bind(this)
    // this.redo = this._redo.bind(this)
  }

  componentDidMount() {
    this.onChange(this.state.editorState)
    this.props.getEditor(this.refs.editor)
  }

  _onChange(editorState) {

    const that = this

    this.setState({ editorState }, () => {})


    const { syncContent } = this.state
    const { draftHtml } = this.refs

    if (syncContent) {

      const content = editorState.getCurrentContent()

      let html = redraft(convertToRaw(content), renderers)

      this.setState({
        rendered: html
      })

      setTimeout(()=>{

        console.log(draftHtml.innerHTML);

        // 删除所有空格
        let html = draftHtml.innerHTML.replace(/<!--[\w\W\r\n]*?-->/gmi, '')

        let _html = html.replace(/<p>/gmi, '')
            _html = _html.replace(/<\/p>/gmi, '')

        if (!_html) {
          syncContent('', '')
          return
        }

        syncContent(JSON.stringify(convertToRaw(content)), html)

      }, 100)

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

  _addVideo() {

    let url = prompt("请输入视频地址，目前支持优酷、腾讯视频、YouTuBe","");

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
        alert('地址匹配失败')
      }

    } else if (url.indexOf('youku.com') > -1) {

      let id = url.match(/\/id\_(.*)\.html/)
      id = id && id.length > 0 ? id[1] : ''

      if (id) {
        this._promptForMedia('youku', id)
      } else {
        alert('地址匹配失败')
      }

    } else if (url.indexOf('youtube.com') > -1) {

      let id = url.match(/\/watch\?v\=([0-9a-zA-z\_\-]{1,})$/) || []
      id = id && id.length > 0 ? id[1] : ''

      if (id) {
        this._promptForMedia('youtube', id)
      } else {
        alert('地址匹配失败')
      }

    } else {
      alert('地址匹配失败')
    }

  }

  _addImage(url) {
    this._promptForMedia('image', url)
  }

  _addMusic() {

    let url = prompt("请输入网易音乐的播放地址","");

    if (!url) {
      return
    }

    if (url.indexOf('music.163.com') > -1) {

      let id = url.match(/\?id\=([0-9]{1,})$/) || []
      id = id && id.length > 0 ? id[1] : ''


      if (id && url.indexOf('song') > -1) {
        this._promptForMedia('163-music-song', id)
      } else if (id && url.indexOf('playlist') > -1) {
        this._promptForMedia('163-music-playlist', id)
      } else {
        alert('不能匹配该地址')
      }

    } else {
      alert('不能匹配该地址')
    }

  }

  _addLink(e) {

    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      let url = prompt("请输入url地址以http://或https://开头","");

      if (!url) return

      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'MUTABLE',
        { url: url }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

      this.onChange(RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ))

    } else {
      alert('请先选取需要添加链接的文字内容')
    }

  }

  _promptForMedia(type, src) {

    const { editorState } = this.state;
    const entityKey = Entity.create(type, 'IMMUTABLE', { src: src })

    this.onChange(AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    ))

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

  /*
  _undo() {
    const that = this
    this.onChange(EditorState.undo(this.state.editorState))
    setTimeout(()=>{
      that.onChange(EditorState.redo(that.state.editorState))
      that.state.editorState.focus()
    })
  }
  _redo() {
    this.onChange(EditorState.redo(this.state.editorState))
  }
  */

  render() {
    const self = this
    const { editorState, readOnly, rendered, placeholder } = this.state
    const { displayControls } = this.props


    {/* stripPastedStyles=true 清除复制文本样式*/}
    return(<div className="RichEditor-editor">

            <div ref="draftHtml">
              {rendered}
            </div>

            {displayControls ?
              <Controls
                editorState={editorState}
                toggleBlockType={this.toggleBlockType}
                toggleInlineStyle={this.toggleInlineStyle}
                addVideo={this.addVideo}
                addLink={this.addLink}
                addImage={this.addImage}
                addMusic={this.addMusic}
              />
              : null}

            <Editor
              blockRendererFn={mediaBlockRenderer}
              editorState={editorState}
              blockStyleFn={getBlockStyle}
              onChange={this.onChange}
              handleKeyCommand={this.handleKeyCommand}
              placeholder={placeholder}
              ref="editor"
              stripPastedStyles={true}
              spellCheck
            />

          </div>)
  }
}

MyEditor.defaultProps = {
  displayControls: true,
  syncContent: null,
  content: '',
  readOnly: false,
  getEditor: (editor)=>{},
  placeholder: '请输入正文'
}

export default MyEditor
