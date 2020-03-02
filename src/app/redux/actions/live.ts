import { dateDiff } from '../../common/date';
import loadList from '../utils/new-graphql-load-list';

// 加工一下数据
const processList = (list: Array<any>, store?: any, id?: string) => {
  list.map(function(posts){
    if (posts.last_time) posts._last_time = dateDiff(posts.last_time);
  });
  return list
}

export const loadLiveList = loadList({
  reducerName: 'live',
  actionType: 'ADD_LIVE_LIST_BY_ID',
  processList: processList,
  api: 'live',
  fields: `
    _id
    user_id{
      _id
      nickname
      avatar_url
    }
    title
    notice
    cover_image
    create_at
    last_time
    status
    audience_count
    view_count
    talk_count
  `
});

export const addAudienceCount = function(liveId: string) {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'ADD_AUDIENCE_BY_LIVE_ID', id: liveId })
  }
}

export const removeAudienceCount = function(liveId: string) {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'REMOVE_AUDIENCE_BY_LIVE_ID', id: liveId })
  }
}

export const updateLiveState = function(liveId: string, audience_count: number, view_count: number) {
  return (dispatch: any, getState: any) => {
    dispatch({ type: 'UPDATE_LIVE_STATE_BY_LIVE_ID', id: liveId, audience_count, view_count })
  }
}