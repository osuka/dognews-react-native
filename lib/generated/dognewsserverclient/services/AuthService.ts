/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * @result any
     * @throws ApiError
     */
    public static async authLoginCreate(): Promise<any> {
        const result = await __request({
            method: 'POST',
            path: `/auth/login`,
        });
        return result.body;
    }

}