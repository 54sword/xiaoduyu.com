import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';

// redux
import { useStore } from 'react-redux';
import { loadPostsList } from '@app/redux/actions/posts';

// components
import PostsEditor from '@app/components/editor-posts';
import Loading from '@app/components/ui/loading';
import SingleColumns from '@app/layout/single-columns';

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
          markdown
          content
          content_html
          topic_id{
            _id
            name
          }
        `
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
  
  if (loading) return <div className="text-center"><Loading /></div>

  return (<SingleColumns>
    {posts ?
      <PostsEditor successCallback={successCallback} posts={posts} /> :
      <PostsEditor successCallback={successCallback} />}
  </SingleColumns>)
  
}