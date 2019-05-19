import storage from '../../common/storage';

export function loadTab () {
  return (dispatch, getState) => {
    return new Promise((resolve)=>{

      storage.load({ key: 'tab' })
      .then(res=>{
        if (res == 'follow' || res == 'favorite') {
          setTab(res)(dispatch, getState)
        }
        resolve();
      })
      .catch(err=>{
        console.log(err)
        resolve();
      })

    })

  }
}

export function setTab (tab) {
  return (dispatch, getState) => {
    storage.save({ key: 'tab', data: tab });
    dispatch({ type: 'SET_TAB', tab });
  }
}