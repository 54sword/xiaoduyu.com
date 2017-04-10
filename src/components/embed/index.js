"use strict";
var React = require("react");

class Embed extends React.Component {
// var Embed = React.createClass({
    // displayName: "embed"

    // propTypes: {
    //     src: React.PropTypes.string.isRequired
    // }
    //
    // getDefaultProps (){
    //   return {
    //   }
    // }

    shouldComponentUpdate(nextProps) {
      return this.props.src !== nextProps.src;
    }

    render() {

/*
allowFullScreen="true"
quality="high"
align="middle"
allowScriptAccess="always"
type="application/x-shockwave-flash"
 */

        return (
            <embed ref="embed" src={this.props.src}></embed>
        )


    }
}

Embed.propTypes = {
  src: React.PropTypes.string.isRequired
}

module.exports = Embed
