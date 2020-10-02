/**
 * @format
 */

jest.mock('../lib/ui/auth/Login'); // TODO: proper

import 'react-native';
import React from 'react';
import App from '../App';

import {create, act} from 'react-test-renderer';

beforeEach(() => {
  jest.resetModules();
});

it('renders correctly', async () => {
  // import {
  //   LoginScreen,
  //   LoginContext,
  //   loadLoginFromStorage,
  //   persistLoginStatus,
  // } from './lib/ui/auth/Login';

  // https://reactjs.org/docs/test-utils.html#act

  let root;
  await act(async () => {
    root = create(<App />);
  });
  expect(root).toBeTruthy();
});
