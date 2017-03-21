import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getAccessToken, getProfile } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Nav from '../../components/nav'
import Subnav from '../../components/subnav'
import NodeList from '../../components/topic-list'

export class AllTopic extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { isSignin, me } = this.props

    // <Subnav />
    return (
      <div>
        <Meta meta={{ title: '社群' }} />
        <Nav />
        <div className="container">

          <Tabs selectedIndex={0}>

            <TabList>
              <Tab>社群</Tab>
              <Tab>社群主分类</Tab>
            </TabList>

            <TabPanel>
              <NodeList name="all-node-1" filters={{child:1}} />
            </TabPanel>

            <TabPanel>
              <NodeList name="all-node-2" filters={{child:-1}} />
            </TabPanel>

          </Tabs>
        </div>
      </div>
    )
  }

}

AllTopic.propTypes = {
  isSignin: PropTypes.bool.isRequired,
  me: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    isSignin: getAccessToken(state) ? true : false,
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

AllTopic = connect(mapStateToProps, mapDispatchToProps)(AllTopic)


export default Shell(AllTopic)
