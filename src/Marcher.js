// @flow
import type { TotalLength, Position, Fn$GetPointAtLength } from './types.js'

type NodeName = string
type PropertyXY = string
type BaseVal = { value: number }
type Marcher$Element = {
  nodeName: NodeName,
  [propertyXY: PropertyXY]: { baseVal: BaseVal }
}

const baseValProperties: {
  [key: NodeName]: {
    propertyX: PropertyXY,
    propertyY: PropertyXY
  }
} = {
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

export const nodeNames: Array<NodeName> = Object.keys(baseValProperties)

type Props = {
  element: Marcher$Element,
  totalLength: TotalLength,
  getPointAtLength: Fn$GetPointAtLength,
  position: Position
}

export class Marcher {
  baseValX: BaseVal
  baseValY: BaseVal
  totalLength: TotalLength
  getPointAtLength: Fn$GetPointAtLength
  position: Position

  constructor({ element, totalLength, getPointAtLength, position }: Props) {
    const { propertyX, propertyY } = baseValProperties[element.nodeName]
    this.baseValX = element[propertyX].baseVal
    this.baseValY = element[propertyY].baseVal

    this.totalLength = totalLength
    this.getPointAtLength = getPointAtLength
    this.position = position
    
    this.reflectPosition()
  }

  marching(pace: number): void {
    this.advancePosition(pace)
    this.reflectPosition()
  }

  advancePosition(pace: number) {
    const nextPosition = this.position + pace
    this.position =
      nextPosition < this.totalLength
        ? nextPosition
        : nextPosition - this.totalLength
  }

  reflectPosition() {
    const { x, y } = this.getPointAtLength(this.position)
    this.baseValX.value = x
    this.baseValY.value = y
  }
}
