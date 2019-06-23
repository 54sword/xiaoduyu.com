import React from 'react'

// redux
import { useSelector } from 'react-redux';
import { getProfile } from '@reducers/user';

// components
import SignModal from './sign-modal';
import EditorModalComment from './editor-comment-modal';
import ReportModal from './report-modal';
import BindingPhone from './binding-phone-modal';
import UnlockToken from './unlock-token-modal';

export default function() {
  
  const me = useSelector((state: object)=>getProfile(state));

  if (!me) return <SignModal />;

  return (<>
    <EditorModalComment />
    <ReportModal />
    <BindingPhone />
    <UnlockToken />
  </>)
}