/**
 * Dog News App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import * as React from 'react';

import { Button } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { ArticleListScreen } from './lib/components/ArticleList';
import { ArticleWebViewScreen } from './lib/components/ArticleWebView';
import { ArticleProvider } from './lib/services/articles';

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

const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Articles: { screen: ArticleListScreen },
  ArticleWebView: { screen: ArticleWebViewScreen },
});

const AppContainer = createAppContainer(MainNavigator);

const App = () => {
  return (
    <ArticleProvider>
      <AppContainer />
    </ArticleProvider>
  );
}

export default App;
