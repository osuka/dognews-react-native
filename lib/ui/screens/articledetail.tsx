import * as React from 'react';
import {WebView} from 'react-native-webview';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Palette} from '../Palette';

// This uses
//
// https://github.com/react-native-community/react-native-webview
//
// Note that it needs to be linked (npx react-native link react-native-webview)
// so that the native part is added to the iOS and Android projects

export function ArticleDetail({route, navigation}) {
  let webView: WebView;
  const [loading, setLoading] = React.useState(false);
  const {article} = route.params;

  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <Text>{article?.title || 'Untitled'}</Text>
      <WebView
        ref={(ref) => (webView = ref)}
        source={
          (article?.target_url && {uri: article.target_url}) || {
            html: '<h1>No item selected</h1>',
          }
        }
        incognito={true}
        style={{marginTop: 20}}
        onLoadEnd={() => setLoading(false)}
        onLoadStart={() => setLoading(true)}
      />
      <View style={{flexDirection: 'row', margin: 5}}>
        <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
          <Icon.Button
            key="back"
            iconStyle={{marginRight: 0}}
            name="arrow-left"
            solid={false}
            color={Palette.mainForeground}
            backgroundColor="transparent"
            onPress={() => navigation.goBack()}
          />
          <Icon.Button
            key="forward"
            iconStyle={{marginRight: 0}}
            name="arrow-right"
            solid={false}
            color={Palette.mainForeground}
            backgroundColor="transparent"
            onPress={() => webView.goForward()}
          />
          <Icon.Button
            key="reload"
            iconStyle={{marginRight: 0}}
            name="sync"
            solid={false}
            color={Palette.mainForeground}
            backgroundColor="transparent"
            onPress={() => webView.reload()}
          />
        </View>
      </View>
    </View>
  );
}

ArticleDetail.navigationOptions = ({navigation}) => {
  const {state} = navigation;
  return {
    title: `${state.params.article?.title}`,
  };
};
