import React from 'react';
import { Link } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '../../store/reducers/user';

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
    //  className="d-md-none d-lg-none d-xl-none"
    if (isMember) {
      return (<Link to="/new-posts" styleName="new-posts">创建帖子</Link>)
    }
    return '';
  }

}

export default NewPostsButton;
