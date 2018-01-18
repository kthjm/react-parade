// @flow
import * as React from 'react'
import { nodeNames, Marcher } from './Marcher.js'
import type { TotalLength, Position, Fn$GetPointAtLength } from './types.js'

const isStr = (data: any): boolean => typeof data === 'string'
const isNum = (data: any): boolean => typeof data === 'number'
const raf = (cb: () => void): number => window.requestAnimationFrame(cb)
const caf = (requestId?: number): void => window.cancelAnimationFrame(requestId)

type PathElement = {
  getTotalLength: () => TotalLength,
  getPointAtLength: Fn$GetPointAtLength
}

type CreatePathUtil$Result = {
  totalLength: TotalLength,
  getPointAtLength: Fn$GetPointAtLength
}

const createPath = (d: string): PathElement => {
  const path: any = document.createElementNS('http://www.w3.org/2000/svg','path')
  ;(path: PathElement)
  path.setAttribute('d', d)
  return path
}

const createPathUtil = (d: string): CreatePathUtil$Result => {
  const path: PathElement = createPath(d)
  const totalLength: TotalLength = path.getTotalLength()
  const getPointAtLength: Fn$GetPointAtLength = position => path.getPointAtLength(position)
  return { totalLength, getPointAtLength }
}

type RefFn = (g: React$ElementRef<*> | null) => void
type GetElementsFn = () => Array<Element>

const ref: RefFn = function(g: any) {
  if (g) {
    ;(g: React$ElementType)
    this.getElements = () => {
      const elements = []
      nodeNames.forEach(nodeName =>
        extractElements(g, nodeName).forEach(element => elements.push(element))
      )
      return elements
    }
  } else {
    ;(g: null)
    delete this.getElements
  }
}
const extractElements = (g: Element, nodeName: string): Array<Element> =>
  Array.from(g.querySelectorAll(nodeName))

type Props = {
  d: string,
  pace: number,
  pause?: boolean,
  children: React$Node
}

export default class Parade extends React.Component<Props> {
  static defaultProps: {
    pace: 1
  }
  parade: Set<Marcher>
  requestId: number | void
  animation: () => void
  ref: RefFn
  getElements: GetElementsFn

  componentWillMount() {
    this.throwInvalidProps(this.props)

    this.parade = new Set()
    this.requestId = undefined
    this.animation = () => {
      const pace = this.props.pace
      this.parade.forEach(marcher => marcher.marching(pace))
      this.request()
    }

    this.ref = ref.bind(this)
  }

  render() {
    return <g ref={this.ref}>{this.props.children}</g>
  }

  componentDidMount() {
    this.organize()

    if (this.canStart()) {
      this.start()
    }
  }

  organize() {
    this.parade.clear()

    const { totalLength, getPointAtLength } = createPathUtil(this.props.d)

    this.getElements().forEach((element, index, { length }) =>
      this.parade.add(
        new Marcher({
          element,
          totalLength,
          getPointAtLength,
          position: totalLength * (index / length)
        })
      )
    )
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

  componentWillReceiveProps(nextProps: Props) {
    this.throwInvalidProps(nextProps)
  }

  componentDidUpdate(prevProps: Props) {
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

  componentWillUnmount() {
    this.cancel()
    this.parade.clear()
    delete this.parade
    delete this.animation
    delete this.ref
  }

  throwInvalidProps(props: Props) {
    if (!props.d || !isStr(props.d)) {
      throw new Error('react-parade component requires props.d')
    }

    if (!isNum(props.pace)) {
      throw new TypeError('react-parade component props.pace must be "number"')
    }
  }
}

Parade.defaultProps = {
  pace: 1
}