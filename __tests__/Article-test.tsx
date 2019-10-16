/**
 * @format
 */

import 'react-native'
import React from 'react'
import { NewsItem } from '../lib/components/Article'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  renderer.create(
    <NewsItem
      item={{
        id: 'myuniqueid',
        url: 'https://duckduckgo.com',
        description: 'some text',
        title: 'The Title',
        body: 'Long winded description',
        summary: 'the long summary from the article automatically generated',
        thumbnail: 'https://duckduckgo.com/',
        image: 'https://duckduckgo.com/',
        sentiment: 'good',
        ratings: [{ date: '', user: 'test', rating: 1 }],
      }}
      positionInList={0}
      totalItems={0}
      onArticleClick={() => true}
    />
  )
});
