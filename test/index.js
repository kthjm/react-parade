import assert from 'assert'
import sinon from 'sinon'
import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import enzyme from 'enzyme'
enzyme.configure({ adapter: new Adapter() })

import Parade from '../src'

// describe('', () => {
//   it('', () => enzyme.mount(<Parade d={""} />))
// })