export interface LoginProfileInformation {
    email: string;
    password: string;
    realm: string;
}

export interface AuthTokens {
    expiresAt: number;
    refreshToken: string;
    accessToken: string;
}

export interface AuthSavedInformation {
    profileInformation: LoginProfileInformation;
    tokens: AuthTokens;
}

export interface KeycloakTokensResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
    id_token: string;
    token_type: string;
}
