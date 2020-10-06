/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TokenObtainPair } from '../models/TokenObtainPair';
import type { TokenRefresh } from '../models/TokenRefresh';
import type { TokenVerify } from '../models/TokenVerify';
import { request as __request } from '../core/request';

export class ApiService {

    /**
     * Takes a set of user credentials and returns an access and refresh JSON web
     * token pair to prove the authentication of those credentials.
     * @param data
     * @result TokenObtainPair
     * @throws ApiError
     */
    public static async apiTokenCreate(
        data: TokenObtainPair,
    ): Promise<TokenObtainPair> {
        const result = await __request({
            method: 'POST',
            path: `/api/token/`,
            body: data,
        });
        return result.body;
    }

    /**
     * Takes a refresh type JSON web token and returns an access type JSON web
     * token if the refresh token is valid.
     * @param data
     * @result TokenRefresh
     * @throws ApiError
     */
    public static async apiTokenRefreshCreate(
        data: TokenRefresh,
    ): Promise<TokenRefresh> {
        const result = await __request({
            method: 'POST',
            path: `/api/token/refresh/`,
            body: data,
        });
        return result.body;
    }

    /**
     * Takes a token and indicates if it is valid.  This view provides no
     * information about a token's fitness for a particular use.
     * @param data
     * @result TokenVerify
     * @throws ApiError
     */
    public static async apiTokenVerifyCreate(
        data: TokenVerify,
    ): Promise<TokenVerify> {
        const result = await __request({
            method: 'POST',
            path: `/api/token/verify/`,
            body: data,
        });
        return result.body;
    }

}