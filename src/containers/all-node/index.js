import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadNodes } from '../../actions/nodes'
import { getAccessToken, getProfile } from '../../reducers/user'

import Subnav from '../../components/subnav'
import Meta from '../../components/meta'
import Shell from '../../shell'
import NodeList from '../../components/node-list'

class AllNode extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { isSignin, me } = this.props

    return (
      <div>
        <Meta meta={{ title: '社群' }} />
        <Subnav />
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

AllNode.propTypes = {
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

AllNode = connect(mapStateToProps, mapDispatchToProps)(AllNode)


export default Shell(AllNode)
