import React, { useEffect, useRef, useState } from 'react';
import QiniuUploadImage from '@app/components/qiniu-upload-image';

import './styles/index.scss';

interface Props {
  onChange?: (html: string) => void
  onSubmit: (html: string)=>{}
  content: string
  placeholder: string
  editorStyle: object
  // 控制器
  onLoad: (controller:any)=>{}
}

const Editor = ({ onChange = ()=>{}, onSubmit, content, placeholder, editorStyle = {}, onLoad }: Props) => {

  const editorRef = useRef();
  const [ submitting, setSubmitting ] = useState(false);

  const onInput = (e: any) => {
    // editorRef = editorRef;
    let content = e.target.innerHTML;
    if (content == '<br>') content = '';
    onChange(content);
    if (!content) editorRef.current.innerHTML = '';
  }

  // 清空内容
  const clearContent = function() {
    editorRef.current.innerHTML = '';
  }

  const blur = function() {
    editorRef.current.blur();
  }

  const focus = function() {
    editorRef.current.focus();
  }

  function getTargetNode (ele: any, target: any): boolean {
    //ele是内部元素，target是你想找到的包裹元素
    if(!ele || ele === document) return false;
    return ele === target ? true : getTargetNode(ele.parentNode,target);
  }

  const innterHTML = (html: string) => {
    
    const $editor = editorRef.current;

    // 返回插入符号当前位置的selection对象
    let selection: any = window.getSelection();

    /*
    console.log(document.activeElement);
    // console.log(!getTargetNode($editor, document.activeElement));
    
    if (document.activeElement.tagName == 'BODY' ||
      !getTargetNode($editor, document.activeElement)
    ) {
      $editor.innerHTML = $editor.innerHTML + html;
      // return;
    } else 
    */

    // 焦点在当前编辑器中
    if (selection && selection.focusNode && $editor == selection.focusNode.parentNode) {
      // console.log('=====');
      let range = selection.getRangeAt(0);

      let fragment = range.createContextualFragment(html);
      range.insertNode(fragment.lastChild);
    } else {
      $editor.innerHTML = $editor.innerHTML + html;
    }

   
    /*
    if (selection.rangeCount == 0) {
      $editor.innerHTML = $editor.innerHTML + html;
      // return;
    } else {
      console.log('test ====');
      let range = selection.getRangeAt(0);

      let fragment = range.createContextualFragment(html);
      range.insertNode(fragment.lastChild);
    }
    */

    setTimeout(()=>{
      onChange($editor.innerHTML);
    });
    
  }

  const addImage = (src: string) => {
    innterHTML("<img src=\""+src+"\" />");
    // innterHTML('<br>');
  }
  
  useEffect(()=>{

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

    if (content) innterHTML(content);

    if (onLoad) {
      onLoad({
        clearContent,
        blur,
        focus,
        innterHTML,
        addImage
      })
    }

    // editorRef.current.addEventListener("copy", function (e: any){
    //   // console.log(e);

    //   var content = window.getSelection();
    //   console.log(content)
    // })


    editorRef.current.addEventListener("paste", function (e: any){

      var content;
      e.preventDefault();

      var clipboardData = window.clipboardData; //for IE   
      if (!clipboardData) { // for chrome   
        clipboardData = e.clipboardData;  
      }

      //兼容写法，优先取 files
      if(clipboardData.files && clipboardData.files.length > 0){
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

    /*
    // 换行使用br
    editorRef.current.addEventListener('keypress', function(e: any) {
      if (e.keyCode==13) { //enter && shift
     
        e.preventDefault(); //Prevent default browser behavior
        if (window.getSelection) {
          var selection: any = window.getSelection(),
              range = selection.getRangeAt(0),
              br = document.createElement("br"),
              textNode = document.createTextNode("\u00a0"); //Passing " " directly will not end up being shown correctly
          range.deleteContents();//required or not?
          range.insertNode(br);
          range.collapse(false);
          range.insertNode(textNode);
          range.selectNodeContents(textNode);
     
          selection.removeAllRanges();
          selection.addRange(range);
          return false;
        }
     
      }
     });
     */

  }, []);
  

  const submit = async () => {

    if (submitting) return;
    setSubmitting(true);
    await onSubmit(editorRef.current.innerHTML);

    // 如果有await继续，则将改变提交安装状态，让其可以继续提交
    setSubmitting(false);
  }

  return(<>
    <div styleName="header" className="border-bottom">
      <QiniuUploadImage
        beforeUpload={(files: any)=>{
        }}
        upload={(url: string, file: any)=>{
          addImage(url);
        }}
        text={<span styleName="add-image">
            <svg>
              <use xlinkHref="/feather-sprite.svg#image"/>
            </svg>
            插入图片
        </span>}
        />
    </div>
    {/* plaintext-only */}
    <div
      ref={editorRef}
      styleName="editor"
      contentEditable="true"
      placeholder={placeholder}
      onInput={onInput}
      style={editorStyle}
      > 
    </div>
    <div className="d-flex justify-content-between border-top" styleName="footer">
      <div></div>
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
  </>)
}

export default Editor;