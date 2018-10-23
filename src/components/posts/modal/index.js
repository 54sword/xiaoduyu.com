import React, { Component } from 'react';
import Modal from '../../bootstrap/modal';


// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { getReportTypes } from '../../../reducers/report-types';
// import { loadReportTypes, addReport } from '../../../actions/report';


// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

import PostsDetail from '../detail';
import CommentList from '../../comment/list';

@connect(
  (state, props) => ({
    // types: getReportTypes(state)
  }),
  dispatch => ({
    // loadReportTypes: bindActionCreators(loadReportTypes, dispatch),
    // addReport: bindActionCreators(addReport, dispatch)
  })
)
@CSSModules(styles)
export default class PostsModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      postsId: null
    }
    // this.submit = this.submit.bind(this);
    // this.chooseType = this.chooseType.bind(this);
  }

  componentDidMount () {

    $(`#posts-modal`).on('show.bs.modal',  async (e) => {

      const { postsId } = e.relatedTarget;

      // console.log(posts);

      // const { types, loadReportTypes } = self.props;
      //
      // if (!types) await loadReportTypes();
      //
      // const { posts, comment, user } = e.relatedTarget;
      this.setState({ postsId });
    });
  }

  render () {
    const { postsId } = this.state;


    return (<div>
      <Modal
        id="posts-modal"
        position="top"
        size="max"
        title={'举报'}
        body={<div>
          {postsId ? <PostsDetail id={postsId} /> : <div>loading...</div>}
          {postsId ? <CommentList name={postsId} filters={{
            variables: {
              posts_id: postsId,
              parent_id: 'not-exists',
              page_size:50
            }
          }} /> : <div>loading...</div>}
        </div>}
        />
    </div>)

  }
}
