import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { saveScrollPosition, setScrollPosition } from '../actions/scroll.js';

// tools
import parseUrl from '../common/parse-url';

// 壳组件，用于给页面组件，套一个外壳
// 这样可以通过壳组件，给每个页面，传递参数
const Shell = (Component) => {

  @connect(
    (state, props) => ({}),
    dispatch => ({
      saveScrollPosition: bindActionCreators(saveScrollPosition, dispatch),
      setScrollPosition: bindActionCreators(setScrollPosition, dispatch)
    })
  )
  class Shell extends React.Component {

    static defaultProps = {
      loadData: Component.loadData || null
    }
    
    constructor(props) {
      super(props);
    }

    // 组件加载完成
    componentDidMount() {
      const { pathname, search } = this.props.location;
      this.props.location.params = search ? parseUrl(search) : null;
      this.props.setScrollPosition(pathname + search);
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
      this.props.saveScrollPosition(pathname + search);
    }

    render() {
      return (<div className="container"><Component {...this.props} /></div>)
    }

  }

  return Shell;
}

export default Shell;
