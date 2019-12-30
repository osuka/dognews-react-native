import authConfig from '../../auth.config';
import { LoginState } from '../models/login';

export const ItemService = {
  async getAll(loginStatus: LoginState) {
    if (!loginStatus?.accessToken) {
      return;
    }
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Token ${loginStatus.accessToken}`);

    try {
      let response = await fetch(`${authConfig.direct.baseUrl}/newsItem/`, {
        method: 'GET',
        headers,
      });
      if (response && response.ok) {
        const json = await response.json();
        // TODO: there's pagination in the API
        return json.results;
      } else {
        // TODO: notify error
        const json = await response.json();
        console.error(response.status, response.headers, json);
        return;
      }
    } catch (e) {
      // TODO: handle error
      console.error(`Error reading item data ${e}`);
      return;
    }
  },
};
