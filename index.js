/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { LogBox } from 'react-native';

// check: https://github.com/facebook/metro/issues/287
//        https://github.com/facebook/react-native/issues/23130
LogBox.ignoreLogs(['Require cycle: node_modules/react-native/Libraries/Network/fetch.js']);

AppRegistry.registerComponent(appName, () => App);
