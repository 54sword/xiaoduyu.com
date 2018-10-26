import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from "node-fetch";

import { graphql_url } from '../../config';

const client = new ApolloClient({
  // 如果开启ssrMode, fetchPolicy: 'network-only' 则会无效
  ssrMode: false,
  // ssrMode: process && process.env && process.env.__NODE__ ? process.env.__NODE__ : false,
  link: new HttpLink({
    uri: graphql_url,
    fetch: fetch
  }),
  cache: new InMemoryCache({
    // addTypename: false
  })
});

export default ({ query, mutation, headers = { role: 'user' }, fetchPolicy = 'network-only' }) => {

  let options = { context: {} };

  options.fetchPolicy = fetchPolicy;




  if (query) options.query = gql`${query}`;
  if (mutation) options.mutation = gql`${mutation}`;
  if (headers) options.context.headers = headers;

  let fn = query ? client.query : client.mutate;

  return new Promise(resolve=>{
    return fn(options).then(res=>{
      resolve([null, res]);
    }).catch(res=>{
      // console.log(res.graphQLErrors);
      if (res.graphQLErrors.length > 0) {
        resolve([res.graphQLErrors]);
      } else {
        resolve(['未知错误']);
      }
    });
  });

}
