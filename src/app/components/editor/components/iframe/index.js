
import React from 'react';
import PropTypes from 'prop-types';

export default class Iframe extends React.Component {

  static propTypes = {
    src: PropTypes.string.isRequired
  }

// var Iframe = React.createClass({
    // displayName: "iframe"

    // propTypes: {
    //     src: React.PropTypes.string.isRequired
    // }

    // getDefaultProps () {
    //   return {
    //   }
    // }

    shouldComponentUpdate (nextProps) {
      return this.props.src !== nextProps.src;
    }

    render () {
      const { src, width = 'auto', height = 'auto' } = this.props
/*
allowFullScreen="true"
quality="high"
align="middle"
allowScriptAccess="always"
type="application/x-shockwave-flash"
allowfullscreen
 */

        return (
          <iframe ref="iframe" src={src} width={width} height={height}></iframe>
        )


    }
}

// Iframe.propTypes = {
  // src: PropTypes.string.isRequired
// }

// module.exports = Iframe;
