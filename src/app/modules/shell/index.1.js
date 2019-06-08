import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { saveScrollPosition, setScrollPosition } from '../../store/actions/scroll';
// import { addVisitHistory } from '../../store/actions/history';

// tools
import parseUrl from '../../common/parse-url';

import { History } from '@context';

// 壳组件，用于给页面组件，套一个外壳
// 这样可以通过壳组件，给每个页面，传递参数
export default (Component) => {

  @connect(
    (state, props) => ({}),
    dispatch => ({
      saveScrollPosition: bindActionCreators(saveScrollPosition, dispatch),
      setScrollPosition: bindActionCreators(setScrollPosition, dispatch),
      // addVisitHistory: bindActionCreators(addVisitHistory, dispatch)
    })
  )
  class Shell extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        notFoundPgae: '',
        hasError: ''
      }
    }

    componentWillMount() {

      const { pathname, search } = this.props.location;
      this.props.location.params = search ? parseUrl(search) : {};


      /*
      if (this.props.staticContext) {
        const { code, text } = this.props.staticContext;
        if (code == 404) {
          this.state.notFoundPgae = text || '404 NOT FOUND'
        }
      }
      */

    }

    // 组件加载完成
    componentDidMount() {
      const { pathname, search } = this.props.location || {};
      // console.log(this.props.history.push);
      this.props.setScrollPosition(pathname + search);
      // this.props.addVisitHistory(pathname + search);
    }
    
    componentWillReceiveProps(props) {
      // 组件url发生变化
      if (this.props.location.pathname + this.props.location.search != props.location.pathname + props.location.search) {
        this.componentWillUnmount();
        this.props = props;
        this.componentDidMount();
      }
    }

    // 组件被卸载
    componentWillUnmount() {
      const { pathname, search } = this.props.location;
      // console.log(pathname);
      if (pathname == '/') this.props.saveScrollPosition(pathname + search);
    }

    componentDidCatch(error, info) {
      
      console.log(error);
      console.log(info);
      
      this.setState({ hasError: error });
    }

    render() {

      const { notFoundPgae, hasError } = this.state;

      if (notFoundPgae) {
        return (<div>{notFoundPgae}</div>)
      } else if (hasError) {
        return (<div>
          <div>页面发生错误</div>
          <div>{hasError}</div>
        </div>)
      } else {
        return (
          <History.Provider value={this.props.history}>
            <Component
              {...this.props}
              notFoundPgae={content=>{
                this.setState({ notFoundPgae: content || '404 NOT FOUND' });
              }}
            />
          </History.Provider>
        );
      }

    }

  }

  return Shell;
}
