/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
interface Config {
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    TOKEN: string;
}

export const OpenAPI: Config = {
    BASE: 'https://dognewsserver.gatillos.com/',
    VERSION: '1',
    WITH_CREDENTIALS: false,
    TOKEN: '',
};