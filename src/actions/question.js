
import Ajax from '../common/ajax'

// 添加问题
export function addQuestion({ title, detail, detailHTML, nodeId, device, type, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let questionList = getState().questionList['home']

    Ajax({
      url: '/write-question',
      type:'post',
      data: {
        title: title,
        detail: detail,
        detail_html: detailHTML,
        node_id: nodeId,
        device_id: device,
        type: type
      },
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) {
          callback(false, res.data)
          questionList.data.unshift(processQuestionList([res.data])[0])
          dispatch({ type: 'SET_QUESTION_LIST_BY_NAME', name: 'home', data: questionList })
        } else {
          callback(res.error || true)
        }
      }
    })

  }
}


// 添加问题
export function updateQuestionById({ id, title, detail, detailHTML, callback }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let state = getState().questionList

    Ajax({
      url: '/update-question',
      type:'post',
      data: {
        id: id,
        title: title,
        detail: detail,
        detail_html: detailHTML
      },
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && res.success) {

          for (let i in state) {
            let data = state[i].data
            if (data.length > 0) {
              for (let n = 0, max = data.length; n < max; n++) {
                if (data[n]._id == id) {
                  state[i].data[n].title = title
                  state[i].data[n].content = detail
                  state[i].data[n].content_html = detailHTML
                }
              }
            }
          }

          dispatch({ type: 'SET_QUESTION', state })

        }

        callback(res)
      }
    })

  }
}


export function loadQuestionById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let questionList = getState().questionList['other'].data

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    Ajax({
      url: '/questions',
      type: 'get',
      params: { question_id: id, draft: 1 },
      headers,
      callback: (res) => {

        if (!res || !res.success || res.data.length == 0) {
          callback(null)
          return
        }

        var exsit = false

        questionList.map((item)=>{
          if (item._id == res.data[0]._id) {
            exsit = true
          }
        })
        
        if (!exsit) {
          questionList.push(res.data[0])
          dispatch({ type: 'ADD_QUESTION', questionList: questionList })
        }

        callback(res.data[0])
      }
    })
  }
}


// 加工问题列表
const processQuestionList = (list) => {

  for (let i = 0, max = list.length; i < max; i++) {
    let answerList = list[i].answers
    for (let n = 0, length = answerList.length; n < length; n++) {

      let text = answerList[n].content_html.replace(/<[^>]+>/g,"")

      if (text.length > 140) {
        text = text.slice(0, 140)+'...'
      }

      list[i].answers[n].content_summary = text
      // list[i].answers[n].media = raw.entityMap[0] ? raw.entityMap[0].data.src : ''
    }
  }

  return list

}

export function loadQuestionList({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    let accessToken = getState().user.accessToken
    let questionList = getState().questionList[name] || {}

    if (typeof(questionList.more) != 'undefined' && !questionList.more ||
      questionList.loading
    ) {

      callback()
      return
      return {
        then:(callback) => {
          callback()
        }
      }
    }

    if (!questionList.data) {
      questionList.data = []
    }

    if (!questionList.filters) {

      if (!filters.lt_date) filters.lt_date = new Date().getTime()
      if (!filters.per_page) filters.per_page = 10

      questionList.filters = filters
    } else {
      filters = questionList.filters
      if (questionList.data[questionList.data.length - 1]) {
        filters.lt_date = new Date(questionList.data[questionList.data.length - 1].sort_by_date).getTime()
      }
    }

    if (!questionList.more) {
      questionList.more = true
    }

    if (!questionList.count) {
      questionList.count = 0
    }

    if (!questionList.loading) {
      questionList.loading = true
    }

    dispatch({ type: 'SET_QUESTION_LIST_BY_NAME', name, data: questionList })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    // filters.method = accessToken ? 'user_custom' : ''

    return Ajax({
      url: '/questions',
      params: filters,
      headers,
      callback: (res) => {

        if (!res || !res.success) {
          callback(res)
          return
        }

        questionList.more = res.data.length < questionList.filters.per_page ? false : true
        questionList.data = questionList.data.concat(processQuestionList(res.data))
        questionList.filters = filters
        questionList.count = 0
        questionList.loading = false

        dispatch({ type: 'SET_QUESTION_LIST_BY_NAME', name, data: questionList })
        callback(res)
      }
    })

  };
}
