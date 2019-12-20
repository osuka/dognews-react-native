import React, { useEffect } from 'react'
import { FlatList, Button, View, Text } from 'react-native'
import { Item, ArticleControl } from '../../services/articles'
import { Article } from './Article'
import { createStackNavigator, NavigationScreenProps } from 'react-navigation';
import { useHistory } from 'react-router-native';
import { ArticleWebView } from '../articles/ArticleWebView';
import { createAppContainer } from 'react-navigation';

const ItemSeparator = () => {
  return (
    <View style={{ height: 2, width: '100%', backgroundColor: '#C8C8C8' }} />
  )
}

function ArticleListScreen(props) {
  const articles = ArticleControl()

  // useEffect with '[]' effectively makes this a componentDidMount
  // tells react this 'effect' does not depend on any prop

  useEffect(() => {
    // effects can't return promises - this will work because
    // fetchNews returns a promise that will be handled by
    // the pending async promises microtask in V8
    articles.fetchNews()
  }, [])

  let history = useHistory();

  return (
    <View
    >
      <FlatList
        data={articles.articleStorage.itemList}
        renderItem={({ item, index }: { item: Item; index: number }) => (
          <Article
            key={item.id}
            item={item}
            positionInList={index}
            totalItems={articles.articleStorage.itemList.length}
            // onArticleClick={() => history.push(`/articles/${item.id}`)}
            onArticleClick={() => props.navigation.navigate('ArticleDetail', { itemId: item.id, title: item.title })}
            />
        )}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

ArticleListScreen.navigationOptions = {
  title: 'Dog News Viewer'
};

export const ArticleListNavigator = createStackNavigator({
  Test: { screen: () => <Text>Hey</Text>},
  Home: { screen: ArticleListScreen },
  ArticleDetail: { screen: ArticleWebView },
}, {
  initialRouteName: 'Home'
});

export const ArticleList = createAppContainer(ArticleListNavigator);
