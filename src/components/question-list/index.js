import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import styles from './style.scss'

// 依赖的外部功能
import arriveFooter from '../../common/arrive-footer'

// actions and reducers
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadQuestionList } from '../../actions/question'
import { getQuestionListByName } from '../../reducers/question-list'

import ListLoading from '../list-loading'
import QuestionItem from '../question-item'

class QuestionsList extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const { questionList, loadQuestionList, name, filters } = this.props

    if (!questionList.data) {
      loadQuestionList({ name, filters })
    }

    arriveFooter.add(name, ()=>{
      loadQuestionList({ name, filters })
    })
  }

  componentWillUnmount() {
    const { name } = this.props
    arriveFooter.remove(name)
  }

  /*
  componentWillReceiveProps(props) {

    if (props.update != this.props.update) {

      const { resetNewQuestionList, loadQuestions } = this.props

      // console.log(props.update + '|' + this.props.update)

      resetNewQuestionList({ name: props.name, filters: props.filters })
      loadQuestions()
    }
  }
  */

  render () {
    const { questionList, loadQuestionList } = this.props

    // 当没有数据的情况
    if (typeof questionList.data == "undefined") {
      return (<div></div>)
    }

    const { data, loading, more } = questionList

    return (
      <div>

        <div className={styles.list}>
          {data.map(question=>{
            return (<div key={question._id}><QuestionItem question={question} /></div>)
          })}
        </div>

        <ListLoading loading={loading} more={more} handleLoad={loadQuestionList} />

      </div>
    )
  }

}

QuestionsList.propTypes = {
  questionList:  PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  const { name } = props
  return {
    questionList: getQuestionListByName(state, name)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadQuestionList: bindActionCreators(loadQuestionList, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(QuestionsList)
