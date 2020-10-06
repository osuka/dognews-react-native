/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Vote } from '../models/Vote';
import { request as __request } from '../core/request';

export class VotesService {

    /**
     * Votes detail and delete. We allow a subset of functionality, the rest must go
     * through /moderatedsubmission/<pk>/votes
     * @param id A unique integer value identifying this vote.
     * @result Vote
     * @throws ApiError
     */
    public static async votesRead(
        id: number,
    ): Promise<Vote> {
        const result = await __request({
            method: 'GET',
            path: `/votes/${id}`,
        });
        return result.body;
    }

    /**
     * Votes detail and delete. We allow a subset of functionality, the rest must go
     * through /moderatedsubmission/<pk>/votes
     * @param id A unique integer value identifying this vote.
     * @result any
     * @throws ApiError
     */
    public static async votesDelete(
        id: number,
    ): Promise<any> {
        const result = await __request({
            method: 'DELETE',
            path: `/votes/${id}`,
        });
        return result.body;
    }

}