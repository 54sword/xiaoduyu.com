import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPeopleList } from '@actions/people';
import { getPeopleListById } from '@reducers/people';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import Loading from '@components/ui/full-loading';
import PeopleActivities from '@modules/people-activities';
import PeopleProfileHeader from '@modules/people-profile-header';

import SingleColumns from '../../layout/single-columns';

@Shell
@connect(
  (state, props) => {
    const { id } = props.match.params;
    return {
      list: getPeopleListById(state, id)
    }
  },
  dispatch => ({
    loadPeopleList: bindActionCreators(loadPeopleList, dispatch)
  })
)
export default class PeopleDetailHead extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    
    const { id } = this.props.match.params;
    let { loadPeopleList, list, notFoundPgae } = this.props;

    if (!list || !list.data) {
      await loadPeopleList({
        name:id,
        filters: {
          variables: { _id: id, blocked: false }
        }
      });
    }

    list = this.props.list;

    if (!list || !list.data || !list.data[0]) {
      notFoundPgae('该用户不存在');
    }

  }

  render() {

    let { data = [], loading } = this.props.list || {};
    let people = data[0] || null;

    if (!people || loading) return <Loading />;
    
    return (<SingleColumns>
      <Meta title={people.nickname} />
      <PeopleProfileHeader people={people} />
      <PeopleActivities people={people} />
    </SingleColumns>)

  }

}