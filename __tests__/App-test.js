/**
 * @format
 */

import 'react-native'
import React from 'react'
import App from '../App'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

jest.mock(
  '../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter',
);

it('renders correctly', () => {
  // note: there is a mock for react-native-gesture-handler
  //     - otherwise it'll throw 'Cannot read property 'Direction' of undefined'
  // check jest.config.js (setupFiles)
  //  general.ts, node_modules/react-native-gesture-handler/.../jestSetup.js
  // https://github.com/software-mansion/react-native-gesture-handler/issues/344
  renderer.create(<App />)
})
