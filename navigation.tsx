import React, { Component } from 'react';

import { Button, Text, ScrollView, View } from 'react-native';
import { UIManager, LayoutAnimation } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { ArticleListScreen } from './lib/ui/ArticleList';
import { ArticleWebViewScreen } from './lib/ui/ArticleWebView';
import { authorize, refresh, revoke } from 'react-native-app-auth'; // oauth2
import authConfig from './auth.config';
import { LoginScreenDirect } from './lib/ui/auth/LoginScreen';

// =====================

const HomeScreen = (props) => {
  return (
    <ScrollView>
      <Button
        title="Article Queue"
        onPress={() => props.navigation.navigate('Articles', {})}
      />
      <Button
        title="Login with Okta"
        onPress={() => props.navigation.navigate('LoginScreenOkta', {})}
      />
      <Button
        title="Login directly"
        onPress={() => props.navigation.navigate('LoginScreenDirect', {})}
      />
    </ScrollView>
  );
};
HomeScreen.navigationOptions = {
  title: 'Dog News Viewer'
};

// ======================== login


const config = {
  issuer: authConfig.oidc.discoveryUri,
  clientId: authConfig.oidc.clientId,
  redirectUrl: authConfig.oidc.redirectUri,
  scopes: authConfig.oidc.scopes,
};

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

type State = {
 hasLoggedInOnce?: boolean,
 accessToken: String,
 accessTokenExpirationDate: String,
 refreshToken: String
};

export class LoginScreenOkta extends Component<{}, State> {

 state = {
   hasLoggedInOnce: false,
   accessToken: '',
   accessTokenExpirationDate: '',
   refreshToken: ''
 };

 animateState(nextState: State, delay: number = 0) {
   setTimeout(() => {
     this.setState(() => {
       LayoutAnimation.easeInEaseOut();
       return nextState;
     });
   }, delay);
 }

 authorize = async () => {
   try {
     const authState = await authorize(config);
     this.animateState(
       {
         hasLoggedInOnce: true,
         accessToken: authState.accessToken,
         accessTokenExpirationDate: authState.accessTokenExpirationDate,
         refreshToken: authState.refreshToken
       },
       500
     );
   } catch (error) {
     console.error(error);
   }
 };

 refresh = async () => {
   try {
     const authState = await refresh(config, {
       refreshToken: this.state.refreshToken
     });
     this.animateState({
       accessToken: authState.accessToken || this.state.accessToken,
       accessTokenExpirationDate:
       authState.accessTokenExpirationDate || this.state.accessTokenExpirationDate,
       refreshToken: authState.refreshToken || this.state.refreshToken
     });
   } catch (error) {
     console.error(error);
   }
 };

 revoke = async () => {
   try {
     await revoke(config, {
       tokenToRevoke: this.state.refreshToken || this.state.accessToken
     });
     this.animateState({
       accessToken: '',
       accessTokenExpirationDate: '',
       refreshToken: ''
     });
   } catch (error) {
     console.error(error);
   }
 };

 render() {
   const {state} = this;
   return (
      <ScrollView>
          <Text>{!state.accessToken ? (state.hasLoggedInOnce ? 'Goodbye.' : 'Hello, stranger.') : 'Logged in'}</Text>
          {!!state.accessToken && <Text>{'Access Token:'}{state.accessToken}</Text>}
          {!!state.accessToken && <Text>{'Expiration Date:'}{state.accessTokenExpirationDate}</Text>}
          {!!state.accessToken && <Text>{'Refresh Token:'}{state.refreshToken}</Text>}
          {!state.accessToken && <Button onPress={this.authorize} title="Authorize" color="#017CC0"></Button>}
          {(!!state.accessToken || !!state.refreshToken) && <Button onPress={this.refresh} title="Refresh" color="#24C2CB"/>}
          {!!state.accessToken && <Button onPress={this.revoke} title="Revoke" color="#EF525B"/>}
     </ScrollView>
   );
 }
}

export const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Articles: { screen: ArticleListScreen },
  ArticleWebView: { screen: ArticleWebViewScreen },
  LoginScreenOkta: { screen: LoginScreenOkta },
  LoginScreenDirect: { screen: LoginScreenDirect },
});
