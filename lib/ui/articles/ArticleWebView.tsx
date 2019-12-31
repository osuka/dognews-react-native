import * as React from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationStackScreenProps } from 'react-navigation-stack';

import { Palette } from '../Palette';
import { Item } from '../../models/items';
import { ArticleContext, ArticleContextType, ArticleControl } from './ArticleControl';

// This uses
//
// https://github.com/react-native-community/react-native-webview
//
// Note that it needs to be linked (npx react-native link react-native-webview)
// so that the native part is added to the iOS and Android projects

export function ArticleWebView(props: NavigationStackScreenProps) {
  let webView: WebView;
  const [loading, setLoading] = React.useState(false);
  const articleContext = React.useContext(ArticleContext);
  const itemId: string = props.navigation.getParam('itemId');
  const item: Item = ArticleControl.findItem(articleContext, itemId);

  const newTitle = item?.title || 'No article title';
  if (props.navigation.getParam('title') !== newTitle) {
    props.navigation.setParams({ title: newTitle });
  }

  const rating = ArticleControl.getItemUserRating(articleContext, item);

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
        onLoadEnd={() => setLoading(false)}
        onLoadStart={() => setLoading(true)}
      />
      <View style={{ flexDirection: 'row', margin: 5 }}>
        <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
          <Icon.Button
            key='back'
            iconStyle={{ marginRight: 0 }}
            name='arrow-left'
            solid={false}
            color={Palette.mainForeground}
            backgroundColor="transparent"
            onPress={() => props.navigation.goBack()}
          />
          <Icon.Button
            key='forward'
            iconStyle={{ marginRight: 0 }}
            name='arrow-right'
            solid={false}
            color={Palette.mainForeground}
            backgroundColor="transparent"
            onPress={() => webView.goForward()}
          />
          <Icon.Button
            key='reload'
            iconStyle={{ marginRight: 0 }}
            name='sync'
            solid={false}
            color={Palette.mainForeground}
            backgroundColor="transparent"
            onPress={() => webView.reload()}
          />
          {loading ? (
            <Icon.Button
              key='stop'
              iconStyle={{ marginRight: 0 }}
              name='stop'
              solid={!!rating}
              color={
                rating ? Palette.warningForeground : Palette.mainForeground
              }
              backgroundColor="transparent"
              onPress={() => webView.stopLoading()}
            />
          ) : (
            <Icon.Button
              key='close'
              iconStyle={{ marginRight: 0 }}
              name='times'
              solid={!!rating}
              color={
                rating ? Palette.warningForeground : Palette.mainForeground
              }
              backgroundColor="transparent"
              onPress={() => props.navigation.goBack()}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          {rating > 1 && <Text style={{ marginRight: 4 }}>{`+${rating}`}</Text>}
          <Icon.Button
            key={`rating-${rating}`}
            iconStyle={{ marginRight: 0 }}
            name={rating < 0 ? 'poo' : 'heart'}
            solid={!!rating}
            color={rating ? Palette.warningForeground : Palette.mainForeground}
            backgroundColor="transparent"
            onPress={() => ArticleControl.rateItem(articleContext, item)}
          ></Icon.Button>
          <Icon.Button
            name="trash"
            color={Palette.headingForeground}
            backgroundColor="transparent"
            onPress={() => {
              // articles.removeItem(item)
              const currentUserRemovedIt =
                ArticleControl.getItemUserRating(articleContext, item) < 0;
              if (currentUserRemovedIt) {
                ArticleControl.rateItem(articleContext, item, 0);
              } else {
                ArticleControl.rateItem(articleContext, item, -1);
              }

              props.navigation.goBack();
            }}
          ></Icon.Button>
        </View>
      </View>
    </View>
  );
}

ArticleWebView.navigationOptions = ({ navigation }) => {
  const { state } = navigation;
  return {
    title: `${state.params.title}`,
  };
};
