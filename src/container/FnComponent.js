/**
 * requires react as peerDependency
 */

import { Component } from 'react'

export default function convertFnC (fnComponent) {
  class FnComponent extends Component {
    render () {
      return fnComponent(this.state)
    }
  }
  return FnComponent
}
