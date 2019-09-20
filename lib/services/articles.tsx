import * as React from 'react'
import * as _ from 'lodash'

const USER = 'osuka' // TODO: some kind of login

// Article/News data structure types

export type NewsItemRating = {
  rating: number
  date: string
}

export type Item = {
  id: string // unique id (hash of url but could be something else in the future)
  url: string
  title: string
  description: string
  body: string
  summary: string
  ratings: any
  thumbnail: string
  image: string
  sentiment: string
}

// Storage retrieval types

class ArticleStorage {
  itemList: Array<Item> = []
  fetchingStatus: boolean = false
  // these setters need to be replaced with setters from useState
  setItemList: (itemList: Array<Item>) => void
  setFetchingStatus: (fetchingStatus: boolean) => void
}

// We use a react context to store and share the data
// more: https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react

export const ArticleContext = React.createContext<ArticleStorage>(
  new ArticleStorage(),
)

export const ArticleProvider = (props: { children: React.ReactNode }) => {
  const [itemList, setItemList] = React.useState<Array<Item>>([])
  const [fetchingStatus, setFetchingStatus] = React.useState(false)
  const articleStorage = {
    itemList,
    setItemList,
    fetchingStatus,
    setFetchingStatus,
  }
  return (
    <ArticleContext.Provider value={articleStorage}>
      {props.children}
    </ArticleContext.Provider>
  )
}

// An easier way to use this that to use the context all the time

export function ArticleControl(): {
  fetchNews: () => void
  articleStorage: ArticleStorage
  rateItem: (item: Item, value?: number) => void
  getItemUserRating: (item: Item) => number
} {
  const articleStorage = React.useContext(ArticleContext)

  // Adds an error an article object that contains error info
  function showError(title: string, body: string) {
    articleStorage.fetchingStatus = false
    const errorItem: Item = {
      id: 'error-id',
      url: 'error',
      title,
      body,
      ratings: {},
      description: '',
      summary: '',
      thumbnail: undefined,
      image: undefined,
      sentiment: undefined,
    }

    // add error (remove previous)
    articleStorage.setItemList(
      [].concat(
        articleStorage.itemList.filter((value) => value.id !== 'error-id'),
      ),
    )
  }

  /**
   * Retrieves an updated list of news articles from external server
   *
   * The list is stored inside 'articleStorage', exported from this module.
   */
  const fetchNews = async () => {
    if (articleStorage.fetchingStatus) {
      // poor man's critical section
      return
    }

    articleStorage.setFetchingStatus(true)

    try {
      const response = await fetch(
        'https://gatillos.com/onlydognews-assets/extracted-news-items.json',
      )

      if (response.status !== 200) {
        showError('Error loading', response.statusText)
        return
      }

      const responseJson = await response.json() // reads the body in full here

      const filteredNews = responseJson.filter(
        (item) => item.sentiment !== 'bad',
      )

      // merge/add items
      const existingIds: Array<string> = articleStorage.itemList.map(
        (item) => item.id,
      )
      const newList = filteredNews
        .filter((item) => !existingIds.find((id) => item.id === id))
        .concat(articleStorage.itemList)
      articleStorage.setItemList(newList)
      console.log('set', newList.length)
    } catch (e) {
      showError('Error reading item data', `${e}`)
    } finally {
      articleStorage.setFetchingStatus(false)
    }
  }

  const getItemUserRating = (item: Item): number => {
    return item && item.ratings && item.ratings[USER]
      ? item.ratings[USER].rating
      : 0
  }

  const rateItem = (item: Item, value?: number) => {
    item.ratings = item.ratings || {}
    item.ratings[USER] = {
      rating:
        typeof value === 'number' ? value : (getItemUserRating(item) + 1) % 6,
      date: new Date().toUTCString(),
    }
    // force reload TODO: ok?
    articleStorage.setItemList(articleStorage.itemList.slice())
  }

  return {
    fetchNews,
    articleStorage,
    rateItem,
    getItemUserRating,
  }
}
