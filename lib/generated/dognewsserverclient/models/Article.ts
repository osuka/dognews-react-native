/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export interface Article {
    readonly url?: string;
    readonly status?: 'visible' | 'hidden';
    readonly target_url?: string;
    readonly title?: string;
    readonly description?: string;
    readonly thumbnail?: string;
    readonly last_updated?: string;
    readonly date_created?: string;
    readonly submitter?: string;
    readonly moderated_submission?: string;
    readonly approver?: string;
}
