// @flow

const baseValProperties = {
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

export const nodeNames = Object.keys(baseValProperties)

export class Marcher {
  constructor({ element, totalLength, position, getPointAtLength }) {
    const { propertyX, propertyY } = baseValProperties[element.nodeName]
    this.baseValX = element[propertyX].baseVal
    this.baseValY = element[propertyY].baseVal

    this.totalLength = totalLength
    this.position = position
    this.getPointAtLength = getPointAtLength

    this.reflectPosition()
  }

  march(pace) {
    this.advancePosition(pace)
    this.reflectPosition()
  }

  advancePosition(pace) {
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
