import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootNavigatorParameters, styles} from '../Root';
import ReactNative from 'react-native';
import {Link} from '@react-navigation/native';

import {
  ArticleContext,
  ArticleContextType,
  ArticleControl,
} from '../articles/ArticleControl';
import {Item} from '../../models/items';
import {ArticleList} from '../articles/ArticleList';
import {LoginContext, LoginContextType} from '../auth/Login';

type ModerationScreenNavigationProp = StackNavigationProp<
  RootNavigatorParameters,
  'Moderation'
>;

export default function ModerationScreen({
  navigation,
}: {
  navigation: ModerationScreenNavigationProp;
}): React.ReactElement {
  const [fetchingStatus, setFetchingStatus] = React.useState<boolean>(false);
  const [itemList, setItemList] = React.useState<Array<Item>>([]);
  // context that facilitate finding the state values
  const moderationArticleContext: ArticleContextType = {
    fetchingStatus,
    setFetchingStatus,
    itemList,
    setItemList,
    source: 'api',
  };

  // if moderated items are modified, save them
  React.useEffect(() => {
    async () =>
      await ArticleControl.persistToStorage(
        'moderation',
        moderationArticleContext.itemList,
      );
  }, [moderationArticleContext.itemList]);

  const loginContext = React.useContext<LoginContextType>(LoginContext);

  return loginContext.loginStatus.accessToken ? (
    <ArticleContext.Provider value={moderationArticleContext}>
      <ArticleList />
    </ArticleContext.Provider>
  ) : (
    <ReactNative.View style={styles.moderationContainer}>
      <ReactNative.Text style={styles.sectionTitle}>
        Article Moderation
      </ReactNative.Text>
      <ReactNative.Text style={styles.sectionDescription}>
        The moderation queue is only available to registered users with
        moderation access
      </ReactNative.Text>
      <Link to="/Login">
        <ReactNative.Text style={styles.textLink}>
          Please Login
        </ReactNative.Text>
      </Link>
      <ReactNative.Text
        onPress={() => navigation.goBack()}
        style={styles.goBackLink}>
        Go Back
      </ReactNative.Text>
    </ReactNative.View>
  );
}
