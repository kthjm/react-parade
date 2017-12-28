'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var React = _interopDefault(require('react'))

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
      position = _ref.position,
      getPointAtLength = _ref.getPointAtLength
    classCallCheck(this, Marcher)
    var _baseValProperties$el = baseValProperties[element.nodeName],
      propertyX = _baseValProperties$el.propertyX,
      propertyY = _baseValProperties$el.propertyY

    this.baseValX = element[propertyX].baseVal
    this.baseValY = element[propertyY].baseVal

    this.totalLength = totalLength
    this.position = position
    this.getPointAtLength = getPointAtLength

    this.reflectPosition()
  }

  createClass(Marcher, [
    {
      key: 'march',
      value: function march(pace) {
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
var PACE = 1
var isStr = function isStr(data) {
  return typeof data === 'string'
}
var raf = function raf(callback) {
  return window.requestAnimationFrame(callback)
}
var caf = function caf(id) {
  return window.cancelAnimationFrame(id)
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

var extractElements = function extractElements(g, nodeName) {
  return Array.from(g.querySelectorAll(nodeName))
}

function ref(g) {
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
  }
}

var Parade = (function(_React$Component) {
  inherits(Parade, _React$Component)
  createClass(Parade, [
    {
      key: 'ifThrow',
      value: function ifThrow() {
        if (!isStr(this.props.d)) {
          throw new Error('react-parade component requires props.d')
        }
      }
    }
  ])

  function Parade(props) {
    classCallCheck(this, Parade)

    var _this = possibleConstructorReturn(
      this,
      (Parade.__proto__ || Object.getPrototypeOf(Parade)).call(this, props)
    )

    _this.ifThrow()

    _this.ref = ref.bind(_this)
    _this.parade = new Set()
    _this.requestId = undefined
    _this.animation = function() {
      var pace = _this.props.pace || PACE
      _this.parade.forEach(function(marcher) {
        return marcher.march(pace)
      })
      _this.request()
    }
    return _this
  }

  createClass(Parade, [
    {
      key: 'render',
      value: function render() {
        return React.createElement('g', { ref: this.ref }, this.props.children)
      }
    },
    {
      key: 'organize',
      value: function organize() {
        var _this2 = this

        this.parade.clear()

        var _createPathUtil = createPathUtil(this.props.d),
          totalLength = _createPathUtil.totalLength,
          getPointAtLength = _createPathUtil.getPointAtLength

        this.getElements().forEach(function(element, index, _ref) {
          var length = _ref.length

          var position = totalLength * (index / length)
          var marcher = new Marcher({
            element: element,
            totalLength: totalLength,
            position: position,
            getPointAtLength: getPointAtLength
          })
          _this2.parade.add(marcher)
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
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.organize()
        return this.canStart() && this.start()
      }
    },
    {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.ifThrow()

        if (nextProps.d !== this.props.d) {
          this.cancel()
          this.organize()
        }
      }
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
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
      }
    }
  ])
  return Parade
})(React.Component)

module.exports = Parade
