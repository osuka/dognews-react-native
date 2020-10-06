/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export interface Submission {
    readonly url?: string;
    target_url: string;
    title?: string;
    description?: string;
    readonly status?: string;
    readonly date_created?: string;
    readonly last_updated?: string;
    readonly fetched_page?: string;
    readonly fetched_date?: string;
    readonly owner?: string;
}
