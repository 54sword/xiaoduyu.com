import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadPeopleList } from '@actions/people';
import { getPeopleListById } from '@reducers/people';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import Loading from '@components/ui/loading';
import PeopleActivities from '@modules/people-activities';
import PeopleProfileHeader from '@modules/people-profile-header';

import SingleColumns from '../../layout/single-columns';

export default Shell(function({ setNotFound }: any) {

  const { location, match } = useReactRouter();
  const { id } = match.params;

  const store = useStore();
  const _loadPeopleList = (args:object)=>loadPeopleList(args)(store.dispatch, store.getState);
  const list = useSelector((state: object)=>getPeopleListById(state, id));

  let { data = [], loading, more }: any = list || {};
  let people = data[0] || null;

  useEffect(()=>{
    
    if (!people) {

      _loadPeopleList({
        id,
        args: {
          _id: id,
          blocked: false
        }
      }).then(([err, res]: any)=>{

        if (res && res.data && !res.data[0]) {
          setNotFound('该用户不存在')
        }
        
      })
    }

  },[]);

  if (!people || loading) return <Loading />;
  
  return (<SingleColumns>
    <Meta title={people.nickname} />
    <PeopleProfileHeader people={people} />
    <PeopleActivities people={people} />
  </SingleColumns>)

})