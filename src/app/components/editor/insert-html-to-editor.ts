/**
 * 插入html到编辑器
 * 
 * el 编辑器的对象
 * html 插入内容
 */
export default (editor: any, html: string, focus: boolean = false): void => {

  // 如果不需要focus，从尾部添加
  if (!focus) {
    editor.innerHTML = editor.innerHTML + html;
    return;
  }

  editor.focus();
  
  let sel: any, range;
  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();

      // Range.createContextualFragment() would be useful here but is
      // only relatively recently standardized and is not supported in
      // some browsers (IE9, for one)
      let el = document.createElement("div");
      el.innerHTML = html;
      let frag = document.createDocumentFragment(), node, lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type != "Control") {
    // IE < 9
    document.selection.createRange().pasteHTML(html);
  }
}

/*
// 返回插入符号当前位置的selection对象
let selection: any = window.getSelection();

// 焦点在当前编辑器中
if (selection && selection.focusNode && $editor == selection.focusNode.parentNode) {
  let range = selection.getRangeAt(0);
  let fragment = range.createContextualFragment(html);
  range.insertNode(fragment.lastChild);
} else {
  $editor.innerHTML = $editor.innerHTML + html;
}
*/