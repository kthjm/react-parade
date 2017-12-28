// @flow
import React from 'react'
import { nodeNames, Marcher } from './util.js'

const PACE = 1
const isStr = data => typeof data === 'string'
const raf = callback => window.requestAnimationFrame(callback)
const caf = id => window.cancelAnimationFrame(id)

const createPath = d => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  return path
}

const createPathUtil = d => {
  const path = createPath(d)
  const totalLength = path.getTotalLength()
  const getPointAtLength = position => path.getPointAtLength(position)
  return { totalLength, getPointAtLength }
}

const extractElements = (g, nodeName) =>
  Array.from(g.querySelectorAll(nodeName))

function ref(g) {
  if (g) {
    this.getElements = () => {
      const elements = []
      nodeNames.forEach(nodeName =>
        extractElements(g, nodeName).forEach(element => elements.push(element))
      )
      return elements
    }
  }
}

type Props = {
  d: string,
  pace?: number,
  pause?: boolean
}

export default class Parade extends React.Component {
  ifThrow() {
    if (!isStr(this.props.d)) {
      throw new Error('react-parade component requires props.d')
    }
  }

  constructor(props) {
    super(props)

    this.ifThrow()

    this.ref = ref.bind(this)
    this.parade = new Set()
    this.requestId = undefined
    this.animation = () => {
      const pace = this.props.pace || PACE
      this.parade.forEach(marcher => marcher.march(pace))
      this.request()
    }
  }

  render() {
    return <g ref={this.ref}>{this.props.children}</g>
  }

  organize() {
    this.parade.clear()

    const { totalLength, getPointAtLength } = createPathUtil(this.props.d)

    this.getElements().forEach((element, index, { length }) => {
      const position = totalLength * (index / length)
      const marcher = new Marcher({
        element,
        totalLength,
        position,
        getPointAtLength
      })
      this.parade.add(marcher)
    })
  }

  request() {
    this.requestId = raf(this.animation)
  }

  start() {
    this.request()
  }

  cancel() {
    caf(this.requestId)
    this.requestId = undefined
  }

  canStart() {
    return !this.props.pause && !this.requestId
  }

  canCancel() {
    return this.props.pause
  }

  componentDidMount() {
    this.organize()
    return this.canStart() && this.start()
  }

  componentWillReceiveProps(nextProps) {
    this.ifThrow()

    if (nextProps.d !== this.props.d) {
      this.cancel()
      this.organize()
    }
  }

  componentDidUpdate() {
    if (this.canStart()) {
      this.start()
    } else if (this.canCancel()) {
      this.cancel()
    }
  }

  componentWillUnmount() {
    this.cancel()
    this.parade.clear()
  }
}
