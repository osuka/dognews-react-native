import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { WebView } from 'react-native-webview';
import { Palette } from '../Palette';
import { RootStackParamList } from '../Root';

// Check the (many) notes at
// https://github.com/react-native-community/react-native-webview
//

// Type validation for screens: https://reactnavigation.org/docs/typescript#type-checking-screens
type RoutePropType = RouteProp<RootStackParamList, 'ArticleDetail'>;

type NavigationPropType = StackNavigationProp<
  RootStackParamList,
  'ArticleDetail'
>;

type Props = {
  route: RoutePropType;
  navigation: NavigationPropType;
};

const styles = StyleSheet.create({
  mainContainer: { flexDirection: 'column', flex: 1 },
  webview: {},
  buttonRow: { alignItems: 'flex-start', flexDirection: 'row' },
  icons: { marginRight: 0 },
  privacyText: {
    textAlignVertical: 'center',
    flexGrow: 1,
    flex: 1,
    fontStyle: 'italic',
    left: 6,
  },
});

export function ArticleDetail({ route, navigation }: Props) {
  let webView: WebView | null;
  const [loading, setLoading] = React.useState(false);
  const { article } = route.params;
  const iconActions = [
    { icon: 'arrow-left', run: () => navigation.goBack() },
    { icon: 'arrow-right', run: () => webView && webView.goForward() },
    { icon: 'sync', run: () => webView && webView.reload() },
  ];

  return (
    <View style={styles.mainContainer}>
      <WebView
        ref={ref => (webView = ref)}
        source={
          (article?.target_url && { uri: article.target_url }) || {
            html: '<h1>No item selected</h1>',
          }
        }
        incognito={true}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        onLoadStart={() => setLoading(true)}
      />
      <View style={styles.buttonRow}>
        {iconActions.map(action => (
          <Icon.Button
            key={action.icon}
            iconStyle={styles.icons}
            name={action.icon}
            color={Palette.mainForeground}
            backgroundColor="transparent"
            onPress={action.run}
          />
        ))}
        {loading && <ActivityIndicator size="large" color="black" />}
        <View>
          <Text style={styles.privacyText}>
            Privacy on: Browser will forget cookies
          </Text>
        </View>
      </View>
    </View>
  );
}
