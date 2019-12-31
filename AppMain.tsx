import * as React from 'react';
import { Text, View, StyleSheet, Image, Button } from 'react-native';
import {
  ArticleContext,
  ArticleContextType,
} from './lib/ui/articles/ArticleControl';
import { Item } from './lib/models/items';
import {
  Route,
  Link,
  Switch,
  History,
  useHistory,
  BackButton,
  Redirect,
} from 'react-router-native';
import {
  LoginHome,
  LoginContext,
  loadLoginFromStorage,
  persistLoginStatus
} from './lib/ui/auth/Login';
import { LoginState } from './lib/models/login';
import { ArticleList } from './lib/ui/articles/ArticleList';

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

  let history = useHistory();
  applyBrowserLocationBlocker(history);

  // start by trying to recover login status from local storage
  React.useEffect(() => {
    loadLoginFromStorage({ loginStatus, setLoginStatus });
  }, []);

  // if login status is modified, save it
  React.useEffect(() => {
    persistLoginStatus(loginStatus);
  }, [loginStatus]);

  return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
      <BackButton />
      <View style={styles.nav}>
        <Link
          to="/articles"
          underlayColor="#f0f4f7"
          style={styles.navItem}
          replace={true}
        >
          <Text
            style={
              history.location.pathname === '/articles'
                ? { textDecorationLine: 'underline' }
                : {}
            }
          >
            Public Feed
          </Text>
        </Link>
        <Link
          to="/moderation"
          underlayColor="#f0f4f7"
          style={styles.navItem}
          replace={true}
        >
          <Text
            style={
              history.location.pathname === '/moderation'
                ? { textDecorationLine: 'underline' }
                : {}
            }
          >
            Queue
          </Text>
        </Link>
        {loginStatus.accessToken && (
          <LoginContext.Consumer>
            {({ setLoginStatus }) => (
              <Button
                title="Logout"
                onPress={() => setLoginStatus({ username: '' } as LoginState)}
              />
            )}
          </LoginContext.Consumer>
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

          <Route exact path="/help/okta">
            <View>
              <Text style={{ padding: 25, fontWeight: 'bold', fontSize: 24 }}>
                What is Okta?
              </Text>
              <Text style={{ paddingLeft: 50, paddingRight: 50 }}>
                You can register and login using third party providers of user
                management. Okta is one of them.
              </Text>
              <Text
                style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 20 }}
              >
                A third party Identity Provider store your personal details and
                helps us to ensure your data is protected.
              </Text>
              <Text
                style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 20 }}
              >
                You can use Okta as an identity provider in various
                applications, the same way you can register using Google or
                Facebook.
              </Text>
              <Text
                onPress={() => history.goBack()}
                style={{
                  textDecorationLine: 'underline',
                  paddingTop: 30,
                  textAlign: 'center',
                }}
              >
                Go Back
              </Text>
            </View>
          </Route>

          <Route
            exact
            path="/moderation"
            render={() =>
              !!loginStatus.accessToken ? (
                <ArticleContext.Provider value={moderationArticleContext}>
                  <ArticleList />
                </ArticleContext.Provider>
              ) : (
                <Redirect to="/login/home/moderation" />
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
