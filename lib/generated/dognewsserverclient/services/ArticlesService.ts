/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Article } from '../models/Article';
import { request as __request } from '../core/request';

export class ArticlesService {

    /**
     * Final accepted articles, read only view.
     * *Public*
     * @param limit Number of results to return per page.
     * @param offset The initial index from which to return the results.
     * @result any
     * @throws ApiError
     */
    public static async articlesList(
        limit?: number,
        offset?: number,
    ): Promise<{
        count: number,
        next?: string,
        previous?: string,
        results: Array<Article>,
    }> {
        const result = await __request({
            method: 'GET',
            path: `/articles`,
            query: {
                'limit': limit,
                'offset': offset,
            },
        });
        return result.body;
    }

    /**
     * Final accepted articles, read only view.
     * *Public*
     * @param id A unique integer value identifying this article.
     * @result Article
     * @throws ApiError
     */
    public static async articlesRead(
        id: number,
    ): Promise<Article> {
        const result = await __request({
            method: 'GET',
            path: `/articles/${id}`,
        });
        return result.body;
    }

}