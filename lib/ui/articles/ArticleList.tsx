import React from 'react';
import { FlatList, Button, View, Text } from 'react-native';
import {
  createAppContainer,
  createStackNavigator,
  NavigationScreenProps,
} from 'react-navigation';

import { Item } from '../../models/items';
import {
  ArticleContextType,
  ArticleContext,
  ArticleControl,
} from './ArticleControl';
import { Article } from './Article';
import { ArticleWebView } from './ArticleWebView';
import { LoginContext } from '../auth/Login';

const ItemSeparator = () => {
  return (
    <View style={{ height: 2, width: '100%', backgroundColor: '#C8C8C8' }} />
  );
};

function ArticleListScreen(props: NavigationScreenProps) {
  return (
    <ArticleContext.Consumer>
      {(ctx) => (
        <View>
          <LoginContext.Consumer>
            {(loginContext) => (
              <Button
                title="update"
                onPress={async () => {
                  await ArticleControl.fetchNews(ctx, loginContext.loginStatus);
                }}
              />
            )}
          </LoginContext.Consumer>
          <FlatList
            data={ctx.itemList}
            renderItem={({ item, index }: { item: Item; index: number }) => (
              <Article
                key={item.id}
                item={item}
                positionInList={index}
                totalItems={ctx.itemList.length}
                // onArticleClick={() => history.push(`/articles/${item.id}`)}
                onArticleClick={() =>
                  props.navigation.navigate('ArticleDetail', {
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

export const ArticleListNavigator = createStackNavigator(
  {
    Test: { screen: () => <Text>Hey</Text> },
    Home: { screen: ArticleListScreen },
    ArticleDetail: { screen: ArticleWebView },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
  },
);

export const ArticleList = createAppContainer(ArticleListNavigator);
