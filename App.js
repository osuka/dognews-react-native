import React from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { AppMain } from './AppMain'

// This file exists just because I wasn't able to make
// react-native pick a tsx file as the main App (!)
const App = () => {
  return (
    <NavigationContainer>
      <AppMain/>
    </NavigationContainer>
  )
}

export default App
