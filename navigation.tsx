import * as React from 'react';

import { Button, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { ArticleListScreen } from './lib/ui/ArticleList';
import { ArticleWebViewScreen } from './lib/ui/ArticleWebView';
import Auth from './Auth' // okta
import LoginScreen from './lib/auth/LoginScreen';
// import ProfileScreen from './lib/auth/ProfileScreen';

const HomeScreen = (props) => {
  return (
    <ScrollView>
      <Button
        title="Article Queue"
        onPress={() => props.navigation.navigate('Articles', {})}
      />
    </ScrollView>
  );
};
HomeScreen.navigationOptions = {
  title: 'Dog News Viewer'
};

export const MainNavigator = createStackNavigator({
  LoginScreen: {screen: LoginScreen},
  Home: { screen: HomeScreen },
  Articles: { screen: ArticleListScreen },
  ArticleWebView: { screen: ArticleWebViewScreen },
  // Profile: {screen: ProfileScreen}
});

