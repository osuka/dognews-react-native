import React from 'react';
import { createContext, useContext } from 'react';

import { Item } from '../../models/items';
import { ItemService } from '../../services/items';
import { LoginState } from '../../models/login';
import { LoginContext } from '../auth/Login';
import AsyncStorage from '@react-native-community/async-storage';

const USER = 'osuka'; // TODO: retrieve user name from Login State

//

export type ArticleContextType = {
  itemList: Array<Item>;
  setItemList: (items: Array<Item>) => void;
  fetchingStatus: boolean;
  setFetchingStatus: (status: boolean) => void;

  source: string; // 'api' for moderation API call w/login, URL for static list
};

export const ArticleControl = {
  /**
   * Retrieves an updated list of news articles from external server
   */
  async fetchNews(ctx: ArticleContextType, loginStatus: LoginState) {
    if (ctx.fetchingStatus) {
      // poor man's critical section
      return;
    }

    try {
      ctx.setFetchingStatus(true);

      let responseJson;

      if (ctx.source === 'api') {
        responseJson = await ItemService.getAll(loginStatus);
      } else {
        responseJson = await fetch('https://onlydognews.com/latest-news.json');
        responseJson = await responseJson?.json();
      }

      if (!responseJson) {
        // TODO: do something with this information
        console.log('No articles');
        return;
      }

      const filteredNews = responseJson.filter(
        (item: Item) => item.sentiment !== 'bad',
      );

      // there are some differences between the feed and the API
      // the api returns 'url' as the URL of the item inside the API, ie http://10.0.2.2:8000/newsItem/4
      // we can use that as the id
      if (ctx.source === 'api') {
        filteredNews.forEach((item: Item) => {
          item.id = item.url;
          item.url = item['target_url'];
        });
      }

      // merge/add items
      const existingIds: Array<string> = ctx.itemList.map(
        (item: Item) => item.id,
      );

      const newList = filteredNews
        .filter((item: Item) => !existingIds.find((id) => item.id === id))
        .concat(ctx.itemList);

      ctx.setItemList(newList);
    } finally {
      ctx.setFetchingStatus(false);
    }
  },

  findItem(ctx: ArticleContextType, itemId: string): Item {
    return ctx.itemList?.find((value) => value.id === itemId);
  },

  getAllItems(ctx: ArticleContextType): Array<Item> {
    return ctx.itemList;
  },

  getItemUserRating(ctx: ArticleContextType, item: Item): number {
    return item?.ratings?.[USER]?.rating || 0;
  },

  rateItem(ctx: ArticleContextType, item: Item, value?: number) {
    item.ratings = item.ratings || {};
    item.ratings[USER] = {
      rating:
        typeof value === 'number'
          ? value
          : (ArticleControl.getItemUserRating(ctx, item) + 1) % 6,
      date: new Date().toUTCString(),
    };
    // force reload
    ctx.setItemList(ctx.itemList.slice());
  },

  removeItem(ctx: ArticleContextType, item: Item) {
    ctx.setItemList(
      [].concat(ctx.itemList.filter((value) => value.id !== item.id)),
    );
  },

  async restoreFromStorage(prefix: string, ctx: ArticleContextType) {
    try {
      const items = await AsyncStorage.getItem(`@${prefix}`);
      if (items !== null) {
        ctx.setItemList(JSON.parse(items));
        console.log(`${prefix} items restored`);
      }
    } catch (e) {
      // ignore
      console.log(`${prefix} Error while retrieving from local storage`, e);
    }
  },

  async persistToStorage(prefix: string, itemList: Array<Item>) {
    try {
      await AsyncStorage.setItem(`@${prefix}`, JSON.stringify(itemList));
      console.log(`${prefix} items saved`);
    } catch (e) {
      // ignore
      console.log(`${prefix} Error while saving to local storage`, e);
    }
  },

  async fetchFeedNews(ctx: ArticleContextType, loginStatus: LoginState) {
    if (ctx.fetchingStatus) {
      // poor man's critical section
      return;
    }

    try {
      ctx.setFetchingStatus(true);

      const response = await fetch('https://onlydognews.com/latest-news.json');

      if (response.status !== 200) {
        const json = await response.json();
        console.error(response.status, json);
        return;
      }

      const responseJson = await response.json(); // reads the body in full here

      // merge/add items
      const existingIds: Array<string> = ctx.itemList.map(
        (item: Item) => item.id,
      );

      const newList = responseJson
        .filter((item: Item) => !existingIds.find((id) => item.id === id))
        .concat(ctx.itemList);

      ctx.setItemList(newList);

      if (!responseJson) {
        // TODO: do something with this information
        console.log('No news');
        return;
      }
    } finally {
      ctx.setFetchingStatus(false);
    }
  },
};

//

export const ArticleContext = React.createContext<ArticleContextType>(
  undefined,
);
