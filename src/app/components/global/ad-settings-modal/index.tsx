import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import To from '@utils/to';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadADlist, addAD, updateAD } from '@actions/ad';
import { getADListDataById } from '@reducers/ad';
import { getUserInfo } from '@reducers/user';

// components
import Modal from '@components/bootstrap/modal';
import QiniuUploadImage from '@components/qiniu-upload-image';


// styles
import './index.scss';

export default function() {

  const pcUrl = useRef();
  const closeSwitch = useRef();
  const me = useSelector((store: any)=>getUserInfo(store));

  const store = useStore();
  const load = (params: any) => loadADlist(params)(store.dispatch, store.getState);
  const add = (params: any) => addAD(params)(store.dispatch, store.getState);
  const update = (params: any) => updateAD(params)(store.dispatch, store.getState);


  const [ pcImg, setPCImg ] = useState('');
  const [ loading, setLoading ] = useState(true);

  const componentDidMount = () => {

    $('#ad-settings').on('show.bs.modal', async (e: any) => {

      let [ ad ] = getADListDataById(store.getState(), me.ad);

      setLoading(true);

      if (!ad) {

        await load({
          id: me.ad,
          args: { _id: me.ad }
        });
      }

      [ ad ] = getADListDataById(store.getState(), me.ad);

      setLoading(false);

      if (ad) {
        setPCImg(ad.pc_img);
        pcUrl.current.value = ad.pc_url;
        closeSwitch.current.checked = ad.close;
      }

    });

    // $('#ad-settings').on('hide.bs.modal', (e: any) => {
    // });

  }

  const submit = async () => {

    if (!pcImg) {
      Toastify({
        text: '请上传图片',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
      return
    }

    if (!pcUrl.current.value) {
      pcUrl.current.focus();
      return
    }

    let err, res;

    if (!me.ad) {

      [ err, res ] = await To(add({
        pc_url: pcUrl.current.value,
        pc_img: pcImg,
        close: closeSwitch.current.checked
      }));

    } else {
      [ err, res ] = await To(update({
        pc_url: pcUrl.current.value,
        pc_img: pcImg,
        close: closeSwitch.current.checked
      }));
    }

    if (res && res.success) {
      Toastify({
        text: '提交成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();
      $('#ad-settings').modal('hide');

      load({
        id: me.ad,
        args: { _id: me.ad },
        restart: true
      });

    } else {
      Toastify({
        text: err.message || '提交失败',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();
    }

  }

  useEffect(()=>{
    componentDidMount();
  }, []);

  return (<Modal
    id="ad-settings"
    title="广告设置"
    body={<div className="p-3">

      {!loading ?
      <div>

      <div styleName="ad" style={pcImg ? { backgroundImage:'url('+pcImg+')'} : {}}></div>

      <div className="form-group row">
        <label htmlFor="staticEmail" className="col-sm-2 col-form-label">广告图片</label>
        <div className="col-sm-10">
          <QiniuUploadImage
            upload={(url, file: any)=>{
              setPCImg(url);
            }}
            text={<button type="button" className="btn btn-outline-primary btn-sm">上传图片</button>}
            />
          <small className="form-text color_secondary">尺寸: 560x320</small>
        </div>
        
      </div>
      
      <div className="form-group row">
        <label htmlFor="staticEmail" className="col-sm-2 col-form-label">广告网址</label>
        <div className="col-sm-10">
          <input ref={pcUrl} type="text" className="form-control" aria-describedby="emailHelp" placeholder="推广网址" />
          <small className="form-text color_secondary">例如：https://www.xiaoduyu.com</small>
        </div>
      </div>
      
      {/* <Link to="/agreement">同意用户协议</Link> */}

      </div>

      : null}

      </div>}
    footer={<div className="d-flex justify-content-between" style={{width:"100%"}}>

        <div className="custom-control custom-switch">
          <input ref={closeSwitch} type="checkbox" className="custom-control-input" id="customSwitch1" />
          <label className="custom-control-label" htmlFor="customSwitch1">关闭广告</label>
        </div>

        {!loading ? <a className="btn btn-primary" href="javascript:void(0);" onClick={submit}>提交</a> : null}
      </div>}
    />)

}