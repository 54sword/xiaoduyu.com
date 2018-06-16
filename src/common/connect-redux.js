import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// 连接redux
/*
export default Component => {

  const { mapStateToProps = {}, mapDispatchToProps = {} } = Component;

  Component = connect(

      (state, props)=>{
        let obj = {}
        for (let i in mapStateToProps) {
          obj[i] = mapStateToProps[i](state, props);
        }
        return obj;
      },

      (dispatch, props) => {
        let actions = {};
        for (let i in mapDispatchToProps) {
          actions[i] = bindActionCreators(mapDispatchToProps[i](props), dispatch);
        }
        return actions
      }

    )(Component);

  return Component;
}
*/

/*
export default ({mapStateToProps = {}, mapDispatchToProps = {}}) => {
  return (target) => {

    connect(

        (state, props)=>{
          let obj = {}

          for (let i in mapStateToProps) {
            obj[i] = mapStateToProps[i](state, props)
          }

          // console.log(obj);

          return obj;
        },

        (dispatch, props) => {
          let actions = {};
          for (let i in mapDispatchToProps) {
            actions[i] = bindActionCreators(mapDispatchToProps[i](props), dispatch);
          }
          return actions
        }

      )(target);

    // return Component;

  }
}
*/


export default (mapStateToProps, mapDispatchToProps) => {
  return (target) => {

    return connect(mapStateToProps,

        (dispatch, props) => {
          let actions = {};
          for (let i in mapDispatchToProps) {
            actions[i] = bindActionCreators(mapDispatchToProps[i](props), dispatch);
          }
          return actions
        }

      )(target);

    // return Component;

  }
}
