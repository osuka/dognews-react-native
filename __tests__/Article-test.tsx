/**
 * @format
 */

import 'react-native';
import React from 'react';
import { Article } from '../lib/ui/articles/Article';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {
  ArticleContextType,
  ArticleContext,
} from '../lib/ui/articles/ArticleControl';

beforeEach(() => {
  jest.resetModules();
});

it('renders correctly', () => {
  renderer.create(
    <ArticleContext.Provider
      value={{
        itemList: [],
        setItemList: jest.fn(),
        fetchingStatus: false,
        setFetchingStatus: jest.fn(),
        source: 'api'
      }}
    >
      <Article
        item={{
          id: 'myuniqueid',
          url: 'https://duckduckgo.com',
          description: 'some text',
          title: 'The Title',
          body: 'Long winded description',
          summary: 'the long summary from the article automatically generated',
          thumbnail:
            'https://onlydognews.com/gfx/site/onlydognews-logo-main.png',
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
