import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useStore, useSelector } from 'react-redux';
import { loadLinkListById } from '@app/redux/actions/links';
import { getLinkListById } from '@app/redux/reducers/links';

type item = { name: string, domain: string, description: string, recommend?: boolean }

const Links = function() {

  const store = useStore();
  const links = useSelector((state: any)=>getLinkListById(state, 'recommend'));

  const componentsDidMount = async () => {

    if (!links) {
      await loadLinkListById('recommend')(store.dispatch, store.getState);
    }

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

  }

  useEffect(()=>{
    componentsDidMount();
  }, []);

  if (!links || !links.length) return null;
  
  return(
    <div className="card">
      <div className="card-header"><div className="card-title">友情链接</div></div>
      <div className="card-body row">
        {links.map((item: item)=>{
          if (!item.recommend) return null;
          return (<div key={item.domain} className="col-6 mb-1">
            <a href={item.domain} className="text-dark" target="_blank" data-toggle="tooltip" data-placement="top" title={item.description || item.name}>
              {item.name}
            </a>
          </div>)
        })}
      <div className="col-12 mt-2">
        <Link to="/links">查看全部</Link>
      </div>
      </div>

    </div>
  )

}

Links.loadDataOnServer = async ({ store, match, res, req, user }: any) => {

  if (user) return;

  await loadLinkListById('recommend')(store.dispatch, store.getState);
}

export default Links;
