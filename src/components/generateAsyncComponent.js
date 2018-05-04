import React from 'react';
import Loading from './ui/loading';

exports.asyncRouteComponent = ({ loader, Placeholder }) => {

  let Component = null;

  return class asyncComponent extends React.Component {

    // 加载组件
    static load(callback = ()=>{}) {
      return loader().then((ResolvedComponent) => {
        Component = ResolvedComponent.default || ResolvedComponent;
        callback(Component);
      });
    }

    constructor() {
      super();
      this.state = { Component }
    }

    componentDidMount() {
      // 客户端加载异步组件
      const self = this;
      asyncComponent.load().then(()=>{
        if (self.state.Component !== Component) {
          self.setState({ Component });
        }
      });
    }

    render() {

      const { Component } = this.state;

      if (Component) return <Component {...this.props} />;
      if (Placeholder) {
        return <Placeholder {...this.props} />;
      } else {
        return <Loading text="组件装载中..." />;
      }

      return null;
    }
  }
}
