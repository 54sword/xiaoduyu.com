import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link, withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signIn } from '../../actions/user';

import CSSModules from 'react-css-modules';
import styles from './style.scss';

import Shell from '../../components/shell';
import Meta from '../../components/meta';


export class SignIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.submit = this.submit.bind(this);
  }

  async submit(event) {
    event.preventDefault();

    const { nickname } = this.refs;
    const { signIn } = this.props;

    if (!nickname.value) {
      nickname.focus();
      return false;
    }
    
    let [err, success] = await signIn({ nickname: nickname.value });

    if (success) {
      window.location.href = '/'
    }

    return false;
  }

  render() {
    return(<div styleName="container" className="text-center">
      <Meta title="React同构脚手架" />
      <form className="form-signin" onSubmit={this.submit}>
        <div styleName="icon"></div>
        <h1 className="h3 mb-3 font-weight-normal">React同构脚手架</h1>
        <input type="text" ref="nickname" className="form-control mb-3" placeholder="请输入昵称" />
        <button className="btn btn-lg btn-primary btn-block" type="submit">登录</button>
      </form>
    </div>)
  }

}


SignIn = CSSModules(SignIn, styles);

SignIn.propTypes = {
  signIn: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: bindActionCreators(signIn, dispatch)
  }
}

SignIn = withRouter(connect(mapStateToProps,mapDispatchToProps)(SignIn));

export default Shell(SignIn);
