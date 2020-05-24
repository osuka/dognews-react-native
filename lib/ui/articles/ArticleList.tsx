import React, { useContext } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Spinner from 'react-native-loading-spinner-overlay';

import { Item } from '../../models/items';
import {
  ArticleContextType,
  ArticleContext,
  ArticleControl,
} from './ArticleControl';
import { Article } from './Article';
import { ArticleWebView } from './ArticleWebView';
import { LoginContext, LoginContextType } from '../auth/Login';

const ItemSeparator = () => {
  return (
    <View style={{ height: 2, width: '100%', backgroundColor: '#C8C8C8' }} />
  );
};

function ArticleListScreen({ navigation }) {
  const loginContext = useContext<LoginContextType>(LoginContext);
  const articleContext = useContext<ArticleContextType>(ArticleContext);

  const reload = () => {
    (async () =>
      await ArticleControl.fetchNews(
        articleContext,
        loginContext.loginStatus,
      ))();
  };

  return (
    <ArticleContext.Consumer>
      {(ctx) => (
        <View>
          <Spinner
            visible={ctx.fetchingStatus}
            textContent={'Loading...'}
            textStyle={{ color: '#e0e0e0' }}
          />
          <FlatList
            data={ctx.itemList}
            refreshControl={
              <RefreshControl
                refreshing={ctx.fetchingStatus}
                onRefresh={reload}
              />
            }
            renderItem={({ item, index }: { item: Item; index: number }) => (
              <Article
                key={item.id}
                item={item}
                positionInList={index}
                totalItems={ctx.itemList.length}
                onArticleClick={() =>
                  navigation.push("ArticleDetail", {
                    itemId: item.id,
                    title: item.title,
                  })
                }
              />
            )}
            ItemSeparatorComponent={ItemSeparator}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </ArticleContext.Consumer>
  );
}

ArticleListScreen.navigationOptions = {
  title: 'Dog News Viewer',
};

const Stack = createStackNavigator();

export const ArticleList = () => (
  <Stack.Navigator initialRouteName="Home" headerMode="none">
    <Stack.Screen name="Home" component={ArticleListScreen} />
    <Stack.Screen name="ArticleDetail" component={ArticleWebView} />
  </Stack.Navigator>
);
