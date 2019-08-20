import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';

import { domainName, name } from '@config';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadPeopleList } from '@app/redux/actions/people';
import { getPeopleListById } from '@app/redux/reducers/people';

// components
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';
import Loading from '@app/components/ui/loading';
import PeopleActivities from '@app/modules/people-activities';
import PeopleProfileHeader from '@app/modules/people-profile-header';

import SingleColumns from '@app/layout/single-columns';

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

  if (!people || loading) return <div className="text-center"><Loading /></div>;
  
  return (<SingleColumns>
    <Meta title={people.nickname}>
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:type" content="profile" />
      <meta property="og:title" content={people.nickname} />
      {people.brief ? <meta name="description" content={`${people.brief}`} /> : null}
      <meta property="og:url" content={`${domainName}/people/${people._id}`} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={people.avatar_url ? 'https:'+people.avatar_url : domainName+'./512x512.png'} />
    </Meta>

    <PeopleProfileHeader people={people} />
    <PeopleActivities people={people} />
  </SingleColumns>)

})