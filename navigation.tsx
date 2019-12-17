import * as React from 'react';

import { Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { ArticleListScreen } from './lib/ui/ArticleList';
import { ArticleWebViewScreen } from './lib/ui/ArticleWebView';

const HomeScreen = (props) => {
  return (
    <Button
      title="Article Queue"
      onPress={() => props.navigation.navigate('Articles', {})}
    />
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

