'use strict'

var React = require('react')

var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

var inherits = function(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    )
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

var possibleConstructorReturn = function(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }

  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

//

var baseValProperties = {
  circle: {
    propertyX: 'cx',
    propertyY: 'cy'
  },
  ellipse: {
    propertyX: 'cx',
    propertyY: 'cy'
  },
  rect: {
    propertyX: 'x',
    propertyY: 'y'
  },
  image: {
    propertyX: 'x',
    propertyY: 'y'
  }
}

var nodeNames = Object.keys(baseValProperties)

var Marcher = (function() {
  function Marcher(_ref) {
    var element = _ref.element,
      totalLength = _ref.totalLength,
      getPointAtLength = _ref.getPointAtLength,
      position = _ref.position
    classCallCheck(this, Marcher)
    var _baseValProperties$el = baseValProperties[element.nodeName],
      propertyX = _baseValProperties$el.propertyX,
      propertyY = _baseValProperties$el.propertyY

    this.baseValX = element[propertyX].baseVal
    this.baseValY = element[propertyY].baseVal

    this.totalLength = totalLength
    this.getPointAtLength = getPointAtLength
    this.position = position

    this.reflectPosition()
  }

  createClass(Marcher, [
    {
      key: 'marching',
      value: function marching(pace) {
        this.advancePosition(pace)
        this.reflectPosition()
      }
    },
    {
      key: 'advancePosition',
      value: function advancePosition(pace) {
        var nextPosition = this.position + pace
        this.position =
          nextPosition < this.totalLength
            ? nextPosition
            : nextPosition - this.totalLength
      }
    },
    {
      key: 'reflectPosition',
      value: function reflectPosition() {
        var _getPointAtLength = this.getPointAtLength(this.position),
          x = _getPointAtLength.x,
          y = _getPointAtLength.y

        this.baseValX.value = x
        this.baseValY.value = y
      }
    }
  ])
  return Marcher
})()

//
var isStr = function isStr(data) {
  return typeof data === 'string'
}
var isNum = function isNum(data) {
  return typeof data === 'number'
}
var raf = function raf(cb) {
  return window.requestAnimationFrame(cb)
}
var caf = function caf(requestId) {
  return window.cancelAnimationFrame(requestId)
}

var createPath = function createPath(d) {
  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  return path
}

var createPathUtil = function createPathUtil(d) {
  var path = createPath(d)
  var totalLength = path.getTotalLength()
  var getPointAtLength = function getPointAtLength(position) {
    return path.getPointAtLength(position)
  }
  return { totalLength: totalLength, getPointAtLength: getPointAtLength }
}

var ref = function ref(g) {
  if (g) {
    this.getElements = function() {
      var elements = []
      nodeNames.forEach(function(nodeName) {
        return extractElements(g, nodeName).forEach(function(element) {
          return elements.push(element)
        })
      })
      return elements
    }
  } else {
    delete this.getElements
  }
}
var extractElements = function extractElements(g, nodeName) {
  return Array.from(g.querySelectorAll(nodeName))
}

var Parade = (function(_React$Component) {
  inherits(Parade, _React$Component)

  function Parade() {
    classCallCheck(this, Parade)
    return possibleConstructorReturn(
      this,
      (Parade.__proto__ || Object.getPrototypeOf(Parade)).apply(this, arguments)
    )
  }

  createClass(Parade, [
    {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this

        this.throwInvalidProps(this.props)

        this.parade = new Set()
        this.requestId = undefined
        this.animation = function() {
          var pace = _this2.props.pace
          _this2.parade.forEach(function(marcher) {
            return marcher.marching(pace)
          })
          _this2.request()
        }

        this.ref = ref.bind(this)
      }
    },
    {
      key: 'render',
      value: function render() {
        return React.createElement('g', { ref: this.ref }, this.props.children)
      }
    },
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.organize()

        if (this.canStart()) {
          this.start()
        }
      }
    },
    {
      key: 'organize',
      value: function organize() {
        var _this3 = this

        this.parade.clear()

        var _createPathUtil = createPathUtil(this.props.d),
          totalLength = _createPathUtil.totalLength,
          getPointAtLength = _createPathUtil.getPointAtLength

        this.getElements().forEach(function(element, index, _ref) {
          var length = _ref.length
          return _this3.parade.add(
            new Marcher({
              element: element,
              totalLength: totalLength,
              getPointAtLength: getPointAtLength,
              position: totalLength * (index / length)
            })
          )
        })
      }
    },
    {
      key: 'request',
      value: function request() {
        this.requestId = raf(this.animation)
      }
    },
    {
      key: 'start',
      value: function start() {
        this.request()
      }
    },
    {
      key: 'cancel',
      value: function cancel() {
        caf(this.requestId)
        this.requestId = undefined
      }
    },
    {
      key: 'canStart',
      value: function canStart() {
        return !this.props.pause && !this.requestId
      }
    },
    {
      key: 'canCancel',
      value: function canCancel() {
        return this.props.pause
      }
    },
    {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.throwInvalidProps(nextProps)
      }
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        if (prevProps.d !== this.props.d) {
          this.cancel()
          this.organize()
        }

        if (this.canStart()) {
          this.start()
        } else if (this.canCancel()) {
          this.cancel()
        }
      }
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.cancel()
        this.parade.clear()
        delete this.parade
        delete this.animation
        delete this.ref
      }
    },
    {
      key: 'throwInvalidProps',
      value: function throwInvalidProps(props) {
        if (!props.d || !isStr(props.d)) {
          throw new Error('react-parade component requires props.d')
        }

        if (!isNum(props.pace)) {
          throw new TypeError(
            'react-parade component props.pace must be "number"'
          )
        }
      }
    }
  ])
  return Parade
})(React.Component)

Parade.defaultProps = {
  pace: 1
}

module.exports = Parade
