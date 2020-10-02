/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// import {SafeAreaView, StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {
  LoginScreen,
  LoginContext,
  loadLoginFromStorage,
  persistLoginStatus,
} from './lib/ui/auth/Login';

import {LoginState} from './lib/models/login';

import HomeScreen from './lib/ui/home/HomeScreen';
import ArticleScreen from './lib/ui/articles/ArticleScreen';
import ModerationScreen from './lib/ui/moderation/ModerationScreen';

declare const global: {HermesInternal: null | {}};

// import 'react-native-gesture-handler'

const Stack = createStackNavigator();

function App() {
  const [loginStatus, setLoginStatus] = React.useState(loadLoginFromStorage() as LoginState);

  // let history = useHistory();
  // applyBrowserLocationBlocker(history);

  // if login status is modified, save it
  React.useEffect(() => {
    (async () => await persistLoginStatus(loginStatus))();
  }, [loginStatus]);

  return (
    <NavigationContainer>
      <LoginContext.Provider value={{loginStatus, setLoginStatus}}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Articles" component={ArticleScreen} />
          <Stack.Screen name="Moderation" component={ModerationScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </LoginContext.Provider>
    </NavigationContainer>
  );
}
/*const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Juanito Edit <Text style={styles.highlight}>App.tsx</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
*/
export default App;
