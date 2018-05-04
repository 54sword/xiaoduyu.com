import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '../../reducers/user';

// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    isMember: isMember(state),
  }),
  dispatch => ({
  })
)
@CSSModules(styles)
export class NewPostsButton extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { isMember } = this.props;
    if (isMember) {
      return (<a href="/new-posts" styleName="new-posts" target="_blank" className="d-md-none d-lg-none d-xl-none">创建帖子</a>)
    }
    return '';
  }

}

export default NewPostsButton;
