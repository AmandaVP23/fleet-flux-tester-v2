import { KEYCLOAK_URL } from '../settings';
import { TokenStore } from './tokenStore';
import type { KeycloakTokensResponse, LoginProfileInformation } from './types';

export class KeycloakClient {
    private readonly tokenStore: TokenStore;

    constructor() {
        this.tokenStore = new TokenStore();
    }

    async exchangeCode(
        loginInfo: LoginProfileInformation,
        code: string,
        verifier: string,
    ): Promise<KeycloakTokensResponse> {
        const res = await fetch(
            `${KEYCLOAK_URL}/realms/${loginInfo.realm}/protocol/openid-connect/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: 'web',
                    code,
                    redirect_uri: 'http://127.0.0.1:8765/callback',
                    code_verifier: verifier,
                }),
            },
        );

        if (!res.ok) {
            throw new Error('Failed to exchange code - keycloak client');
        }

        const tokens = await res.json();

        return tokens as KeycloakTokensResponse;
    }

    async refresh() {
        const authSaved = this.tokenStore.load();

        if (!authSaved) {
            throw new Error('There is no saved information to refresh');
        }

        const res = await fetch(
            `${KEYCLOAK_URL}/realms/${authSaved.profileInformation.realm}/protocol/openid-connect/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: 'web',
                }),
            },
        );

        if (!res.ok) {
            await this.logout(
                authSaved.profileInformation.realm,
                authSaved.tokens.refreshToken,
            );
            throw new Error('Failed to refresh token - keycloak client');
        }

        const tokens = await res.json();

        return tokens as KeycloakTokensResponse;
    }

    async logout(realm: string, refreshToken: string) {
        await fetch(
            `${KEYCLOAK_URL}/realms/${realm}/protocol/openid-connect/logout`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: 'web',
                    refresh_token: refreshToken,
                }),
            },
        );
    }
}
