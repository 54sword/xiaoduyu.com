webpackJsonp([22],{1213:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,n){function o(r,i){try{var a=e[r](i),u=a.value}catch(t){return void n(t)}if(!a.done)return Promise.resolve(u).then(function(t){o("next",t)},function(t){o("throw",t)});t(u)}return o("next")})}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function u(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var c,s,l,f=function(){function t(t,e){var n=[],o=!0,r=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(o=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);o=!0);}catch(t){r=!0,i=t}finally{try{!o&&u.return&&u.return()}finally{if(r)throw i}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),p=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),d=n(1),h=o(d),y=n(115),v=n(185),m=n(501),b=n(1218),_=o(b),w=n(1217),O=o(w),P=n(135),g=o(P),j=n(1326),S=o(j),k=(c=(0,v.connect)(function(t,e){return{}},function(t){return{saveSignInCookie:(0,y.bindActionCreators)(m.saveSignInCookie,t)}}),s=(0,g.default)(S.default),c(l=s(l=function(t){function e(t){return i(this,e),a(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t))}return u(e,t),p(e,[{key:"componentDidMount",value:function(){function t(){return e.apply(this,arguments)}var e=r(regeneratorRuntime.mark(function t(){var e,n,o,r,i,a,u,c,s,l,p,d;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e=this.props.location.params,n=e.access_token,o=void 0===n?"":n,r=e.expires,i=void 0===r?0:r,a=e.landing_page,u=void 0===a?"/":a,c=this.props.saveSignInCookie,!o){t.next=12;break}return t.next=5,c({access_token:o});case 5:s=t.sent,l=f(s,2),p=l[0],d=l[1],d&&d.success?window.location.href=u:(alert("登录失败"),window.location.href="/"),t.next=13;break;case 12:window.location.href="/";case 13:case"end":return t.stop()}},t,this)}));return t}()},{key:"render",value:function(){return h.default.createElement("div",{styleName:"container"},h.default.createElement(O.default,{title:"登陆中..."}),"登录跳转中...")}}]),e}(d.Component))||l)||l);e.default=(0,_.default)(k)},1217:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0}),e.Meta=void 0;var u,c,s=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),l=n(1),f=o(l),p=n(489),d=o(p),h=(n(115),n(185)),y=n(286),v=n(117),m=e.Meta=(u=(0,h.connect)(function(t,e){return{unreadNotice:(0,y.getUnreadNotice)(t)}},function(t){return{}}))(c=function(t){function e(t){return r(this,e),i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t))}return a(e,t),s(e,[{key:"render",value:function(){var t={},e=this.props,n=e.title,o=e.description,r=e.canonical,i=e.meta,a=e.link,u=e.unreadNotice;return t.title=n?n+" - "+v.name:v.name,o&&(t.description=o),r&&(t.canonical=r),i&&(t.meta=i),a&&(t.link=a),u&&u.length>0&&(t.title="("+u.length+"条通知) "+t.title),f.default.createElement(d.default,null,f.default.createElement("title",null,u&&u.length>0?"("+u.length+"条通知)":"",n||v.name,n?" - "+v.name:""),this.props.children)}}]),e}(l.Component))||c;e.default=m},1218:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,n){function o(r,i){try{var a=e[r](i),u=a.value}catch(t){return void n(t)}if(!a.done)return Promise.resolve(u).then(function(t){o("next",t)},function(t){o("throw",t)});t(u)}return o("next")})}}Object.defineProperty(e,"__esModule",{value:!0});var c=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t},s=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),l=n(1),f=o(l),p=n(115),d=n(185),h=n(1219),y=n(1220),v=n(488),m=o(v),b=n(487),_=o(b),w=function(t){var e,n,o;return t.loadData||(t.loadData=function(t){t.store,t.match;return new Promise(function(){var t=u(regeneratorRuntime.mark(function t(e,n){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e({code:200});case 1:case"end":return t.stop()}},t,this)}));return function(e,n){return t.apply(this,arguments)}}())}),(0,d.connect)(function(t,e){return{}},function(t){return{saveScrollPosition:(0,p.bindActionCreators)(h.saveScrollPosition,t),setScrollPosition:(0,p.bindActionCreators)(h.setScrollPosition,t),addVisitHistory:(0,p.bindActionCreators)(y.addVisitHistory,t)}})((o=n=function(e){function n(t){r(this,n);var e=i(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,t));return e.state={notFoundPgae:""},e}return a(n,e),s(n,[{key:"componentWillMount",value:function(){var t=this.props.location,e=(t.pathname,t.search);if(this.props.location.params=e?(0,_.default)(e):{},this.props.staticContext){var n=this.props.staticContext,o=n.code,r=n.text;404==o&&(this.state.notFoundPgae=r||"404 NOT FOUND")}}},{key:"componentDidMount",value:function(){var t=this.props.location,e=t.pathname,n=t.search;this.props.setScrollPosition(e+n),this.props.addVisitHistory(e+n)}},{key:"componentWillReceiveProps",value:function(t){this.props.location.pathname+this.props.location.search!=t.location.pathname+t.location.search&&(this.componentWillUnmount(),this.props=t,this.componentDidMount())}},{key:"componentWillUnmount",value:function(){var t=this.props.location,e=t.pathname,n=t.search;this.props.saveScrollPosition(e+n)}},{key:"render",value:function(){var e=this,n=this.state.notFoundPgae;return f.default.createElement("div",{className:"container"},n?f.default.createElement("div",null,n):f.default.createElement(t,c({},this.props,{notFoundPgae:function(t){e.setState({notFoundPgae:t||"404 NOT FOUND"})}})))}}]),n}(f.default.Component),n.defaultProps={loadData:function(e){var n=e.store,o=e.match;return new Promise(function(e,r){var i=[];m.default.loadData&&i.push(m.default.loadData({store:n,match:o})),t.loadData&&i.push(t.loadData({store:n,match:o})),Promise.all(i).then(function(n){e(t.loadData?n[n.length-1]:{code:200})})})}},e=o))||e};e.default=w},1219:function(t,e,n){"use strict";function o(t){return function(e,n){e({type:"SET_SCROLL_POSITION",name:t})}}function r(t){return function(e,n){e({type:"SAVE_SCROLL_POSITION",name:t})}}Object.defineProperty(e,"__esModule",{value:!0}),e.setScrollPosition=o,e.saveScrollPosition=r},1220:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.addVisitHistory=function(t){return function(e){e({type:"ADD_HISTORY",page:t})}}},1326:function(t,e){t.exports={container:"_1CjvVPom"}}});