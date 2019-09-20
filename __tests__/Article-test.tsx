/**
 * @format
 */

import 'react-native'
import React from 'react'
import { NewsItem, NewsItemRating } from '../lib/components/Article'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  renderer.create(
    <NewsItem
      item={{
        url: 'https://google.com',
        description: 'some text',
        title: 'The Title',
        body: 'Long winded description',
        ratings: [{ date: '', user: 'test', rating: 1 }],
      }}
      positionInList={0}
      totalItems={0}
    />,
  )
})
