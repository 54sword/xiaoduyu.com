import React from 'react'

// redux
import { useSelector } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';

// components
import SignModal from './sign-modal';
import EditorModalComment from './editor-comment-modal';
import ReportModal from './report-modal';
import BindingPhone from './binding-phone-modal';
import UnlockToken from './unlock-token-modal';
import BackToTop from './back-to-top';

export default function() {
  
  const me = useSelector((state: object)=>getUserInfo(state));

  if (!me) return <SignModal />;

  return (<>
    <BackToTop />
    {!me ?
      <SignModal /> :
      <>
        <EditorModalComment />
        <ReportModal />
        <BindingPhone />
        <UnlockToken />
      </>}
  </>)
}