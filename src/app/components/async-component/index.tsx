import React, { useState, useEffect } from 'react';

/**
 * 异步组件（异步加载一些小组件）
 *
 * 使用方法:
 *
 * <Bundle load={() => import('../../components/sidebar')}>
 *  {Sidebar => <Sidebar />}
 * </Bundle>
 */

 /*
export default function(props: any) {

  const [ mod, setMod ] = useState(null);

  const load = () => {
    // setMod(null)
    // 注意这里，使用Promise对象; mod.default导出默认
    props.load().then((mod: any) => {
      setMod(mod.default ? mod.default : mod)
    });
  }

  useEffect(()=>{
    load();
  }, []);

  return mod ? props.children(mod) : null;
}
*/

export default class AsyncComponent extends React.Component {

  state = {
    mod: null
  } 

  constructor(props: any) {
    super(props);
    this.load = this.load.bind(this);
  }

  componentDidMount() {
    this.load()
  }

  // componentWillReceiveProps(nextProps: any) {
  //   if (nextProps.load !== this.props.load) this.load();
  // }

  load() {
    this.setState({ mod: null });
    // 注意这里，使用Promise对象; mod.default导出默认
    this.props.load().then((mod: any) => {
      this.setState({
        mod: mod.default ? mod.default : mod
      });
    });
  }

  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }
}