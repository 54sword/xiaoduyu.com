import React, { useState, useEffect } from 'react';

// redux
import { useStore } from 'react-redux';
import { saveScrollPosition, setScrollPosition } from '@actions/scroll';
// import { addVisitHistory } from '../../store/actions/history';

// tools
import parseUrl from '@utils/parse-url';

type Props = {
  history: any,
  location: {
    pathname: string,
    search: string,
    hash: string,
    params: object
  },
  match: {
    path: string,
    url: string,
    isExact: boolean,
    params: object
  },
  staticContext: {
    code: number
  }
}

export default function(Component: any) {

  return function ({ history, location, match, staticContext }: Props) {

    const [ notFound, setNotFound ] = useState('');

    const store = useStore();

    const { pathname, search } = location;

    location.params = search ? parseUrl(search) : {};

    useEffect(() => {
      setScrollPosition(pathname + search)(store.dispatch, store.getState);
      return () => {
        saveScrollPosition(pathname + search)(store.dispatch, store.getState);
      }
    }, []);

    if (notFound) {
      return <div className="container text-center">{notFound}</div>
    }
    
    return (<Component match={match} setNotFound={setNotFound} />)

  }

}