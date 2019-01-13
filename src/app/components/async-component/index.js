import React from 'react';

/**
 * 异步组件（异步加载一些小组件）
 *
 * 使用方法:
 *
 * <Bundle load={() => import('../../components/sidebar')}>
 *  {Sidebar => <Sidebar />}
 * </Bundle>
 */
export default class AsyncComponent extends React.Component {

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
