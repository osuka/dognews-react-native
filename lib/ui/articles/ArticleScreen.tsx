import React from 'react';

import {
  ArticleContext,
  ArticleContextType,
  ArticleControl,
} from '../articles/ArticleControl';

import {ArticleList} from '../articles/ArticleList';
import {Item} from '../../models/items';
import {LoginContext} from '../auth/Login';

export default function ArticleScreen(): React.ReactElement {
  const [feedFetchingStatus, feedSetFetchingStatus] = React.useState<boolean>(
    false,
  );
  const [needsLoading, setNeedsLoading] = React.useState<boolean>(
    true, // starts fetching
  );
  const [feedItemList, feedSetItemList] = React.useState<Array<Item>>([]);

  const latestNewsArticleContext: ArticleContextType = {
    needsLoading: true,
    fetchingStatus: feedFetchingStatus,
    setFetchingStatus: feedSetFetchingStatus,
    itemList: feedItemList,
    setItemList: feedSetItemList,
    source: 'https://onlydognews.com/latest-news.json',
  };

  // fetch latest news, and do it again if login status changes

  const loginContext = React.useContext(LoginContext);

  React.useEffect(() => {
    if (needsLoading) {
      setNeedsLoading(false);
      ArticleControl.fetchNews(
        latestNewsArticleContext,
        loginContext.loginStatus,
      );
    }
  }, [needsLoading, latestNewsArticleContext, loginContext.loginStatus]);

  return (
    <ArticleContext.Provider value={latestNewsArticleContext}>
      <ArticleList />
    </ArticleContext.Provider>
  );
}
