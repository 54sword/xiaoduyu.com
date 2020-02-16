import axios from 'axios';
import config from '@config';

export function loadLinkListById(id: string) {
  return (dispatch: any, getState: any) => {
    return new Promise(async (resolve, reject) => {

      axios({
        url: config.domainName+'/links.json',
        method: 'get'
      })
      .then(res=>{
        
        if (res && res.data) {
          dispatch({
            type: 'ADD_LINK_LIST_BY_ID',
            id,
            data: res.data
          });
        }

        resolve();

      })
      .catch(res=>{
        reject()
      });

    })
  }
}
