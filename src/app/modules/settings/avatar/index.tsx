import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// tooles
import avatarPicker from '../../../vendors/avatar-picker';

// redux
// import { bindActionCreators } from 'redux';
import { useStore, useSelector } from 'react-redux';
import { getUserInfo } from '@reducers/user';
import { loadUserInfo, updateUser } from '@actions/user';

// components
import QiniuUploadImage from '@components/qiniu-upload-image';

// styles
import './style.scss';

export default function() {

  const [ fileUpload, setFileUpload ] = useState(null);
  // const [ uploadStatus, setUploadStatus ] = useState(false);

  const me = useSelector((state:object)=>getUserInfo(state));


  if (!me) return null;

  const store = useStore();
  const _loadUserInfo = (params: any) => loadUserInfo(params)(store.dispatch, store.getState);
  const _updateUser = (params: any) => updateUser(params)(store.dispatch, store.getState);

  const upload = function(url: string) {

    avatarPicker({
      img: url,
      selectAreaScale: 0.9,
      previews: [],
      imgLoadComplete: function() {},
      done: async function(p: any){

        let avatar = url + "?imageMogr2/crop/!"+parseInt(p.width)+"x"+parseInt(p.height)+"a"+parseInt(p.x)+"a"+parseInt(p.y)+"/thumbnail/!200"

        await _updateUser({ avatar: avatar });
        _loadUserInfo({});

      }
    })

  }

  useEffect(()=>{
    setFileUpload(<QiniuUploadImage upload={upload} text={'上传头像'} />);
  });

  return (
    <div>

    <div className="card">
      <div className="card-header">头像</div>
      <div className="card-body">

        <div styleName="avatar">
          <img src={me.avatar_url.replace('!50', "!200")} />
        </div>

        <div styleName="upload">
          {fileUpload}
        </div>

      </div>
    </div>

    </div>
  )
}