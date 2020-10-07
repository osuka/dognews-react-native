/*
 * Copyright (c) 2019, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import { authorize, refresh, revoke } from 'react-native-app-auth'; // oauth2
import { Link } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import { login } from '../../services/directauth';
import { LoginState } from '../../models/login';
import authConfig from '../../../auth.config';

// ============ login storage (session and persistent)

export type LoginContextType = {
  loginStatus: LoginState;
  setLoginStatus: (s: LoginState) => void;
};
export const LoginContext = React.createContext<LoginContextType>({
  loginStatus: { username: '' },
  setLoginStatus: () => {},
});

export async function loadLoginFromStorage(): LoginState {
  try {
    const loginStatus = await AsyncStorage.getItem('@loginStatus');
    if (loginStatus !== null) {
      const asJson = JSON.parse(loginStatus);
      console.log('Login restored');
      return asJson as LoginState;
    }
  } catch (e) {
    // ignore
  }
}

export async function persistLoginStatus(loginStatus: LoginState) {
  try {
    await AsyncStorage.setItem('@loginStatus', JSON.stringify(loginStatus));
    console.log('Login status stored');
  } catch (e) {
    // ignore
    console.log('Error while saving login', e);
  }
}

// ============ auth components

// ============ we offer various types of login

export const LoginScreen = ({ navigation }) => {
  // ============= direct login

  const DirectLogin = () => {
    return (
      <LoginContext.Consumer>
        {({ loginStatus, setLoginStatus }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{
              backgroundColor: '#fffdf6',
              flex: 1,
            }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={{
                  padding: 24,
                  flex: 1,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Image
                  style={{ resizeMode: 'contain', height: '40%' }}
                  source={require('../../../assets/onlydognews-logo-main.png')}
                />
                <TextInput
                  style={{ borderWidth: 1, width: '80%' }}
                  placeholder="Login"
                  onChangeText={(text) => (loginStatus.username = text)}
                />
                <TextInput
                  style={{ borderWidth: 1, width: '80%' }}
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={(text) => (loginStatus.password = text)}
                />
                {!!loginStatus.error && <Text style={styles.error}>{loginStatus.error}</Text>}
                <View style={{ marginTop: 12 }}>
                  <Button
                    onPress={async () => {
                      loginStatus.progress = true;
                      setLoginStatus({ ...loginStatus, progress: true });
                      try {
                        setLoginStatus({
                          ...loginStatus,
                          progress: false,
                          error: '',
                        });
                        const token = await login(
                          authConfig.direct.baseUrl,
                          loginStatus.username,
                          loginStatus.password,
                        );
                        setLoginStatus({ ...loginStatus, accessToken: token });
                        navigation.goBack();
                      } catch (err) {
                        setLoginStatus({
                          ...loginStatus,
                          progress: false,
                          error: err.message,
                        });
                      }
                    }}
                    title="Login"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        )}
      </LoginContext.Consumer>
    );
  };

  // okta login

  const OktaLoginHelp = ({ navigation }) => (
    <View>
      <Text style={{ padding: 25, fontWeight: 'bold', fontSize: 24 }}>What is Okta?</Text>
      <Text style={{ paddingLeft: 50, paddingRight: 50 }}>
        You can register and login using third party providers of user management. Okta is one of
        them.
      </Text>
      <Text style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 20 }}>
        A third party Identity Provider store your personal details and helps us to ensure your data
        is protected.
      </Text>
      <Text style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 20 }}>
        You can use Okta as an identity provider in various applications, the same way you can
        register using Google or Facebook.
      </Text>
      <Text
        onPress={() => navigation.goBack()}
        style={{
          textDecorationLine: 'underline',
          paddingTop: 30,
          textAlign: 'center',
        }}>
        Go Back
      </Text>
    </View>
  );

  const config = {
    issuer: authConfig.oidc.discoveryUri,
    clientId: authConfig.oidc.clientId,
    redirectUrl: authConfig.oidc.redirectUri,
    scopes: authConfig.oidc.scopes,
  };

  const OktaLoginScreen = ({ navigation }) => {
    const initiateAuthorize = async (
      loginStatus: LoginState,
      setLoginStatus: (s: LoginState) => void,
    ) => {
      try {
        const authState = await authorize(config);
        setLoginStatus({
          ...loginStatus,
          error: '',
          progress: true,
          accessToken: authState.accessToken,
          accessTokenExpirationDate: authState.accessTokenExpirationDate,
          refreshToken: authState.refreshToken,
        });
      } catch (error) {
        // it will come back here in case of it not being able to load
        // or if the user closes the browser
        setLoginStatus({ username: loginStatus.username });
      }
    };

    const initiateRefresh = async (
      loginStatus: LoginState,
      setLoginStatus: (s: LoginState) => void,
    ) => {
      try {
        setLoginStatus({
          ...loginStatus,
          progress: true,
          error: '',
        });
        const authState = await refresh(config, {
          refreshToken: loginStatus.refreshToken,
        });
        setLoginStatus({
          ...loginStatus,
          error: '',
          progress: false,
          accessToken: authState.accessToken || loginStatus.accessToken,
          accessTokenExpirationDate:
            authState.accessTokenExpirationDate || loginStatus.accessTokenExpirationDate,
          refreshToken: authState.refreshToken || loginStatus.refreshToken,
        });
      } catch (error) {
        setLoginStatus({ username: loginStatus.username });
        console.error(error);
      }
    };

    const initiateRevoke = async (
      loginStatus: LoginState,
      setLoginStatus: (s: LoginState) => void,
    ) => {
      try {
        setLoginStatus({
          ...loginStatus,
          progress: true,
          error: '',
        });
        await revoke(config, {
          tokenToRevoke: loginStatus.refreshToken || loginStatus.accessToken,
        });
        setLoginStatus({
          ...loginStatus,
          error: '',
          progress: false,
          accessToken: '',
          accessTokenExpirationDate: '',
          refreshToken: '',
        });
      } catch (error) {
        setLoginStatus({ username: loginStatus.username });
        console.error(error);
      }
    };

    return (
      <LoginContext.Consumer>
        {({ loginStatus, setLoginStatus }) => (
          <View style={{ alignItems: 'center', flex: 1, flexDirection: 'column' }}>
            <Image source={require('../../../assets/onlydognews-logo-main.png')} />
            <View style={{ marginTop: 16 }}>
              <Button
                onPress={() => initiateAuthorize(loginStatus, setLoginStatus)}
                title="Login or register via Okta..."
                color="#017CC0"></Button>
            </View>
            <Text
              style={{
                marginTop: 20,
                paddingLeft: 30,
                paddingRight: 30,
                textAlign: 'center',
              }}>
              You can help moderate and rank articles on Only Dog News by registering as a user and
              requesting moderator access.
            </Text>
            <Link to="/OktaLoginHelp" style={{ paddingTop: 16 }}>
              <Text style={{ textDecorationLine: 'underline' }}>What is okta?</Text>
            </Link>
            <Link to="/DirectLogin" style={{ paddingTop: 16 }}>
              <Text style={{ textDecorationLine: 'underline' }}>Admin access</Text>
            </Link>
          </View>
        )}
      </LoginContext.Consumer>
    );
  };

  const Logout = () => (
    <LoginContext.Consumer>
      {({ setLoginStatus }) => (
        <Button title="Logout" onPress={() => setLoginStatus({ username: '' } as LoginState)} />
      )}
    </LoginContext.Consumer>
  );

  return (
    <LoginContext.Consumer>
      {
        ({ loginStatus }) => (!!loginStatus.accessToken ? <Logout /> : <DirectLogin />)
        // <Stack.Screen name="OktaLogin" component={OktaLoginScreen} />
        // <Stack.Screen
        //   name="DirectLogin"
        //   options={{ title: 'Login as administrator' }}
        //   component={DirectLoginScreen}
        // />
        // <Stack.Screen
        //   name="OktaLoginHelp"
        //   options={{ title: 'Authentication Help' }}
        //   component={OktaLoginHelp}
        // />
        // <Stack.Screen name="Logout" component={LogoutScreen} />
      }
    </LoginContext.Consumer>
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
  error: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AF0608',
    textAlign: 'center',
  },
});
