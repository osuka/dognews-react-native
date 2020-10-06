/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export interface ModeratedSubmission {
    readonly url?: string;
    target_url?: string;
    title?: string;
    description?: string;
    readonly thumbnail?: string;
    readonly status?: 'new' | 'ready' | 'accepted' | 'rej_spam' | 'rej_dupe' | 'rej_votes' | 'rejected';
    readonly last_updated?: string;
    readonly date_created?: string;
    readonly bot_title?: string;
    readonly bot_description?: string;
    readonly bot_summary?: string;
    readonly bot_sentiment?: string;
    readonly bot_thumbnail?: string;
    readonly submission?: string;
    readonly last_modified_by?: string;
}
