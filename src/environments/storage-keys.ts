/*
* List of state keys which should be stored (unencrypted!) in local storage.
*
* Again: THIS DATA IS STORED UNENCRYPTED!!! Think twice if a piece of state information really belongs here.
*
* Maybe it should be handled by a handler and stored encrypted?
*/
export const STORAGE_KEYS: (string | IStorageKey)[] = [
    // App state
    'app.language',
    'user.access_token',
    'user.jwtDecoded',
];
