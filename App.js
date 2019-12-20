import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { ArticleProvider } from './lib/services/articles'
import {
  NativeRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-native'
import { LoginHome } from './lib/ui/auth/LoginScreen'
import { ArticleList } from './lib/ui/articles/ArticleList'
import { ArticleWebView } from './lib/ui/articles/ArticleWebView'

function NoMatch({ location }) {
  return <Text style={styles.header}>No match for {location.pathname}</Text>
}

const App = () => {
  return (
    <ArticleProvider>
      <Router>
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
            <Text>{`Login ${new Date()}`}</Text>
          </Link>
        </View>

        <View style={{flex:1, flexDirection:"column"}}>
          <Switch>
            <Route
              path="/"
              exact
              render={() => <Text>Dog News Management (WIP)</Text>}
            />
            <Route exact path="/articles" component={ArticleList} />
            {/* <Route path="/articles/:id" component={ArticleWebView} /> */}
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
})

export default App
