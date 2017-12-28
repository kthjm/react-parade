!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("react")):"function"==typeof define&&define.amd?define(["react"],e):t.ReactShut=e(t.React)}(this,function(t){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t;var e=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},n=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),r=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e},o={circle:{propertyX:"cx",propertyY:"cy"},ellipse:{propertyX:"cx",propertyY:"cy"},rect:{propertyX:"x",propertyY:"y"},image:{propertyX:"x",propertyY:"y"}},i=Object.keys(o),a=function(){function t(n){var r=n.element,i=n.totalLength,a=n.position,u=n.getPointAtLength;e(this,t);var c=o[r.nodeName],s=c.propertyX,p=c.propertyY;this.baseValX=r[s].baseVal,this.baseValY=r[p].baseVal,this.totalLength=i,this.position=a,this.getPointAtLength=u,this.reflectPosition()}return n(t,[{key:"march",value:function(t){this.advancePosition(t),this.reflectPosition()}},{key:"advancePosition",value:function(t){var e=this.position+t;this.position=e<this.totalLength?e:e-this.totalLength}},{key:"reflectPosition",value:function(){var t=this.getPointAtLength(this.position),e=t.x,n=t.y;this.baseValX.value=e,this.baseValY.value=n}}]),t}(),u=1,c=function(t){var e=function(t){var e=document.createElementNS("http://www.w3.org/2000/svg","path");return e.setAttribute("d",t),e}(t);return{totalLength:e.getTotalLength(),getPointAtLength:function(t){return e.getPointAtLength(t)}}},s=function(t,e){return Array.from(t.querySelectorAll(e))};return function(o){function p(t){e(this,p);var n=r(this,(p.__proto__||Object.getPrototypeOf(p)).call(this,t));return n.ifThrow(),n.ref=function(t){t&&(this.getElements=function(){var e=[];return i.forEach(function(n){return s(t,n).forEach(function(t){return e.push(t)})}),e})}.bind(n),n.parade=new Set,n.requestId=void 0,n.animation=function(){var t=n.props.pace||u;n.parade.forEach(function(e){return e.march(t)}),n.request()},n}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(p,t.Component),n(p,[{key:"ifThrow",value:function(){if(!function(t){return"string"==typeof t}(this.props.d))throw new Error("react-parade component requires props.d")}}]),n(p,[{key:"render",value:function(){return t.createElement("g",{ref:this.ref},this.props.children)}},{key:"organize",value:function(){var t=this;this.parade.clear();var e=c(this.props.d),n=e.totalLength,r=e.getPointAtLength;this.getElements().forEach(function(e,o,i){var u=i.length,c=new a({element:e,totalLength:n,position:n*(o/u),getPointAtLength:r});t.parade.add(c)})}},{key:"request",value:function(){this.requestId=function(t){return window.requestAnimationFrame(t)}(this.animation)}},{key:"start",value:function(){this.request()}},{key:"cancel",value:function(){!function(t){window.cancelAnimationFrame(t)}(this.requestId),this.requestId=void 0}},{key:"canStart",value:function(){return!this.props.pause&&!this.requestId}},{key:"canCancel",value:function(){return this.props.pause}},{key:"componentDidMount",value:function(){return this.organize(),this.canStart()&&this.start()}},{key:"componentWillReceiveProps",value:function(t){this.ifThrow(),t.d!==this.props.d&&(this.cancel(),this.organize())}},{key:"componentDidUpdate",value:function(){this.canStart()?this.start():this.canCancel()&&this.cancel()}},{key:"componentWillUnmount",value:function(){this.cancel(),this.parade.clear()}}]),p}()});
