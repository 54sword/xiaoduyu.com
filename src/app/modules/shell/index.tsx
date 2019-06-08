import React, { useState, useEffect } from 'react';

// redux
// import { bindActionCreators } from 'redux';
import { useStore } from 'react-redux';
import { saveScrollPosition, setScrollPosition } from '../../store/actions/scroll';
// import { addVisitHistory } from '../../store/actions/history';

// tools
import parseUrl from '../../common/parse-url';


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

export default function(Component: object) {

  return function ({ history, location, match, staticContext }: Props) {

    const store = useStore();

    const { pathname, search } = location;

    location.params = search ? parseUrl(search) : {};

    useEffect(() => {
      setScrollPosition(pathname + search)(store.dispatch, store.getState);
      return () => {
        saveScrollPosition(pathname + search)(store.dispatch, store.getState);
      }
    });
    
    return (<Component match={match} />)

  }

}