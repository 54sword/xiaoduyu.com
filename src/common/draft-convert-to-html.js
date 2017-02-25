
import DraftJSONConvertToHtml from './draft-json-convert-to-raw'

import redraft from 'redraft'

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
  },
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
    CODE: (children, { key }) => <span key={key} style={stylesa.code}>{children}</span>,
    LINK: (children, data, { key }) => <a href={data.src}>{data.src}</a>
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
    'code-block': (children, { keys }) => <pre style={stylesa.codeBlock} key={keys[0]} >{addBreaklines(children)}</pre>,
    // or depth for nested lists
    'unordered-list-item': (children, { depth, keys }) => <ul key={keys[keys.length - 1]} className={`ul-level-${depth}`}>{children.map((child, index) => <li key={keys[index]}>{child}</li>)}</ul>,
    'ordered-list-item': (children, { depth, keys }) => <ol key={keys.join('|')} className={`ol-level-${depth}`}>{children.map((child, index)=> <li key={keys[index]}>{child}</li>)}</ol>,
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
    // LINK: (children, data, { key }) => <Link key={key} to={data.url}>{children} </Link>,
    youku: (children, data, { key }) => <div><Embed src={`http://player.youku.com/player.php/sid/${data.src}/v.swf`}></Embed></div>,
    tudou: (children, data, { key }) => <div><Iframe src={`http://www.tudou.com/programs/view/html5embed.action?code=${data.src}`} allowtransparency="true" allowfullscreen="true" allowfullscreenInteractive="true" scrolling="no" border="0" frameborder="0" width="auto" height="auto" position=""></Iframe></div>,
    qq: (children, data, { key }) => <div><Embed src={`http://static.video.qq.com/TPout.swf?vid=${data.src}&auto=0`}></Embed></div>,
  }
}

const JSONConvertToHtml = (json) => {
  return redraft(DraftJSONConvertToHtml(json), renderers)
}


export default JSONConvertToHtml
