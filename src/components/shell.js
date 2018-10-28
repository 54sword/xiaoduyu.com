import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { saveScrollPosition, setScrollPosition } from '../store/actions/scroll';
import { addVisitHistory } from '../store/actions/history';

// components
import Head from './head';

// tools
import parseUrl from '../common/parse-url';

// 壳组件，用于给页面组件，套一个外壳
// 这样可以通过壳组件，给每个页面，传递参数
const Shell = (Component) => {

  if (!Component.loadData) {
    Component.loadData = ({ store, match }) => {
      return new Promise(async function (resolve, reject) {
        resolve({ code:200 });
      })
    }
  }

  @connect(
    (state, props) => ({}),
    dispatch => ({
      saveScrollPosition: bindActionCreators(saveScrollPosition, dispatch),
      setScrollPosition: bindActionCreators(setScrollPosition, dispatch),
      addVisitHistory: bindActionCreators(addVisitHistory, dispatch)
    })
  )
  class Shell extends React.Component {

    static defaultProps = {
      // 服务端渲染
      loadData: ({ store, match }) => {

        return new Promise((resolve, reject) => {

          let arr = [];

          // 加载头部
          if (Head.loadData) arr.push(Head.loadData({ store, match }));

          // 加载内容
          if (Component.loadData) arr.push(Component.loadData({ store, match }));

          Promise.all(arr).then(value=>{

            // 如果有内容，则返回内容的处理结果
            if (Component.loadData) {
              resolve(value[value.length - 1]);
            } else {
              resolve({ code:200 });
            }

          });

        });
      }
    }

    constructor(props) {
      super(props);
      this.state = {
        notFoundPgae: ''
      }
    }

    componentWillMount() {

      const self = this;
      const { pathname, search } = this.props.location;
      this.props.location.params = search ? parseUrl(search) : {};

      if (this.props.staticContext) {
        const { code, text } = this.props.staticContext;
        if (code == 404) {
          this.state.notFoundPgae = text || '404 NOT FOUND'
        }
      }

    }

    // 组件加载完成
    componentDidMount() {
      const { pathname, search } = this.props.location;
      this.props.setScrollPosition(pathname + search);
      this.props.addVisitHistory(pathname + search);
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

      const self = this;
      const { notFoundPgae } = this.state;


      if (notFoundPgae) {
        return (<div>{notFoundPgae}</div>)
      } else {
        return (<Component
          {...this.props}
          notFoundPgae={content=>{
            self.setState({ notFoundPgae: content || '404 NOT FOUND' });
          }}
        />);
      }

    }

  }

  return Shell;
}

export default Shell;
