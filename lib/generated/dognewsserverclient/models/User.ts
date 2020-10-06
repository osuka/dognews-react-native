/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export interface User {
    readonly url?: string;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     */
    username: string;
    email?: string;
    /**
     * The groups this user belongs to. A user will get all permissions granted to each of their groups.
     */
    groups?: Array<number>;
}
