import React, { useEffect } from 'react'
import { FlatList, Button, View } from 'react-native'
import { Item, ArticleControl } from '../services/articles'
import { NewsItem } from './Article'
import { NavigationScreenProps } from 'react-navigation'

const ItemSeparator = () => {
  return (
    <View style={{ height: 2, width: '100%', backgroundColor: '#C8C8C8' }} />
  )
}

export function ArticleListScreen(props: NavigationScreenProps) {
  const articles = ArticleControl()
  const { navigate } = props.navigation

  // useEffect with '[]' effectively makes this a componentDidMount
  // tells react this 'effect' does not depend on any prop

  useEffect(() => {
    // effects can't return promises - this will work because
    // fetchNews returns a promise that will be handled by
    // the pending async promises microtask in V8
    articles.fetchNews()
  }, [])

  return (
    <View
      style={{
        marginTop: 32,
        paddingHorizontal: 24,
      }}
    >
      <FlatList
        data={articles.articleStorage.itemList}
        renderItem={({ item, index }: { item: Item; index: number }) => (
          <NewsItem
            key={item.id}
            item={item}
            positionInList={index}
            totalItems={articles.articleStorage.itemList.length}
            onArticleClick={(item) => props.navigation.navigate('ArticleWebView', { item })}
          />
        )}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item) => item.id}
      />
      <Button title="Back" onPress={() => props.navigation.goBack()} />
      <Button
        title="Detail page"
        onPress={() => navigate('ArticleWebView', { id: 3 })}
      />
    </View>
  )
}

ArticleListScreen.navigationOptions = {
  title: 'Article Queue',
}
