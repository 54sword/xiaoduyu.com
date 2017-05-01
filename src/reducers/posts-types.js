
let initialState = {
  1: {
    _id: 1,
    name: '说说',
    title: '请输入标题',
    content: '如果标题已表达完整内容，则正文可以为空'
  },
  2: {
    _id: 2,
    name: '提问',
    title: '请输入问题的标题',
    content: '请输入问题的描述'
  },
  3: {
    _id: 3,
    name: '写文章',
    title: '请输入文章的标题',
    content: '请输入正文，正文内容不能少于300字'
  }
}

export default function postsTypes(state = initialState, action) {

  switch (action.type) {
    default:
      return state
  }

}

export const getPostsTypeById = (state, id) => {
  return state.postsTypes[id] || state.postsTypes[1]
}
