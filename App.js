import React from 'react'
import { NativeRouter } from 'react-router-native'
import { AppMain } from './AppMain'

// This file exists just because I wasn't able to make
// react-native pick a tsx file as the main App (!)
const App = () => {
  return (
    <NativeRouter>
      <AppMain/>
    </NativeRouter>
  )
}

export default App
