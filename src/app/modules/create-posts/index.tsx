import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';

// redux
import { useStore } from 'react-redux';
import { loadPostsList } from '@actions/posts';

// components
import PostsEditor from '@components/editor-posts';
import Loading from '@components/ui/loading';
import SingleColumns from '../../layout/single-columns';

export default function() {

  const [ posts, setPosts ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const store = useStore();

  const { history, location, match } = useReactRouter();

  useEffect(()=>{

    const { posts_id } = location.params;

    if (!posts_id || posts) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);

      let err, res;
      let result: any = await loadPostsList({
        id: 'edit_'+posts_id,
        args: {
          _id: posts_id
        },
        fields: `
          _id
          title
          content
          content_html
          topic_id{
            _id
            name
          }
        `
        /*
        filters: {
          variables: { _id: posts_id },
          select: `
          _id
          title
          content
          content_html
          topic_id{
            _id
            name
          }
          `
        }
        */
      })(store.dispatch, store.getState);

      [ err, res ] = result;
  
      if (!res || !res.data || !res.data[0]) {
      } else {
        setPosts(res.data[0]);
        setLoading(false);
      }
      
    }

    fetchData();

  },[]);

  const successCallback = (posts: any) => {
    history.push(`/posts/${posts._id}`)
  }
  
  if (loading) return <Loading />

  return (<SingleColumns>
    {posts ?
      <PostsEditor successCallback={successCallback} {...posts} /> :
      <PostsEditor successCallback={successCallback} />}
  </SingleColumns>)
  
}