import React, { useEffect, useRef, useState } from 'react';
import QiniuUploadImage from '@app/components/qiniu-upload-image';
import insertHtmlToEditor from './insert-html-to-editor';
import insertTextToEditor from './insert-text-to-editor';
import Modal from '@app/components/bootstrap/modal';
import HTMlText from '@app/components/html-text';
import showdown from 'showdown';

import './styles/index.scss';

// 光标插入text和html的一些方法
// http://caibaojian.com/js-insertcur.html

interface Props {
  // 编辑器发生变化
  onChange?: (content: string) => void
  // 点击提交按钮
  onSubmit: (content: string) => void
  placeholder?: string
  // 编辑器样式
  editorStyle?: object
  // 控制器
  getEditorController?: (controller: any) => void
  // 是否显示markdown
  displayMode?: boolean,
  // 是否默认使用markdown
  markdown?: boolean,
  // 编辑器模式切换时候触发事件 rich 富文本、markdown
  onModeChange?: (mode: 'rich' | 'markdown') => void
  // 初始化完成事件，只执行一次
  onInit?: () => void
  // 是否显示控制器
  displayController?: boolean
}

export default ({
  onChange = () => { },
  onSubmit,
  placeholder,
  editorStyle = {},
  getEditorController = () => { },
  displayMode = false,
  markdown = false,
  onModeChange = () => { },
  onInit = () => { },
  displayController = true
}: Props) => {

  // console.log(displayController);

  const editorRef = useRef();
  const [submitting, setSubmitting] = useState(false);
  const [ isMarkdown, setMarkdown ] = useState(markdown);
  const [ preview, setPreview ] = useState('');

  const getEditorContent = () => {
    return editorRef.current[isMarkdown ? 'value' : 'innerHTML'];
  }

  // 清空内容
  const clear = () => {
    if (isMarkdown) {
      editorRef.current.value = '';
    } else {
      editorRef.current.innerHTML = '';
    }
  }
  const blur = () => editorRef.current.blur();
  const focus = () => editorRef.current.focus();
  const insert = (html: string, focus: boolean = false) => {

    const $editor = editorRef.current;

    if (isMarkdown) {
      insertTextToEditor($editor, html, focus);
    } else {
      insertHtmlToEditor($editor, html, focus);
    }

    setTimeout(() => {
      onChange(getEditorContent());
    });
  }
  const onFocus = () => {
  }
  const onBlur = () => {
  }

  const insertImage = (src: string) => {
    if (isMarkdown) {
      insert(`\r![${src}](${src})`, true);
    } else {
      insert("<br><img src=\"" + src + "\" /><br>", true);
    }
  }

  const onMount = () => {

    getEditorController({ clear, blur, focus, insert });

    // document.execCommand("defaultParagraphSeparator", false, "div");

    // 让ie9兼容 createContextualFragment
    if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment) {
      Range.prototype.createContextualFragment = function (html) {
        var frag = document.createDocumentFragment(),
          div = document.createElement("div");
        frag.appendChild(div);
        div.outerHTML = html;
        return frag;
      };
    }

    // editorRef.current.addEventListener("copy", function (e: any){
    //   var content = window.getSelection();
    //   console.log(content)
    // })

    editorRef.current.addEventListener("paste", function (e: any) {

      var content;
      e.preventDefault();

      var clipboardData = window.clipboardData; //for IE   
      if (!clipboardData) { // for chrome   
        clipboardData = e.clipboardData;
      }

      //兼容写法，优先取 files
      if (clipboardData.files && clipboardData.files.length > 0) {
        // mapFile(clipboardData.files);
        // return ;
      }

      if (clipboardData.items && clipboardData.items.length > 0) {
        // mapFile(clipboardData.items);
        // return ;
      }

      content = clipboardData.getData('text/plain');

      // https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand#Commands
      document.execCommand('insertText', false, content);

      // content = content.replace(/<[^>]+>/g,"");
      // content = clipboardData.getData('text/html');
      // document.execCommand('insertHTML', false, content);

    });
  }

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    await onSubmit(getEditorContent());
    // 如果有await继续，则将改变提交安装状态，让其可以继续提交
    setSubmitting(false);
  }

  // 编辑器内容发现变化
  const onInput = (e: any) => {
    if (!isMarkdown) {
      let content = editorRef.current.innerHTML;
      if (content == '<br>') content = '';
      if (!content) editorRef.current.innerHTML = '';
    }

    onChange(getEditorContent());
  }

  // 模式发生变化
  const onChangeMode = () => {
    if (window.confirm('切换编辑器后，当前已编辑内容会丢失，请确认是否需要切换？')) {
      setMarkdown(isMarkdown ? false : true);
      onModeChange(isMarkdown ? 'rich' : 'markdown');
      onMount();
    }
  }

  const previewMarkdown = () => {
    
    const converter = new showdown.Converter();
    // converter.setOption('tables', true);
    converter.setOption("simpleLineBreaks", true);

    setPreview(converter.makeHtml(getEditorContent()));

    $(`#preview`).modal('show');
  }

  useEffect(() => {
    onMount();
    onInit();
  }, []);

  return (<>

    {/* header */}
    {displayController ?
    <div styleName="header" className="border-bottom d-flex justify-content-between">
      <div>
        <QiniuUploadImage
          beforeUpload={(files: any) => {
          }}
          upload={(url: string, file: any) => {
            setTimeout(()=>{
              insertImage(url);
            }, 500);
          }}
          text={<span styleName="add-image">
            <svg>
              <use xlinkHref="/feather-sprite.svg#image" />
            </svg>
            上传图片
          </span>}
        />
        {isMarkdown ?
          <span className="ml-3 a" styleName="eye" onClick={previewMarkdown}>
            <svg>
              <use xlinkHref="/feather-sprite.svg#eye" />
            </svg>
            预览效果
          </span>
          : null}
      </div>
      <div>
        {displayMode ?
          <span className="a" onClick={onChangeMode}>
            <svg styleName="repeat-icon">
              <use xlinkHref="/feather-sprite.svg#repeat" />
            </svg>
            {!isMarkdown ? 'Markdown编辑器' : '富文本编辑器'}
          </span>
          : null}
      </div>
    </div>
    : null}

    {/* body */}
    {isMarkdown ?
      <textarea
        ref={editorRef}
        styleName="markdown-editor"
        onChange={onInput}
        placeholder={placeholder}
        style={editorStyle}
        onFocus={onFocus}
        onBlur={onBlur}
      >
      </textarea>
      :
      <div
        ref={editorRef}
        styleName="editor"
        contentEditable="true"
        placeholder={placeholder}
        onInput={onInput}
        style={editorStyle}
        onFocus={onFocus}
        onBlur={onBlur}
      >
      </div>}

    {/* footer */}
    <div className="d-flex justify-content-between border-top" styleName="footer">
      <div>
      </div>
      <div>
        <button
          type="button"
          className="btn btn-block btn-primary rounded-pill btn-sm pl-3 pr-3"
          onClick={submit}
        >
          {submitting ? '提交中...' : '提交'}
        </button>
      </div>
    </div>
    
    <Modal
      id="preview"
      header={<div className="pb-3">
      <HTMlText content={preview} />
    </div>}
      size={true}
      // body={<div className="p-3 pt-0">
      //   <HTMlText content={preview} />
      // </div>}
      />

  </>)
}
