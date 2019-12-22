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

import React, { Fragment, Component, useState } from 'react'
import {
  SafeAreaView,
  Button,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  ScrollView,
  UIManager,
  LayoutAnimation,
  TouchableHighlight
} from 'react-native'

import { Route, useHistory } from 'react-router-native'
import { authorize, refresh, revoke } from 'react-native-app-auth' // oauth2

import Spinner from 'react-native-loading-spinner-overlay'

import { login } from '../../services/directauth'
import { LoginState } from '../../models/login'
import authConfig from '../../../auth.config'
import { NavigationScreenProps } from 'react-navigation'
import { State } from 'react-native-gesture-handler'

// ============ TODO: login storage (?LocalStorage?)

export type LoginContextType = {
  loginStatus: LoginState
  setLoginStatus: (s: LoginState) => void
}
export const LoginContext = React.createContext<LoginContextType>({ loginStatus: { username: ''}, setLoginStatus: () => {}});

// ============ auth components

// ============ we offer various types of login

export const LoginHome = ({ match }) => {
  let history = useHistory()

  let redirectTo = match.params.from;

  return (
    <LoginContext.Consumer>
      {({loginStatus, setLoginStatus}) => (
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
          {loginStatus.accessToken ? (
            <Text>Logged in</Text>
          ) : (
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={styles.button}>
                <LoginOkta loginStatus={loginStatus} setLoginStatus={setLoginStatus}/>
              </View>
              <Route path="/login/home">
                <Button
                  title="Login directly"
                  onPress={() => history.push('/login/direct')}
                />
              </Route>
              <Route path="/login/direct">
                <LoginDirect loginStatus={loginStatus} setLoginStatus={(s: LoginState) => setLoginStatus(s)}/>
              </Route>
              <View style={styles.button}>
                <Button title="Cancel" onPress={() => history.goBack()}/>
              </View>
            </View>
          )}
        </View>
      )}
    </LoginContext.Consumer>
  )
}

// ============= direct login

function LoginDirect(props: { loginStatus: LoginState, setLoginStatus: (s: LoginState) => void}) {
  const {loginStatus, setLoginStatus} = props;
  let history = useHistory();

  async function initiateLogin() {
    setLoginStatus({ ...loginStatus, progress: true })
    try {
      setLoginStatus({ ...loginStatus, progress: false, error: '' })
      const token = await login(
        authConfig.direct.baseUrl,
        loginStatus.username,
        loginStatus.password,
      )
      setLoginStatus({ ...loginStatus, accessToken: token});
      history.goBack();
    } catch (err) {
      setLoginStatus({ ...loginStatus, progress: false, error: err.message })
    }
  }

  return (
    <View style={{backgroundColor: '#fffdf6', padding: 12}}>
      <Text style={{alignSelf:"center"}}>Direct Login</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Login"
        onChangeText={(text) => (loginStatus.username = text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => (loginStatus.password = text)}
      />
      {!!loginStatus.error && <Text style={styles.error}>{loginStatus.error}</Text>}
      <View style={{marginTop: 12}}>
        <Button
          onPress={async () => {
            loginStatus.progress = true
            await initiateLogin()
          }}
          title="Login"
        />
      </View>
    </View>
  );
}

// okta login

// ======================== login

const config = {
  issuer: authConfig.oidc.discoveryUri,
  clientId: authConfig.oidc.clientId,
  redirectUrl: authConfig.oidc.redirectUri,
  scopes: authConfig.oidc.scopes,
}

function LoginOkta(props: { loginStatus: LoginState, setLoginStatus: (s: LoginState) => void}) {
  const {loginStatus, setLoginStatus} = props;

  const initiateAuthorize = async () => {
    try {
      const authState = await authorize(config)
      setLoginStatus(
        {
          ...loginStatus,
          error: '',
          progress: true,
          accessToken: authState.accessToken,
          accessTokenExpirationDate: authState.accessTokenExpirationDate,
          refreshToken: authState.refreshToken,
        }
      );
    } catch (error) {
      // it will come back here in case of it not being able to load
      // or if the user closes the browser
      setLoginStatus({ username: loginStatus.username });
    }
  }

  const initiateRefresh = async () => {
    try {
      setLoginStatus({
        ...loginStatus,
        progress: true,
        error: '',
      })
      const authState = await refresh(config, {
        refreshToken: loginStatus.refreshToken,
      })
      setLoginStatus({
        ...loginStatus,
        error: '',
        progress: false,
        accessToken: authState.accessToken || loginStatus.accessToken,
        accessTokenExpirationDate:
          authState.accessTokenExpirationDate ||
          loginStatus.accessTokenExpirationDate,
        refreshToken: authState.refreshToken || loginStatus.refreshToken,
      })
    } catch (error) {
      setLoginStatus({ username: loginStatus.username });
      console.error(error)
    }
  }

  const initiateRevoke = async () => {
    try {
      setLoginStatus({
        ...loginStatus,
        progress: true,
        error: '',
      })
      await revoke(config, {
        tokenToRevoke: loginStatus.refreshToken || loginStatus.accessToken,
      })
      setLoginStatus({
        ...loginStatus,
        error: '',
        progress: false,
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: '',
      })
    } catch (error) {
      setLoginStatus({ username: loginStatus.username });
      console.error(error)
    }
  }

  return (
    <Button
      onPress={initiateAuthorize}
      title="Login with Okta"
      color="#017CC0"
    ></Button>
  )
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
  textInput: {
    marginTop: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    borderRadius: 40,
    width: 200,
    height: 40,
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0066cc',
    paddingTop: 5,
    textAlign: 'center',
  },
  error: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AF0608',
    textAlign: 'center',
  },
})
