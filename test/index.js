import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'
import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import enzyme from 'enzyme'
enzyme.configure({ adapter: new Adapter() })

describe('component: Parade', () => {

  const requestId = 'requestId'
  class Stub {} // use for sinon.createStubInstance(Stub)

  describe('throwed until render', () => {

    const Parade = rewire('../src').default

    it('!props.d || !isStr(props.d)', () => {
      const valids = [false,null,undefined,0,true,{},[],() => {}]
      valids.forEach((d) =>
        assert.throws(
          () => enzyme.shallow(<Parade {...{ d }} />),
          /react-parade component requires props.d/
        )
      )
    })

    it('!isNum(props.pace)', () => {
      const d = 'string'
      const valids = [null,'string',true,{},[],() => {}]
      valids.forEach((pace) =>
        assert.throws(
          () => enzyme.shallow(<Parade {...{ d, pace }} />),
          /react-parade component props.pace must be "number"/
        )
      )
    })
  })

  it('until componentDidMount', () => {
    const modules = rewire('../src')

    // Parade.prototype.getElements
    const elements = [0,0,0,0,0]
    const getElements = sinon.stub().returns(elements)
    const Parade = modules.default
    Parade.prototype.getElements = getElements
    // ref set react.getElements
    // dirty solution for issue that ref won't run.
    // This may be "jsdom" and "<svg />" and "ref/enzyme"

    // createPathUtil
    const createPathUtil = sinon.stub().returns({})

    // Marcher
    const Marcher = sinon.stub().returns(sinon.createStubInstance(Stub))
    // sinon.createStubInstance() https://github.com/sinonjs/sinon/issues/831

    // raf/caf
    const raf = sinon.stub().returns(requestId)
    const caf = sinon.stub()

    return modules.__with__({
      createPathUtil,
      _Marcher: { Marcher },
      raf,
      caf
    })(() => {
      const d = 'initialD'
      const wrapper = enzyme.shallow(<Parade {...{ d }} />)

      /* const { totalLength, getPointAtLength } = createPathUtil(this.props.d) */
      assert.equal(createPathUtil.callCount, 1)
      assert.equal(createPathUtil.args[0][0], d)

      /* this.getElements().forEach(() => this.parade.add(new Marcher())) */
      assert.equal(getElements.callCount, 1)
      assert.equal(Marcher.callCount, elements.length)

      /* this.requestId = raf(this.animation) */
      assert.equal(raf.callCount, 1)
      assert.ok(typeof raf.args[0][0] === 'function')
      assert.equal(wrapper.instance().requestId, requestId)
    })
  })

  describe('after mount', () => {

    it('componentDidUpdate: if (prevProps.d !== this.props.d)', () =>
      mount({ d: 'initialD' }, (wrapper) => {
        const instance = wrapper.instance()
        const cancel = sinon.stub(instance, 'cancel')
        const organize = sinon.stub(instance, 'organize')
        wrapper.setProps({ d: 'secondD' })
        assert.equal(cancel.callCount, 1)
        assert.equal(organize.callCount, 1)
      })
    )

    it('componentDidUpdate: if (this.canStart())', () =>
      mount({ d: 'initialD', pause: true }, (wrapper) => {
        const instance = wrapper.instance()
        assert.ok(!instance.requestId)
        wrapper.setProps({ pause: false })
        assert.equal(instance.requestId, requestId)
      })
    )

    it('componentDidUpdate: if (this.canCancel())', () =>
      mount({ d: 'initialD', pause: false }, (wrapper) => {
        const instance = wrapper.instance()
        assert.equal(instance.requestId, requestId)
        wrapper.setProps({ pause: true })
        assert.ok(!instance.requestId)
      })
    )

    it('componentWillUnmount', () =>
      mount({ d: 'initialD' }, (wrapper) => {
        const instance = wrapper.instance()
        assert.ok(instance.parade)
        assert.ok(instance.animation)
        assert.ok(instance.ref)
        wrapper.unmount()
        assert.ok(!instance.parade)
        assert.ok(!instance.animation)
        assert.ok(!instance.ref)
      })
    )

    function mount(initialProps, uniqueTest) {
      const modules = rewire('../src')

      const Parade = modules.default
      Parade.prototype.getElements = () => []

      const createPathUtil = sinon.stub().returns({})
      const Marcher = () => sinon.createStubInstance(Stub)
      const raf = () => requestId
      const caf = () => {}

      return modules.__with__({
        createPathUtil,
        _Marcher: { Marcher },
        raf,
        caf
      })(() =>
        uniqueTest(
          enzyme.shallow(<Parade {...initialProps} />)
        )
      )
    }
  })
})

it('Marcher', () => {
  const { Marcher } = require('../src/Marcher.js')

  const elements = Elements()
  const totalLength = 1000
  const value = 50
  const getPointAtLength = () => ({ x: value, y: value })

  elements.map((element, index, { length }) =>
    new Marcher({
      element,
      totalLength,
      getPointAtLength,
      position: totalLength * (index / length)
    })
  ).forEach((marcher, index, { length }) => {

    // this.reflectPosition() in constructor
    const element = elements[index]
    const x = element.x || element.cx
    const y = element.y || element.cy
    assert.equal(x.baseVal.value, value)
    assert.equal(y.baseVal.value, value)

    // nextPosition < this.totalLength
    const nowPosition1 = totalLength * (index / length)
    const pace1 = 10
    const nextPosition1 = nowPosition1 + pace1
    marcher.marching(pace1)
    assert.equal(marcher.position, nextPosition1)

    // nextPosition >= this.totalLength
    const nowPosition2 = nextPosition1
    const pace2 = totalLength
    const nextPosition2 = nowPosition2 // (nowPosition2 + totalLength) - totalLength
    marcher.marching(pace2)
    assert.equal(marcher.position, nowPosition2)
  })

  function Elements() {
    return [
      {
        nodeName: 'circle',
        cx: {
          baseVal: {
            value: undefined
          }
        },
        cy: {
          baseVal: {
            value: undefined
          }
        }
      },
      {
        nodeName: 'ellipse',
        cx: {
          baseVal: {
            value: undefined
          }
        },
        cy: {
          baseVal: {
            value: undefined
          }
        }
      },
      {
        nodeName: 'rect',
        x: {
          baseVal: {
            value: undefined
          }
        },
        y: {
          baseVal: {
            value: undefined
          }
        }
      },
      {
        nodeName: 'image',
        x: {
          baseVal: {
            value: undefined
          }
        },
        y: {
          baseVal: {
            value: undefined
          }
        }
      }
    ]
  }
})


