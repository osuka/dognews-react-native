// https://reactnavigation.org/docs/typescript/

import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// maps route with parameters to be received
export type RootNavigatorParameters = {
  Home: undefined;
  Moderation: undefined;
  Articles: undefined;
  Login: undefined;
};

export const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moderationContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
    padding: 20,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  textLink: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 20,
    textDecorationLine: 'underline',
  },
  goBackLink: {
    textDecorationLine: 'underline',
    paddingTop: 30,
    textAlign: 'center',
  },
});
