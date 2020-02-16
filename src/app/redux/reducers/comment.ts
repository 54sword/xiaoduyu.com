import cloneObj from '../clone';

type Actions = {
  type: string
  data?: any
  id?: string
  name?: string
  state?: any
  update?: any
  status?: boolean
}

type InitialState = {
  [key: string]: any
}

const initialState: InitialState = {};

export default (state = cloneObj(initialState), action: Actions) => {
  switch (action.type) {
    
    case 'SET_COMMENT_LIST_BY_ID':
      var { name, data } = action;
      if (name && data) state[name] = data;
      break;

    case 'SET_COMMENT':
      return action.state;

    case 'UPDATE_COMMENT':
      var { id, update } = action;

      for (let i in state) {
        state[i].data.map((item: any) => {

          if (item._id == id) {
            for (let i in update) item[i] = update[i]
          }

          if (item.reply) {
            item.reply.map((reply: any)=>{
              if (reply._id == id) {
                for (let i in update) reply[i] = update[i]
              }
            })
          }

        })
      }

      break;

    case 'UPDATE_COMMENT_LIKE':
      var { id, status } = action;

      for (let i in state) {

        state[i].data.map((item: any)=>{
          if (item._id == id) {
            if (typeof item.like_count != 'undefined') item.like_count += status ? 1 : -1
            if (typeof item.like != 'undefined') item.like = status
            // if (Reflect.has(item, 'like_count')) item.like_count += status ? 1 : -1
            // if (Reflect.has(item, 'like')) item.like = status
          }

          if (item.reply) {
            item.reply.map((item: any)=>{
              if (item._id == id) {
                if (typeof item.like_count != 'undefined') item.like_count += status ? 1 : -1
                if (typeof item.like != 'undefined') item.like = status
                // if (Reflect.has(item, 'like_count')) item.like_count += status ? 1 : -1
                // if (Reflect.has(item, 'like')) item.like = status
              }
            })
          }

        })
      }

      break

    case 'REMOVE_COMMENT_BY_ID':

      var { id } = action;

      for (let i in state) {

        if (i == id) {
          delete state[i];
          continue
        }

        let commentList = state[i].data;

        commentList.map((comment: any, index: number) => {

          if (comment._id == id) commentList.splice(index, 1);

          let replyList = comment.reply || [];

          replyList.map((reply: any, index: number) => {
            if (reply._id == id) replyList.splice(index, 1);
          });

        });

      }

      break;

    case 'CLEAN':
      state = {};
      break;

    default:
      return state;
  }
  return cloneObj(state);
}

export const getCommentListById = (state: any, id: string) => state.comment[id]