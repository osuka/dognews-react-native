import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { ArticleContext } from './lib/ui/articles/ArticleControl';
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

export const ArticleProvider = (props: { children: React.ReactNode }) => {
  const [itemList, setItemList] = React.useState<Array<Item>>([]);
  const [fetchingStatus, setFetchingStatus] = React.useState(false);
  const articleStorage = {
    itemList,
    setItemList,
    fetchingStatus,
    setFetchingStatus,
  };
  return (
    <ArticleContext.Provider value={articleStorage}>
      {props.children}
    </ArticleContext.Provider>
  );
};

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
  let [loginStatus, setLoginStatus] = React.useState({
    username: '',
  } as LoginState);
  applyBrowserLocationBlocker(useHistory());
  return (
    <ArticleProvider>
      <LoginContext.Provider
        value={{ loginStatus, setLoginStatus } as LoginContextType}
      >
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
            <Link
              to="/login/home"
              underlayColor="#f0f4f7"
              style={styles.navItem}
            >
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
                  <Image
                    source={require('./assets/onlydognews-logo-main.png')}
                  />
                </View>
              )}
            />
            <Route exact path="/moderation" component={ArticleList} />
            <Route exact path="/articles" render={() => <Text>Soon!</Text>}></Route>
            <Route path="/login/:provider/:from" component={LoginHome} />
            <Route path="/login/:provider" component={LoginHome} />
            <Route component={NoMatch} />
          </Switch>
        </View>
      </LoginContext.Provider>
    </ArticleProvider>
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
