export interface IAttributeRequestCredentials {
    key: string;
    required: boolean;
    expectedValue: string;
    provider: string[];
}

export interface ISettings {
    language: string;
    action: string;
    trustedAuthorities: string[];
}
