import * as React from 'react';
import { Text, View, StyleSheet, Image, Button } from 'react-native';
import {
  ArticleContext,
  ArticleContextType,
  LatestArticlesContextType,
} from './lib/ui/articles/ArticleControl';
import { Item } from './lib/models/items';
import {
  Route,
  Link,
  Switch,
  History,
  useHistory,
  BackButton,
  create,
} from 'react-router-native';
import HTML from 'react-native-render-html';
import { LoginHome, LoginContextType, LoginContext } from './lib/ui/auth/Login';
import { LoginState } from './lib/models/login';
import { ArticleList } from './lib/ui/articles/ArticleList';
import { Article } from './lib/ui/articles/Article';

function NoMatch({ location }) {
  return <Text style={styles.header}>No match for {location.pathname}</Text>;
}

// We need this until https://github.com/ReactTraining/react-router/issues/5362 is fixed
// Currently clicking twice on the same route generates a new entry, it shouldn't if
// it's in the same place

function applyBrowserLocationBlocker(history: History) {
  if (history.isBrowserBlockerApplied) {
    return; // we need to call block only once, else they accumulate
    // note that this is not a perfect fix - reload AppMain will attempt to recreate it
  }
  history.isBrowserBlockerApplied = true; // monkey patching
  let currentLocation = null;

  history.block((location, action) => {
    const nextLocation = location.pathname + location.search;

    if (action === 'PUSH') {
      if (currentLocation === nextLocation) {
        return false;
      }
    }

    currentLocation = nextLocation;
  });
}

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

  let history = useHistory();
  applyBrowserLocationBlocker(history);

  // React.useEffect(() => {
  //   // effects can't return promises - this will work because
  //   // fetchNews returns a promise that will be handled by
  //   // the pending async promises microtasrrk in V8
  //   moderationArticleContext.fetchNews();
  // }, []);

  return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
      <BackButton />
      <View style={styles.nav}>
        <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Home</Text>
        </Link>
        <Link to="/articles" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Public Feed</Text>
        </Link>
        <Link to="/moderation" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Queue</Text>
        </Link>
        {!loginStatus.accessToken ? (
          <Link to="/login/home" underlayColor="#f0f4f7" style={styles.navItem}>
            <Text>{`Login`}</Text>
          </Link>
        ) : (
          <Link to="/logout" underlayColor="#f0f4f7" style={styles.navItem}>
            <Text>{`Logout`}</Text>
          </Link>
        )}
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
        }}
      >
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image source={require('./assets/onlydognews-logo-main.png')} />
              </View>
            )}
          />
          <Route
            exact
            path="/moderation"
            render={() =>
              !!loginStatus.accessToken ? (
                <ArticleContext.Provider value={moderationArticleContext}>
                  <ArticleList />
                </ArticleContext.Provider>
              ) : (
                <View style={{ alignSelf: 'center', padding: 40 }}>
                  <Text style={{ marginBottom: 30}}>
                    In order to moderate submissions, you will need a registered
                    user. If you have one, please login
                  </Text>
                  <Link to="/login/home" underlayColor="#f0f4f7">
                    <Button title='Login' onPress={() => history.push('/login/home')}/>
                  </Link>
                </View>
              )
            }
          />

          <Route
            exact
            path="/articles"
            render={() => (
              <ArticleContext.Provider value={latestNewsArticleContext}>
                <ArticleList />
              </ArticleContext.Provider>
            )}
          />
          <Route path="/login/:provider/:from" component={LoginHome} />
          <Route path="/login/:provider" component={LoginHome} />
          <Route component={NoMatch} />
        </Switch>
      </View>
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
