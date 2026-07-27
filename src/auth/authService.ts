import chalk from 'chalk';
import open from 'open';
import { KeycloakClient } from './keycloakClient';
import { waitForAuthorizationCode } from './localServer';
import { TokenStore } from './tokenStore';
import type { LoginProfileInformation } from './types';
import { generateLoginUrl, generatePKCE } from './utils';

export class AuthService {
    private readonly keycloak: KeycloakClient;
    private readonly tokenStore: TokenStore;

    constructor() {
        this.keycloak = new KeycloakClient();
        this.tokenStore = new TokenStore();
    }

    getAccessToken() {
        const authInformation = this.getAuthInformation();

        console.log('this.getAccessToken', authInformation);

        return authInformation ? authInformation.tokens.accessToken : null;
    }

    getAuthInformation() {
        const savedAuth = this.tokenStore.load();

        if (!savedAuth) {
            return null;
        }

        return savedAuth;
    }

    async login(loginInfo: LoginProfileInformation) {
        try {
            const savedAuth = this.tokenStore.load();

            if (
                savedAuth &&
                savedAuth.profileInformation.email === loginInfo.email
            ) {
                this.keycloak.refresh();
                return;
            }

            const { verifier, challenge } = generatePKCE();

            const callback = waitForAuthorizationCode();

            const browserLoginUrl = generateLoginUrl(loginInfo, challenge);

            await open(browserLoginUrl.toString());

            const { code, stop: stopServer } = await callback;

            stopServer();

            const tokens = await this.keycloak.exchangeCode(
                loginInfo,
                code,
                verifier,
            );

            await this.tokenStore.save(loginInfo, tokens);

            console.log(
                chalk.bold.green(`Access token for ${loginInfo.email}`),
            );
            console.log(tokens.access_token);
        } catch {}
    }

    async logout() {
        const savedAuth = this.tokenStore.load();

        if (savedAuth) {
            await this.keycloak.logout(
                savedAuth.profileInformation.realm,
                savedAuth.tokens.refreshToken,
            );
        }

        this.tokenStore.clear();
    }

    async refresh() {
        await this.keycloak.refresh();
    }
}
