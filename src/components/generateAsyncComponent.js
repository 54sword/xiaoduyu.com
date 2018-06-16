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
      this.updateState = this.updateState.bind(this);
      this.state = { Component }
    }
    
    componentWillMount() {
      if (typeof window == 'undefined' || typeof document == 'undefined') return;
      asyncComponent.load().then(this.updateState);
    }

    updateState() {
      if (this.state.Component !== Component) {
        this.setState({
          Component,
        });
      }
    }

    render() {
      const { Component } = this.state;

      if (Component) return <Component {...this.props} />;

      if (Placeholder) {
        return <Placeholder {...this.props} />;
      } else {
        return <Loading text="组件装载中..." />;
      }
    }

  }
}
