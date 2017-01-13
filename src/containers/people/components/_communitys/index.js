import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import Shell from '../../../../shell'
import NodeList from '../../../../components/node-list'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPeopleById } from '../../../../actions/people'
import { loadQuestionList } from '../../../../actions/question'

class PeopleCommunities extends React.Component {

  // 服务器预加载内容
  static loadData(option, callback) {

    const { id } = option.props.params
    const { dispatch } = option.store

    dispatch(loadPeopleById({
      id,
      callback:(people)=>{
        if (!people) {
          callback('not found')
          return;
        }

        dispatch(loadQuestionList({name:id, filters:{user_id: id}, callback:()=>{
          callback()
        }}))
      }
    }))

  }

  constructor(props) {
    super(props)
  }

  render() {

    const { people } = this.props

    return (
      <div>
        <NodeList name={people._id} filters={{ people_id: people._id, child: 1 }} />
      </div>
    )

  }

}

export default Shell(PeopleCommunities)
