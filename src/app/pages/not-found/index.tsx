import React from 'react';

// modules
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';

const NotFound = () => {
  return (
    <>
      <Meta title="404,无法找到该页面" />
      <div className="text-center mt-5"><h3>404,无法找到该页面</h3></div>
    </>
  )
}

NotFound.loadDataOnServer = async function({ store, match, res, req, user }: any) {
  return { code:404 }
}

export default Shell(NotFound)