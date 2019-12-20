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
} from 'react-native'

import { Route, Link, Switch, useHistory } from 'react-router-native'
import { authorize, refresh, revoke } from 'react-native-app-auth' // oauth2

import Spinner from 'react-native-loading-spinner-overlay'

import { login } from '../../services/directauth'
import authConfig from '../../../auth.config'
import { NavigationScreenProps } from 'react-navigation'

// ============ we offer various types of login

export const LoginHome = ({ match }) => {
  let [token, setToken] = useState('');
  let history = useHistory()
  return (
    <View style={{ flex: 1, flexDirection: 'column', alignItems: "center"}}>
      {token ? <Text>Logged in</Text> : (
      <Switch>
        <Route path="/login/direct/:from" component={LoginDirect} />
        <Route path="/login/okta/:from" component={LoginOkta} />
        <Route
          render={() => (
            <View style={{ flex: 1, flexDirection: 'column'}}>
              <View style={styles.button}>
                <Button
                  title="Login with Okta"
                  onPress={() =>
                    history.push(`/login/okta/${match.params.from}`)
                  }
                />
              </View>
              <View style={styles.button}>
                <Button
                  title="Login directly"
                  onPress={() =>
                    history.push(`/login/direct/${match.params.from}`)
                  }
                />
              </View>
              <Text style={{textAlign: "center"}} onPress={() => history.goBack()}>Back</Text>
            </View>
          )}
        />
      </Switch>
      )}
    </View>
  )
}

// ============= direct login

type State = {
  username: string
  password: string
  progress: boolean
  error: string
  accessToken?: string
  accessTokenExpirationDate?: string
  refreshToken?: string
}

function LoginDirect(props: NavigationScreenProps & {redirectTo: string}) {
  const [state, setState] = React.useState({
    username: '',
    password: '',
    progress: false,
    error: '',
  } as State);
  let history = useHistory();

  async function initiateLogin() {
    setState({ ...state, progress: true })
    try {
      setState({ ...state, progress: false, error: '' })
      const token = await login(
        authConfig.direct.baseUrl,
        state.username,
        state.password,
      )
      // const {navigate} = props.navigation;
      console.log(token);
      // TODO: save token
      history.push(props.redirectTo ? `/${props.redirectTo}` : '/');
      // navigate('Home', {token});
    } catch (err) {
      setState({ ...state, progress: false, error: err.message })
    }
  }

  return (
      <Fragment>
        <Spinner
          visible={state.progress}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Text style={styles.title}>Direct Sign-In</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Login"
              onChangeText={(text) => (state.username = text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(text) => (state.password = text)}
            />
            {!!state.error && (
              <Text style={styles.error}>{state.error}</Text>
            )}
            <View style={{ marginTop: 40, height: 40 }}>
              <Button
                testID="loginButton"
                onPress={async () => {
                  state.progress = true
                  await initiateLogin()
                }}
                title="Login"
              />
            </View>
          </View>
        </View>
      </Fragment>
    );
  };

// okta login

// ======================== login

const config = {
  issuer: authConfig.oidc.discoveryUri,
  clientId: authConfig.oidc.clientId,
  redirectUrl: authConfig.oidc.redirectUri,
  scopes: authConfig.oidc.scopes,
}

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

function LoginOkta(props) {
  let [state, setState] = useState({
      username: '',
      password: '',
      progress: false,
      error: '',
      accessToken: '',
      accessTokenExpirationDate: '',
      refreshToken: '',
    } as State);

  const animateState = (nextState: State, delay: number = 0) => {
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut()
      setState(nextState);
    }, delay)
  }

  const initiateAuthorize = async () => {
    try {
      const authState = await authorize(config);
      animateState(
        { ...state,
          error: '',
          progress: true,
          accessToken: authState.accessToken,
          accessTokenExpirationDate: authState.accessTokenExpirationDate,
          refreshToken: authState.refreshToken,
        },
        500,
      )
    } catch (error) {
      console.error(error)
    }
  }

  const initiateRefresh = async () => {
    try {
      animateState({
        ...state,
        progress: true,
        error: ''
      })
      const authState = await refresh(config, {
        refreshToken: state.refreshToken,
      })
      animateState({
        ...state,
        error: '',
        progress: false,
        accessToken: authState.accessToken || state.accessToken,
        accessTokenExpirationDate:
          authState.accessTokenExpirationDate || state.accessTokenExpirationDate,
        refreshToken: authState.refreshToken || state.refreshToken,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const initiateRevoke = async () => {
    try {
      animateState({
        ...state,
        progress: true,
        error: ''
      })
      await revoke(config, {
        tokenToRevoke: state.refreshToken || state.accessToken,
      })
      animateState({
        ...state,
        error: '',
        progress: false,
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: '',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ScrollView>
      {!!state.accessToken && (
        <Text>
          {'Access Token:'}
          {state.accessToken}
        </Text>
      )}
      {!!state.accessToken && (
        <Text>
          {'Expiration Date:'}
          {state.accessTokenExpirationDate}
        </Text>
      )}
      {!!state.accessToken && (
        <Text>
          {'Refresh Token:'}
          {state.refreshToken}
        </Text>
      )}
      {!state.accessToken && (
        <Button
          onPress={initiateAuthorize}
          title="Authorize"
          color="#017CC0"
        ></Button>
      )}
      {(!!state.accessToken || !!state.refreshToken) && (
        <Button onPress={initiateRefresh} title="Refresh" color="#24C2CB" />
      )}
      {!!state.accessToken && (
        <Button onPress={initiateRevoke} title="Revoke" color="#EF525B" />
      )}
    </ScrollView>
  );
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
