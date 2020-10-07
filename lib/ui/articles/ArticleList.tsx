import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Item } from '../../models/items';
import { LoginContext, LoginContextType } from '../auth/Login';
import { Article } from './Article';
import { ArticleContext, ArticleContextType, ArticleControl } from './ArticleControl';
import { ArticleWebView } from './ArticleWebView';

const ItemSeparator = () => {
  return <View style={{ height: 2, width: '100%', backgroundColor: '#C8C8C8' }} />;
};

function ArticleListScreen({ navigation }) {
  const loginContext = useContext<LoginContextType>(LoginContext);
  const articleContext = useContext<ArticleContextType>(ArticleContext);

  const reload = () => {
    (async () => await ArticleControl.fetchNews(articleContext, loginContext.loginStatus))();
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
            refreshControl={<RefreshControl refreshing={ctx.fetchingStatus} onRefresh={reload} />}
            renderItem={({ item, index }: { item: Item; index: number }) => (
              <Article
                key={item.id}
                item={item}
                positionInList={index}
                totalItems={ctx.itemList.length}
                onArticleClick={() =>
                  navigation.push('Article Detail', {
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
