import * as React from 'react';

import { MainNavigator } from './navigation';
import { createAppContainer } from 'react-navigation';
import { ArticleProvider } from './lib/services/articles';

const AppContainer = createAppContainer(MainNavigator);

const App = () => {
  return (
    <ArticleProvider>
      <AppContainer />
    </ArticleProvider>
  );
}

export default App;
