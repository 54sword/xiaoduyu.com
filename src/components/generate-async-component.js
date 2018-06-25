import React from 'react';
import Loading from './ui/loading';

/**
 * 异步路由组件（页面）
 * @param  {Component} loader 需要加载的组件
 * @param  {Component} Placeholder 加载中显示的组件
 * @return {Component}
 *
 * 使用方法
 *
 * asyncRouteComponent({
 *   loader: () => import('../pages/comment-detail')
 * })
 */
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


/**
 * 异步组件（异步加载一些小组件）
 *
 * 使用方法:
 *
 * <Bundle load={() => import('../../components/sidebar')}>
 *  {Sidebar => <Sidebar />}
 * </Bundle>
 */
export class AsyncComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mod: null
    };
  }

  componentDidMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) this.load(nextProps);
  }

  load(props) {
    this.setState({ mod: null });
    // 注意这里，使用Promise对象; mod.default导出默认
    props.load().then((mod) => {
      this.setState({
        mod: mod.default ? mod.default : mod
      });
    });
  }

  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }
}
