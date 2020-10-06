/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export interface Vote {
    readonly url?: string;
    value?: 1 | -1 | -100;
    readonly last_updated?: string;
    readonly date_created?: string;
    readonly moderated_submission?: string;
    readonly owner?: string;
}
