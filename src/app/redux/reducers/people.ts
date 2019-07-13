import cloneObj from '../clone';

type Actions = {
  type: string
  data?: any
  id?: string
  name?: string
  state?: any
  update?: any
  status?: boolean
  people?: any
  peopleId?: string
  followStatus?: boolean
  selfId?: string
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {}

export default (state = cloneObj(initialState), action: Actions) => {
  switch (action.type) {

    case 'SET_PEOPLE':
      state = action.state;
      break;

    case 'SET_PEOPLE_LIST_BY_ID':
      var { name, data } = action;
      if (name && data) state[name] = data;
      break;

    case 'UPDATE_PEOPLE':
      var { id, update } = action
      for (let i in state) {
        state[i].data.map((item: any) => {
          if (item._id == id) {
            for (let i in update) item[i] = update[i]
          }
        })
      }
      break

    // 添加单个人到other
    // case 'ADD_PEOPLE':
    //   var { people } = action
    //   state['other'].data.push(people)
    //   break;

    case 'UPLOAD_PEOPLE_FOLLOW':

      var { peopleId, followStatus, selfId } = action

      for (let i in state) {
        let people = state[i].data
        people.map((item: any)=>{
          // 更新用户粉丝数量和状态
          if (item._id == peopleId) {
            item.fans_count += followStatus ? 1 : -1
            item.follow = followStatus
          }
          // 更新自己关注用户的累积
          if (item._id == selfId) {
            item.follow_people_count += followStatus ? 1 : -1
          }
        })
      }
      break;

    default:
      return state
  }
  return cloneObj(state);
}

export const getPeopleListById = (state: any, id: string) => state.people[id]