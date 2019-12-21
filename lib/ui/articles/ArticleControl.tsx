import { createContext, useContext } from 'react'

import { Item, NewsItemRating } from '../../models/items'

const USER = 'osuka' // TODO: retrieve user name from Login State

// UI State: since the list is of limited length, we keep
// a copy in memory

class ArticleStorage {
  itemList: Array<Item> = []
  fetchingStatus: boolean = false
  // these setters need to be replaced with setters from useState
  setItemList: (itemList: Array<Item>) => void
  setFetchingStatus: (fetchingStatus: boolean) => void
}

// We use a react context to store and share the data

export const ArticleContext = createContext<ArticleStorage>(
  new ArticleStorage()
)

// An easier way to use this that to use the context all the time

export function ArticleControl(): {
  fetchNews: () => void
  articleStorage: ArticleStorage
  rateItem: (item: Item, value?: number) => void
  getItemUserRating: (item: Item) => number
  removeItem: (item: Item) => void
} {
  const articleStorage = useContext(ArticleContext);

  // Adds an error an article object that contains error info
  function showError(title: string, body: string) {
    articleStorage.fetchingStatus = false;
    console.log(`Error: ${title}\n${body}`);
  }

  /**
   * Retrieves an updated list of news articles from external server
   *
   * The list is stored inside 'articleStorage', exported from this module.
   */
  const fetchNews = async () => {
    if (articleStorage.fetchingStatus) {
      // poor man's critical section
      return;
    }

    articleStorage.setFetchingStatus(true);

    try {
      const response = await fetch(
        'https://gatillos.com/onlydognews-assets/extracted-news-items.json',
      );

      if (response.status !== 200) {
        showError('Error loading', response.statusText);
        return;
      }

      const responseJson = await response.json(); // reads the body in full here

      const filteredNews = responseJson.filter(
        (item: Item) => item.sentiment !== 'bad',
      );

      // merge/add items
      const existingIds: Array<string> = articleStorage.itemList.map(
        (item: Item) => item.id,
      );

      const newList = filteredNews
        .filter((item: Item) => !existingIds.find((id) => item.id === id))
        .concat(articleStorage.itemList);

      articleStorage.setItemList(newList);
    } catch (e) {
      showError('Error reading item data', `${e}`);
    } finally {
      articleStorage.setFetchingStatus(false);
    }
  }

  const getItemUserRating = (item: Item): number => {
    return item?.ratings?.[USER]?.rating || 0;
  }

  const rateItem = (item: Item, value?: number) => {
    item.ratings = item.ratings || {};
    item.ratings[USER] = {
      rating:
        typeof value === 'number' ? value : (getItemUserRating(item) + 1) % 6,
      date: new Date().toUTCString(),
    };
    // force reload
    articleStorage.setItemList(articleStorage.itemList.slice());
  }

  const removeItem = (item: Item, value?: number) => {
    articleStorage.setItemList(
      [].concat(
        articleStorage.itemList.filter((value) => value.id !== item.id),
      ),
    );
  }

  return {
    fetchNews,
    articleStorage,
    rateItem,
    getItemUserRating,
    removeItem,
  }
}
