import React, { useState, useEffect } from 'react';

// tooles
import avatarPicker from '@app/vendors/avatar-picker';

// redux
import { useStore, useSelector } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { loadUserInfo, updateUser } from '@app/redux/actions/user';

// components
import QiniuUploadImage from '@app/components/qiniu-upload-image';

// styles
import './styles/index.scss';

export default function() {
  
  const [ fileUpload, setFileUpload ] = useState(null);
  const me = useSelector((state:object)=>getUserInfo(state));

  if (!me) return null;

  const store = useStore();
  const _loadUserInfo = (params: any) => loadUserInfo(params)(store.dispatch, store.getState);
  const _updateUser = (params: any) => updateUser(params)(store.dispatch, store.getState);

  const upload = async function(url: string) {

    await _updateUser({ user_cover: url });
    _loadUserInfo({});

    // avatarPicker({
    //   img: url,
    //   selectAreaScale: 0.9,
    //   previews: [],
    //   imgLoadComplete: function() {},
    //   done: async function(p: any){

    //     let avatar = url + "?imageMogr2/crop/!"+parseInt(p.width)+"x"+parseInt(p.height)+"a"+parseInt(p.x)+"a"+parseInt(p.y)+"/thumbnail/!200"

    //     await _updateUser({ avatar: avatar });
    //     _loadUserInfo({});

    //   }
    // })

  }

  useEffect(()=>{
    setFileUpload(<QiniuUploadImage upload={upload} text={'上传封面'} />);
  }, []);

  return (
    <div>

    <div className="card">
      <div className="card-header"><div className="card-title">封面</div></div>
      <div className="card-body">

        <div styleName="cover" style={me.user_cover ? {backgroundImage:`url('${me.user_cover}')`} : null}>
        </div>

        <div styleName="upload">
          {fileUpload}
        </div>

      </div>
    </div>

    </div>
  )
}