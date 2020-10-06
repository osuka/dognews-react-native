/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModeratedSubmission } from '../models/ModeratedSubmission';
import type { Vote } from '../models/Vote';
import { request as __request } from '../core/request';

export class ModeratedsubmissionsService {

    /**
     * Accepted articles in moderation
     * @param limit Number of results to return per page.
     * @param offset The initial index from which to return the results.
     * @result any
     * @throws ApiError
     */
    public static async moderatedsubmissionsList(
        limit?: number,
        offset?: number,
    ): Promise<{
        count: number,
        next?: string,
        previous?: string,
        results: Array<ModeratedSubmission>,
    }> {
        const result = await __request({
            method: 'GET',
            path: `/moderatedsubmissions`,
            query: {
                'limit': limit,
                'offset': offset,
            },
        });
        return result.body;
    }

    /**
     * Accepted articles in moderation
     * @param data
     * @result ModeratedSubmission
     * @throws ApiError
     */
    public static async moderatedsubmissionsCreate(
        data: ModeratedSubmission,
    ): Promise<ModeratedSubmission> {
        const result = await __request({
            method: 'POST',
            path: `/moderatedsubmissions`,
            body: data,
        });
        return result.body;
    }

    /**
     * Accepted articles in moderation
     * @param id A unique integer value identifying this moderated submission.
     * @result ModeratedSubmission
     * @throws ApiError
     */
    public static async moderatedsubmissionsRead(
        id: number,
    ): Promise<ModeratedSubmission> {
        const result = await __request({
            method: 'GET',
            path: `/moderatedsubmissions/${id}`,
        });
        return result.body;
    }

    /**
     * Accepted articles in moderation
     * @param id A unique integer value identifying this moderated submission.
     * @param data
     * @result ModeratedSubmission
     * @throws ApiError
     */
    public static async moderatedsubmissionsUpdate(
        id: number,
        data: ModeratedSubmission,
    ): Promise<ModeratedSubmission> {
        const result = await __request({
            method: 'PUT',
            path: `/moderatedsubmissions/${id}`,
            body: data,
        });
        return result.body;
    }

    /**
     * Accepted articles in moderation
     * @param id A unique integer value identifying this moderated submission.
     * @param data
     * @result ModeratedSubmission
     * @throws ApiError
     */
    public static async moderatedsubmissionsPartialUpdate(
        id: number,
        data: ModeratedSubmission,
    ): Promise<ModeratedSubmission> {
        const result = await __request({
            method: 'PATCH',
            path: `/moderatedsubmissions/${id}`,
            body: data,
        });
        return result.body;
    }

    /**
     * Accepted articles in moderation
     * @param id A unique integer value identifying this moderated submission.
     * @result any
     * @throws ApiError
     */
    public static async moderatedsubmissionsDelete(
        id: number,
    ): Promise<any> {
        const result = await __request({
            method: 'DELETE',
            path: `/moderatedsubmissions/${id}`,
        });
        return result.body;
    }

    /**
     * Votes for a moderated submission - this is tied to its primary key
     * that must be passed as `moderatedsubmission_pk` kwarg
     * * multiple posts to the collection from same users will not create
     * multiple instances, instead subsequent posts will update their vote
     * @param moderatedSubmissionPk
     * @param limit Number of results to return per page.
     * @param offset The initial index from which to return the results.
     * @result any
     * @throws ApiError
     */
    public static async moderatedsubmissionsVotesList(
        moderatedSubmissionPk: string,
        limit?: number,
        offset?: number,
    ): Promise<{
        count: number,
        next?: string,
        previous?: string,
        results: Array<Vote>,
    }> {
        const result = await __request({
            method: 'GET',
            path: `/moderatedsubmissions/${moderatedSubmissionPk}/votes`,
            query: {
                'limit': limit,
                'offset': offset,
            },
        });
        return result.body;
    }

    /**
     * Votes for a moderated submission - this is tied to its primary key
     * that must be passed as `moderatedsubmission_pk` kwarg
     * * multiple posts to the collection from same users will not create
     * multiple instances, instead subsequent posts will update their vote
     * @param moderatedSubmissionPk
     * @param data
     * @result Vote
     * @throws ApiError
     */
    public static async moderatedsubmissionsVotesCreate(
        moderatedSubmissionPk: string,
        data: Vote,
    ): Promise<Vote> {
        const result = await __request({
            method: 'POST',
            path: `/moderatedsubmissions/${moderatedSubmissionPk}/votes`,
            body: data,
        });
        return result.body;
    }

}