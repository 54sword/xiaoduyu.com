webpackJsonp([28],{1214:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var u=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),c=n(1),l=o(c),s=n(117),f=n(1218),p=o(f),d=n(1217),h=o(d),y=function(t){function e(t){r(this,e);var n=i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t));return n.state={titleList:{wrong_token:"无权访问",has_been_binding:"已经绑定",binding_failed:"绑定失败",binding_finished:"绑定成功",create_user_failed:"创建用户失败",create_oauth_failed:"创建账户失败",block_account:"您的账号被禁止使用，如有疑问请联系："+s.contact_email},tips:""},n}return a(e,t),u(e,[{key:"componentDidMount",value:function(){var t=this.props.location.params.notice,e=this.state.titleList;t&&this.setState({tips:e[t]||"提示不存在"})}},{key:"render",value:function(){var t=this.state.tips;return l.default.createElement("div",null,l.default.createElement(h.default,{title:"提示"}),l.default.createElement("div",{style:{textAlign:"center",fontSize:"26px",padding:"20px"}},t))}}]),e}(c.Component);e.default=(0,p.default)(y)},1217:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0}),e.Meta=void 0;var u,c,l=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),s=n(1),f=o(s),p=n(489),d=o(p),h=(n(115),n(185)),y=n(286),b=n(117),m=e.Meta=(u=(0,h.connect)(function(t,e){return{unreadNotice:(0,y.getUnreadNotice)(t)}},function(t){return{}}))(c=function(t){function e(t){return r(this,e),i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t))}return a(e,t),l(e,[{key:"render",value:function(){var t={},e=this.props,n=e.title,o=e.description,r=e.canonical,i=e.meta,a=e.link,u=e.unreadNotice;return t.title=n?n+" - "+b.name:b.name,o&&(t.description=o),r&&(t.canonical=r),i&&(t.meta=i),a&&(t.link=a),u&&u.length>0&&(t.title="("+u.length+"条通知) "+t.title),f.default.createElement(d.default,null,f.default.createElement("title",null,u&&u.length>0?"("+u.length+"条通知)":"",n||b.name,n?" - "+b.name:""),this.props.children)}}]),e}(s.Component))||c;e.default=m},1218:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,n){function o(r,i){try{var a=e[r](i),u=a.value}catch(t){return void n(t)}if(!a.done)return Promise.resolve(u).then(function(t){o("next",t)},function(t){o("throw",t)});t(u)}return o("next")})}}Object.defineProperty(e,"__esModule",{value:!0});var c=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t},l=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),s=n(1),f=o(s),p=n(115),d=n(185),h=n(1219),y=n(1220),b=n(488),m=o(b),v=n(487),_=o(v),O=function(t){var e,n,o;return t.loadData||(t.loadData=function(t){t.store,t.match;return new Promise(function(){var t=u(regeneratorRuntime.mark(function t(e,n){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e({code:200});case 1:case"end":return t.stop()}},t,this)}));return function(e,n){return t.apply(this,arguments)}}())}),(0,d.connect)(function(t,e){return{}},function(t){return{saveScrollPosition:(0,p.bindActionCreators)(h.saveScrollPosition,t),setScrollPosition:(0,p.bindActionCreators)(h.setScrollPosition,t),addVisitHistory:(0,p.bindActionCreators)(y.addVisitHistory,t)}})((o=n=function(e){function n(t){r(this,n);var e=i(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,t));return e.state={notFoundPgae:""},e}return a(n,e),l(n,[{key:"componentWillMount",value:function(){var t=this.props.location,e=(t.pathname,t.search);if(this.props.location.params=e?(0,_.default)(e):{},this.props.staticContext){var n=this.props.staticContext,o=n.code,r=n.text;404==o&&(this.state.notFoundPgae=r||"404 NOT FOUND")}}},{key:"componentDidMount",value:function(){var t=this.props.location,e=t.pathname,n=t.search;this.props.setScrollPosition(e+n),this.props.addVisitHistory(e+n)}},{key:"componentWillReceiveProps",value:function(t){this.props.location.pathname+this.props.location.search!=t.location.pathname+t.location.search&&(this.componentWillUnmount(),this.props=t,this.componentDidMount())}},{key:"componentWillUnmount",value:function(){var t=this.props.location,e=t.pathname,n=t.search;this.props.saveScrollPosition(e+n)}},{key:"render",value:function(){var e=this,n=this.state.notFoundPgae;return f.default.createElement("div",{className:"container"},n?f.default.createElement("div",null,n):f.default.createElement(t,c({},this.props,{notFoundPgae:function(t){e.setState({notFoundPgae:t||"404 NOT FOUND"})}})))}}]),n}(f.default.Component),n.defaultProps={loadData:function(e){var n=e.store,o=e.match;return new Promise(function(e,r){var i=[];m.default.loadData&&i.push(m.default.loadData({store:n,match:o})),t.loadData&&i.push(t.loadData({store:n,match:o})),Promise.all(i).then(function(n){e(t.loadData?n[n.length-1]:{code:200})})})}},e=o))||e};e.default=O},1219:function(t,e,n){"use strict";function o(t){return function(e,n){e({type:"SET_SCROLL_POSITION",name:t})}}function r(t){return function(e,n){e({type:"SAVE_SCROLL_POSITION",name:t})}}Object.defineProperty(e,"__esModule",{value:!0}),e.setScrollPosition=o,e.saveScrollPosition=r},1220:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.addVisitHistory=function(t){return function(e){e({type:"ADD_HISTORY",page:t})}}}});