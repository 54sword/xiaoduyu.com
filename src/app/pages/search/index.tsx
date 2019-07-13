import React, { useState, createRef, useEffect } from 'react';
import useReactRouter from 'use-react-router';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import PostsList from '@modules/posts-list';
import PeopleList from '@modules/people-list';

import SingleColumns from '../../layout/single-columns';

// style
import './index.scss';

export default Shell(function() {

  const { history, location } = useReactRouter();

  const [ q, setQ ] = useState('');
  const [ type, setType ] = useState('');

  useEffect(()=>{

    const { q = '', type = '' } = location.params || {};
    const $search = search.current;

    setQ(decodeURIComponent(q));
    setType(type);

    $search.value = decodeURIComponent(q);

    $search.focus();

  });

  const search = createRef();  

  const handleSearch = function(event: any) {
    event.preventDefault();

    const $search = search.current;

    if (!$search.value) return $search.focus();

    history.push(`/search?q=${$search.value}${type && type == 'user' ? '&type=user' : '' }`);
    setQ($search.value);
  }

  const switchType = function(type: string) {
    if (!type) {
      history.push(`/search?q=${q}`);
    } else {
      history.push(`/search?q=${q}&type=${type}`);
    }
  }

  return (<SingleColumns>

      <Meta title="搜索" />

      <form onSubmit={handleSearch}>
        <div className="input-group">
          <input type="text" styleName="input" className="form-control" ref={search} placeholder="输入关键词搜索" />
          <div className="input-group-append">
            <button type="submit" styleName="search-button" className="btn btn-block btn-primary">搜索</button>
          </div>
        </div>
      </form>

      <div className="card p-2 mt-3 flex-row">
        <a className={`btn btn-sm ${type == '' ? 'btn-primary' : 'btn-link'}`} href="javascript:void(0)" onClick={()=>{ switchType(''); }}>帖子</a>
        <a className={`btn btn-sm ${type == 'user' ? 'btn-primary' : 'btn-link'}`}  href="javascript:void(0)" onClick={()=>{ switchType('user'); }}>用户</a>
      </div>

      {(()=>{
        if (!q) return

        if (!type) {
          return (<PostsList
            id={q}
            query={{
              title: q,
              sort_by: "create_at",
              deleted: false,
              weaken: false
            }}
            scrollLoad={true}
            />)
        } else if (type == 'user') {
          return (<PeopleList
            id={q}
            query={{
              nickname: q
            }}
            />)
        }

      })()}

    </SingleColumns>)
})