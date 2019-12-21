import * as React from 'react'
import { WebView } from 'react-native-webview'
import { View, Text, Button } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationScreenProps } from 'react-navigation'

import { Palette } from '../Palette'
import { Item } from '../../models/items'
import { ArticleControl } from './ArticleControl'

// This uses
//
// https://github.com/react-native-community/react-native-webview
//
// Note that it needs to be linked (npx react-native link react-native-webview)
// so that the native part is added to the iOS and Android projects

export function ArticleWebView(props: NavigationScreenProps) {
  const articles = ArticleControl()

  let webView: WebView
  const itemId: string = props.navigation.getParam('itemId')
  const item: Item = articles.articleStorage.itemList.find(
    (value) => value.id === itemId,
  )

  const newTitle = item?.title || 'No article title'
  if (props.navigation.getParam('title') !== newTitle) {
    props.navigation.setParams({ title: newTitle })
  }

  const rating = articles.getItemUserRating(item)

  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <Text>{item?.url || 'No url'}</Text>
      <WebView
        ref={(ref) => (webView = ref)}
        source={
          (item?.url && { uri: item.url }) || {
            html: '<h1>No item selected</h1>',
          }
        }
        incognito={true}
        style={{ marginTop: 20 }}
      />
      <View style={{ flexDirection: 'row', margin: 5 }}>
        <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
          <View style={{ margin: 4 }}>
            <Button title="<" onPress={() => webView.goBack()}></Button>
          </View>
          <View style={{ margin: 4 }}>
            <Button title=">" onPress={() => webView.goForward()}></Button>
          </View>
          <View style={{ margin: 4 }}>
            <Button title="reload" onPress={() => webView.reload()}></Button>
          </View>
          <View style={{ margin: 4 }}>
            <Button title="stop" onPress={() => webView.stopLoading()}></Button>
          </View>
        </View>
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}
        >
          {rating > 1 && <Text style={{ marginRight: 4 }}>{`+${rating}`}</Text>}
          <Icon.Button
            key={`rating-${rating}`}
            iconStyle={{ marginRight: 0 }}
            name={rating < 0 ? 'poo' : 'heart'}
            solid={!!rating}
            color={rating ? Palette.warningForeground : Palette.mainForeground}
            backgroundColor="transparent"
            onPress={() => articles.rateItem(item)}
          ></Icon.Button>
          <Icon.Button
            name="trash"
            color={Palette.headingForeground}
            backgroundColor="transparent"
            onPress={() => {
              // articles.removeItem(item)
              const currentUserRemovedIt = articles.getItemUserRating(item) < 0
              if (currentUserRemovedIt) {
                articles.rateItem(item, 0)
              } else {
                articles.rateItem(item, -1)
              }

              props.navigation.goBack()
            }}
          ></Icon.Button>
        </View>
      </View>
    </View>
  )
}

ArticleWebView.navigationOptions = ({ navigation }) => {
  const { state } = navigation
  return {
    title: `${state.params.title}`,
  }
}
