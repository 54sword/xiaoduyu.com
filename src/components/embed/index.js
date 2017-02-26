"use strict";
var React = require("react");
var Embed = React.createClass({
    displayName: "embed",

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
 */

        return (
            <embed
            ref="embed"
            src={this.props.src}
            ></embed>
        )


    }
});

module.exports = Embed;
