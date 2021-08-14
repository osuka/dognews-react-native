/**
 * @format
 */

jest.mock('../lib/ui/auth/Login'); // TODO: proper

import 'react-native';
import { render } from '@testing-library/react-native'; // https://callstack.github.io/react-native-testing-library/docs/getting-started/
import React from 'react';
import { Article } from '../lib/ui/articles/Article';

import { ArticleContext } from '../lib/ui/articles/ArticleControl';

beforeEach(() => {
  jest.resetModules();
});

it('renders correctly', () => {
  render(
    <ArticleContext.Provider
      value={{
        itemList: [],
        setItemList: jest.fn(),
        fetchingStatus: false,
        setFetchingStatus: jest.fn(),
        source: 'api',
        needsLoading: false,
      }}>
      <Article
        item={{
          id: 'myuniqueid',
          url: 'https://duckduckgo.com',
          description: 'some text',
          title: 'The Title',
          body: 'Long winded description',
          summary: 'the long summary from the article automatically generated',
          thumbnail: 'https://onlydognews.com/gfx/site/onlydognews-logo-main.png',
          image: 'https://onlydognews.com/gfx/site/onlydognews-logo-main.png',
          sentiment: 'good',
          ratings: [{ date: '', user: 'test', rating: 1 }],
        }}
        positionInList={0}
        totalItems={0}
        onArticleClick={() => true}
      />
    </ArticleContext.Provider>,
  );
});
