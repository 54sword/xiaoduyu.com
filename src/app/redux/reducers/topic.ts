import cloneObj from '../clone';

type Actions = {
  type: string
  data?: any
  id?: string
  name?: string
  state?: any
  update?: any
  status?: boolean
  followStatus?: boolean
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {}

export default (state = cloneObj(initialState), action: Actions) => {

  switch (action.type) {

    case 'SET_TOPICS':
      state = action.state;
      break;

    case 'SET_TOPIC_LIST_BY_ID':
      var { name, data } = action;
      if (name && data) state[name] = data;
      break;

    case 'UPDATE_TOPIC':
      for (let i in state) {
        state[i].data.map((item: any) => {
          if (item._id == action.id) {
            for (let i in action.update) item[i] = action.update[i]
          }
        })
      }
      break;

    case 'UPDATE_TOPIC_FOLLOW':

      const { id, followStatus } = action

      for (let i in state) {

        let nodes = state[i]
        nodes = nodes.data

        for (let n = 0, length = nodes.length; n < length; n++) {
          if (nodes[n]._id == id) {
            state[i].data[n].follow_count += followStatus ? 1 : -1
            state[i].data[n].follow = followStatus
          }

          if (nodes[n].children && nodes[n].children.length > 0) {
            nodes[n].children.map(function(node: any, key: number){
              if (node._id == id) {
                state[i].data[n].children[key].follow_count += followStatus ? 1 : -1
                state[i].data[n].children[key].follow = followStatus
              }
            })
          }

        }

      }

      break;

    default:
      return state
  }

  return cloneObj(state);

}

export const getTopicListById = (state: any, id: string) => state.topic[id]