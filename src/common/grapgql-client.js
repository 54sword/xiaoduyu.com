import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from "node-fetch";

import { graphql_url } from '../../config'

const client = new ApolloClient({
  // 如果开启ssrMode, fetchPolicy: 'network-only' 则会无效
  ssrMode: false,
  // ssrMode: process && process.env && process.env.__NODE__ ? process.env.__NODE__ : false,
  link: new HttpLink({
    uri: graphql_url,
    fetch: fetch
  }),
  cache: new InMemoryCache({
    addTypename: false
  })
})

export default ({ query, mutation, headers = {}, fetchPolicy = 'network-only' }) => {

  let options = {
    context: {}
  }

  // network-only 不缓存
  // if (fetchPolicy) {
    options.fetchPolicy = fetchPolicy;
  // } else {
  //   options.fetchPolicy = "network-only";
  // }

  if (!headers.role) headers.role = 'admin';

  if (query) options.query = gql`${query}`;
  if (mutation) options.mutation = gql`${mutation}`;
  if (headers) options.context.headers = headers

  let fn = query ? client.query : client.mutate

  return fn(options).then(res=>{
    return [null, res]
  }).catch(res=>{

    /*
    if (!process.env.__NODE__) {

      Toastify({
        text: res.graphQLErrors.length > 0 ? res.graphQLErrors[0].message : '请求失败',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

    }
    */

    return [res.graphQLErrors]
  });
}
