/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LoginState } from './lib/models/login';
import {
  loadLoginFromStorage,
  LoginContext,
  LoginScreen,
  persistLoginStatus,
} from './lib/ui/auth/Login';
import { ArticleDetail } from './lib/ui/screens/articledetail';
import ArticleListScreen from './lib/ui/screens/articlelist';
import ModerationScreen from './lib/ui/moderation/ModerationScreen';

// @ts-ignore
// TODO: importing images from typescript gets a bit bonkers, better way?
const logo = require('./assets/onlydognews-logo-main.png');

// opt-in javascript engine optimized for react native
// https://reactnative.dev/docs/hermes
declare const global: { HermesInternal: null | {} }; // needed so TS doesn't complain

// import 'react-native-gesture-handler'

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

const headerStyles = StyleSheet.create({
  logo: {
    height: 48,
    width: 48,
    right: 5,
  },
});

const Logo = () => <Image style={headerStyles.logo} source={logo} />;

const HomeNavigatorScreen = () => {
  const navigation = useNavigation(); // grab the drawer navigator

  const HamburgerMenu = () => (
    <Icon.Button
      name="bars"
      color="black"
      backgroundColor="white"
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    />
  );

  const screenDefaults = {
    headerLeft: () => <HamburgerMenu />,
    headerRight: Logo,
  };

  return (
    <Stack.Navigator initialRouteName="ArticleList">
      <Stack.Screen
        name="ArticleList"
        component={ArticleListScreen}
        options={{
          ...screenDefaults,
          headerTransparent: true,
          headerRight: undefined,
          title: '',
        }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetail}
        options={{
          ...screenDefaults,
          headerTransparent: true,
          title: '',
        }}
      />
    </Stack.Navigator>
  );
};

export const App = () => {
  const [loginStatus, setLoginStatus] = React.useState(loadLoginFromStorage() as LoginState);

  // let history = useHistory();
  // applyBrowserLocationBlocker(history);

  // if login status is modified, save it
  React.useEffect(() => {
    (async () => await persistLoginStatus(loginStatus))();
  }, [loginStatus]);

  return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="HomeNavigator"
          drawerType="slide"
          drawerContentOptions={{
            labelStyle: {
              fontSize: 24,
            },
          }}>
          <Stack.Screen name="News" component={HomeNavigatorScreen} />
          <Stack.Screen name="Collaborate" component={ModerationScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </LoginContext.Provider>
  );
};

export default App;
