// import 'react-native-url-polyfill/auto'; // see NOTES.md, prevents error URL.get Not Implemented
import { ArticlesApi, Configuration } from '../generated/api_client';
import { AxiosRequestConfig } from 'axios';
import axios from 'axios';

// Check https://github.com/axios/axios#request-config
const axiosConfig: AxiosRequestConfig = {
  timeout: 2000, // two seconds
  headers: { 'X-Originating-Client': 'dognews-react-native' },
};
// url?: string;
// method?: Method;
// baseURL?: string;
// transformRequest?: AxiosTransformer | AxiosTransformer[];
// transformResponse?: AxiosTransformer | AxiosTransformer[];
// headers?: any;
// params?: any;
// paramsSerializer?: (params: any) => string;
// data?: any;
// timeout?: number;
// timeoutErrorMessage?: string;
// withCredentials?: boolean;
// adapter?: AxiosAdapter;
// auth?: AxiosBasicCredentials;
// responseType?: ResponseType;
// xsrfCookieName?: string;
// xsrfHeaderName?: string;
// onUploadProgress?: (progressEvent: any) => void;
// onDownloadProgress?: (progressEvent: any) => void;
// maxContentLength?: number;
// validateStatus?: ((status: number) => boolean) | null;
// maxBodyLength?: number;
// maxRedirects?: number;
// socketPath?: string | null;
// httpAgent?: any;
// httpsAgent?: any;
// proxy?: AxiosProxyConfig | false;
// cancelToken?: CancelToken;
// decompress?: boolean;

const config = new Configuration({
  basePath: 'https://dognewsserver.gatillos.com',
  baseOptions: axiosConfig,
});

export const articlesApi = new ArticlesApi(config);
