import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { ArticleContext } from './lib/ui/articles/ArticleControl';
import { Item } from './lib/models/items';
import {
  NativeRouter as Router,
  Route,
  Link,
  Switch,
  BackButton,
} from 'react-router-native'
import { LoginHome } from './lib/ui/auth/LoginScreen'
import { ArticleList } from './lib/ui/articles/ArticleList'

export const ArticleProvider = (props: { children: React.ReactNode }) => {
  const [itemList, setItemList] = React.useState<Array<Item>>([])
  const [fetchingStatus, setFetchingStatus] = React.useState(false)
  const articleStorage = {
    itemList,
    setItemList,
    fetchingStatus,
    setFetchingStatus,
  }
  return (
    <ArticleContext.Provider value={articleStorage}>
      {props.children}
    </ArticleContext.Provider>
  );
};

function NoMatch({ location }) {
  return <Text style={styles.header}>No match for {location.pathname}</Text>
}

export const AppMain = () => {
  return (
    <ArticleProvider>
      <Router>
        <BackButton/>
        <View style={styles.nav}>
          <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
            <Text>Home</Text>
          </Link>
          <Link
            to="/articles"
            underlayColor="#f0f4f7"
            style={styles.navItem}
          >
            <Text>Article Queue</Text>
          </Link>
          <Link
            to="/login/home"
            underlayColor="#f0f4f7"
            style={styles.navItem}
          >
            <Text>{`Login`}</Text>
          </Link>
        </View>

        <View style={{flex:1, flexDirection:"column", justifyContent:"center", backgroundColor:'#f0f0f0'}}>
          <Switch>
            <Route
              path="/"
              exact
              render={() => (
                <View style={{flex:1, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                  <Image source={require('./assets/onlydognews-logo-main.png')}/>
                </View>
              )}
            />
            <Route exact path="/articles" component={ArticleList} />
            <Route path="/login/:provider/:from" component={LoginHome} />
            <Route path="/login/:provider" component={LoginHome} />
            <Route component={NoMatch} />
          </Switch>
        </View>
      </Router>
    </ArticleProvider>
  )
}

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
  }
});