"use strict";
var React = require("react");
var Iframe = React.createClass({
    displayName: "iframe",

    propTypes: {
        src: React.PropTypes.string.isRequired
    },

    getDefaultProps:function(){
      return {
      }
    },

    shouldComponentUpdate: function(nextProps) {
      return this.props.src !== nextProps.src;
    },

    render: function() {

/*
allowFullScreen="true"
quality="high"
align="middle"
allowScriptAccess="always"
type="application/x-shockwave-flash"
allowfullscreen
 */

        return (
            <iframe ref="iframe" src={this.props.src}></iframe>
        )


    }
});

module.exports = Iframe;
