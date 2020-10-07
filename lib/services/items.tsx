// import authConfig from '../../auth.config';
import { LoginState } from '../models/login';
import { Item } from '../models/items';
import { ArticlesService } from '../generated/dognewsserverclient';

export const ItemService = {
  async getAll(loginStatus: LoginState) {
    if (!loginStatus?.accessToken) {
      return;
    }
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Token ${loginStatus.accessToken}`);

    const response = await ArticlesService.articlesList();
    const articles = response.results;

    // move from backend model to our app model
    const items: Array<Item> = [];
    for (let index = 0; index < articles.length; index++) {
      // type autocomplete didn't work when using for(let x in articles) :(
      const art = articles[index];
      items.push({
        id: art.url || 'missing_id',
        url: art.target_url || 'https://onlydognews.com/gfx/site/onlydognews-logo-main.png',
        title: art.title || 'Untitled',
        description: art.description,
        body: '',
        summary: '',
        ratings: [],
        thumbnail: art.thumbnail,
        image: art.thumbnail,
        sentiment: art.status,
      });
    }

    return articles;

    // try {
    //   let response = await fetch(`${authConfig.direct.baseUrl}/newsItem/`, {
    //     method: 'GET',
    //     headers,
    //   });
    //   if (response && response.ok) {
    //     const json = await response.json();
    //     // TODO: there's pagination in the API
    //     return json.results;
    //   } else {
    //     // TODO: notify error
    //     const json = await response.json();
    //     console.error(response.status, response.headers, json);
    //     return;
    //   }
    // } catch (e) {
    //   // TODO: handle error
    //   console.error(`Error reading item data ${e}`);
    //   return;
    // }
  },
};
