import React from 'react';

/**
 * Returns a new React component, ready to be instantiated.
 * Note the closure here protecting Component, and providing a unique
 * instance of Component to the static implementation of `load`.
 */
exports.generateAsyncRouteComponent = ({ loader, Placeholder }) => {

  let Component = null;
  return class AsyncRouteComponent extends React.Component {
    /**
     * Static so that you can call load against an uninstantiated version of
     * this component. This should only be called one time outside of the
     * normal render path.
     */
    static load({ store, match }) {

      return new Promise((resolve, reject) => {

        loader().then(async (ResolvedComponent) => {

          let result = {}

          if (store && match) {

            // 分片页面，存在loadData(服务端加载数据)，那么则先执行
            if (
              ResolvedComponent &&
              ResolvedComponent.default &&
              ResolvedComponent.default.WrappedComponent &&
              ResolvedComponent.default.WrappedComponent.defaultProps &&
              ResolvedComponent.default.WrappedComponent.defaultProps.loadData
            ) {
              result = await ResolvedComponent.default.WrappedComponent.defaultProps.loadData({ store, match })
            } else {
              result = { code: 200 }
            }

          }

          Component = ResolvedComponent.default || ResolvedComponent;

          resolve(result)
        }).catch(reject)

      })
    }

    constructor() {
      super();
      this.updateState = this.updateState.bind(this);
      this.state = { Component }
    }

    componentWillMount() {
      AsyncRouteComponent.load({})
      .then(this.updateState);
    }

    updateState() {
      // Only update state if we don't already have a reference to the
      // component, this prevent unnecessary renders.
      if (this.state.Component !== Component) {
        this.setState({
          Component,
        });
      }
    }

    render() {
      const { Component: ComponentFromState } = this.state;
      if (ComponentFromState) {
        return <ComponentFromState {...this.props} />;
      }

      if (Placeholder) {
        return <Placeholder {...this.props} />;
      }

      return null;
    }
  };
}
