import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import parseUrl from '../common/parse-url';
// import Sign from '../components/sign'

// 壳组件，用于给页面组件，套一个外壳
// 这样可以通过壳组件，给每个页面，传递参数

const Shell = (Component) => {

  class Shell extends React.Component {

    static defaultProps = {
      loadData: Component.loadData || null
    }

    constructor(props) {
      super(props);
    }

    // 组件加载完成
    componentWillMount() {
      const { search } = this.props.location;
      this.props.location.params = search ? parseUrl(search) : null;
      // console.log('进入组件')
    }

    // 组件加载完成
    componentDidMount() {
      // console.log('组件加载完成');
    }

    // 更新组件
    componentDidUpdate() {
      // console.log('组件加载更新了');
    }

    // 组件被卸载
    componentWillUnmount() {
      // console.log('组件加载被卸载');
    }

    render() {
      return (<div className="container">
        <Component {...this.props} />
      </div>)
    }

  }

  Shell.contextTypes = {
  }

  Shell.propTypes = {
  }

  const mapStateToProps = (state) => {
    return {
    }
  }

  const mapDispatchToProps = (dispatch, props) => {
    return {
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(Shell);
}

export default Shell;
