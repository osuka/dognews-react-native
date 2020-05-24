import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import {
  ArticleContext,
  ArticleContextType,
  ArticleControl,
} from './lib/ui/articles/ArticleControl';
import { Item } from './lib/models/items';

import {
  LoginScreen,
  LoginContext,
  loadLoginFromStorage,
  persistLoginStatus,
} from './lib/ui/auth/Login';
import queueFactory from 'react-native-queue';
import { LoginState } from './lib/models/login';
import { ArticleList } from './lib/ui/articles/ArticleList';
import { createStackNavigator } from '@react-navigation/stack';
import { Link, CommonActions } from '@react-navigation/native';

function NoMatch({ location }) {
  return <Text style={styles.header}>No match for {location.pathname}</Text>;
}

// // We need this until https://github.com/ReactTraining/react-router/issues/5362 is fixed
// // Currently clicking twice on the same route generates a new entry, it shouldn't if
// // it's in the same place

// function applyBrowserLocationBlocker(history: History) {
//   if (history.isBrowserBlockerApplied) {
//     return; // we need to call block only once, else they accumulate
//     // note that this is not a perfect fix - reload AppMain will attempt to recreate it
//   }
//   history.isBrowserBlockerApplied = true; // monkey patching
//   let currentLocation = null;

//   history.block((location, action) => {
//     const nextLocation = location.pathname + location.search;

//     if (action === 'PUSH') {
//       if (currentLocation === nextLocation) {
//         return false;
//       }
//     }

//     currentLocation = nextLocation;
//   });
// }

// -----------------------

export const AppMain = () => {
  const [loginStatus, setLoginStatus] = React.useState({
    username: '',
  } as LoginState);

  const [fetchingStatus, setFetchingStatus] = React.useState<boolean>(false);
  const [itemList, setItemList] = React.useState<Array<Item>>([]);

  const [feedFetchingStatus, feedSetFetchingStatus] = React.useState<boolean>(
    false,
  );
  const [feedItemList, feedSetItemList] = React.useState<Array<Item>>([]);

  // context that facilitate finding the state values
  const moderationArticleContext: ArticleContextType = {
    fetchingStatus,
    setFetchingStatus,
    itemList,
    setItemList,
    source: 'api',
  };

  const latestNewsArticleContext: ArticleContextType = {
    fetchingStatus: feedFetchingStatus,
    setFetchingStatus: feedSetFetchingStatus,
    itemList: feedItemList,
    setItemList: feedSetItemList,
    source: 'https://onlydognews.com/latest-news.json',
  };

  // let history = useHistory();
  // applyBrowserLocationBlocker(history);

  // start by trying to recover login status from local storage
  React.useEffect(() => {
    (async () => {
      await loadLoginFromStorage({ loginStatus, setLoginStatus });
      // if moderated items existed, restore them
      await ArticleControl.restoreFromStorage(
        'moderation',
        moderationArticleContext,
      );
      // fetch latest news
      await ArticleControl.fetchNews(latestNewsArticleContext, loginStatus);
    })();
  }, []);

  // if login status is modified, save it
  React.useEffect(() => {
    (async () => await persistLoginStatus(loginStatus))();
  }, [loginStatus]);

  // if moderated items are modified, save them
  React.useEffect(() => {
    async () =>
      await ArticleControl.persistToStorage(
        'moderation',
        moderationArticleContext.itemList,
      );
  }, [moderationArticleContext.itemList]);

  const Stack = createStackNavigator();

  const HomeScreen = () => (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image source={require('./assets/onlydognews-logo-main.png')} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <Link to="/Articles">
            <Text style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 20 }}>
              Check Articles
            </Text>
          </Link>
          <Link to="/Moderation">
            <Text style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 20 }}>
              Access Moderation
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );

  const ModerationScreen = ({ navigation }) => {
    return loginStatus.accessToken ? (
      <ArticleContext.Provider value={moderationArticleContext}>
        <ArticleList />
      </ArticleContext.Provider>
    ) : (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
          Moderation of Articles
        </Text>
        <Text style={{ padding: 20 }}>
          The moderation queue is only available to registered users with
          moderation access
        </Text>
        <Link to="/Login">
          <Text style={{ textDecorationLine: 'underline' }}>Please Login</Text>
        </Link>
        <Text
          onPress={() => navigation.goBack()}
          style={{
            textDecorationLine: 'underline',
            paddingTop: 30,
            textAlign: 'center',
          }}
        >
          Go Back
        </Text>
      </View>
    );
  };

  const ArticleScreen = () => (
    <ArticleContext.Provider value={latestNewsArticleContext}>
      <ArticleList />
    </ArticleContext.Provider>
  );

  return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Articles" component={ArticleScreen} />
            <Stack.Screen name="Moderation" component={ModerationScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
    </LoginContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    padding: 10,
  },
  header: {
    fontSize: 20,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  subNavItem: {
    padding: 5,
  },
});
