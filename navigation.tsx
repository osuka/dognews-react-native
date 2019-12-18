import * as React from 'react';

import { Button, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { ArticleListScreen } from './lib/ui/ArticleList';
import { ArticleWebViewScreen } from './lib/ui/ArticleWebView';
import Auth from './Auth' // okta

const HomeScreen = (props) => {
  return (
    <ScrollView>
      <Button
        title="Article Queue"
        onPress={() => props.navigation.navigate('Articles', {})}
      />
      <Auth />
    </ScrollView>
  );
};
HomeScreen.navigationOptions = {
  title: 'Dog News Viewer'
};

export const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Articles: { screen: ArticleListScreen },
  ArticleWebView: { screen: ArticleWebViewScreen },
});

