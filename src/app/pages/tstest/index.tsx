import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopicList } from '../../store/actions/topic';
import { getTopicListById } from '../../store/reducers/topic';

import Shell from '../../modules/shell';
import Loading from '@components/ui/full-loading';

import './index.scss';

type PageStateProps = {}

type PageState = {}

// 单独输出组件，用于单元测试
export class TSTest extends React.Component<PageStateProps, PageState> {

  constructor(props: any) {
    super(props);
  }

  render() {
    // return <Loading />

    const id = this.props.match.params.id;
    return (<div styleName="box" className="box">ts test!{id}</div>)
  }

}


@Shell
@connect(
  (state: any, props: any) => ({
    list: getTopicListById(state, props.match.params.id)
  }),
  (dispatch: any) => ({
    loadTopics: bindActionCreators(loadTopicList, dispatch)
  })
)
export default class COM extends TSTest {};
