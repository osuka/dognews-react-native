import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootNavigatorParameters, styles} from '../Root';
import ReactNative from 'react-native';
import {Link} from '@react-navigation/native';

// @ts-ignore
// TODO: importing images from typescript gets a bit bonkers, better way?
const logo = require('../../../assets/onlydognews-logo-main.png');

// parameters that this screen can accept are declared here as an extension from
// from the root navigation parameters for the 'Home' case
type HomeScreenNavigationProps = StackNavigationProp<
  RootNavigatorParameters,
  'Home'
>;

export default function HomeScreen({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
}: {
  navigation: HomeScreenNavigationProps;
}): React.ReactElement {
  return (
    <ReactNative.View style={styles.homeContainer}>
      <ReactNative.Image source={logo} />
      <ReactNative.View style={styles.sectionContainer}>
        <ReactNative.View style={styles.innerContainer}>
          <Link to="/Articles">
            <ReactNative.Text style={styles.textLink}>
              Check Articles
            </ReactNative.Text>
          </Link>
          <Link to="/Moderation">
            <ReactNative.Text style={styles.textLink}>
              Access Moderation
            </ReactNative.Text>
          </Link>
        </ReactNative.View>
      </ReactNative.View>
    </ReactNative.View>
  );
}
