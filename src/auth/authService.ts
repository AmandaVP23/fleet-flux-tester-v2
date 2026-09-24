import chalk from 'chalk';
import open from 'open';
import { KeycloakClient } from './keycloakClient';
import { waitForAuthorizationCode } from './localServer';
import { getInformationFromProfileKey } from './login';
import { TokenStore } from './tokenStore';
import type {
    AuthSavedInformation,
    AuthTokensStored,
    LoginProfileInformation,
} from './types';
import { generateLoginUrl, generatePKCE } from './utils';

export class AuthService {
    private readonly keycloak: KeycloakClient;
    private readonly tokenStore: TokenStore;
    private savedFileInformation: AuthSavedInformation | null;

    constructor() {
        this.keycloak = new KeycloakClient();
        this.tokenStore = new TokenStore();
        this.savedFileInformation = this.getAuthInformation();
    }

    getAccessToken() {
        const authInformation = this.getAuthInformation();

        return authInformation ? authInformation.tokens.accessToken : null;
    }

    getAuthInformation() {
        const savedAuth = this.tokenStore.load();

        if (!savedAuth) {
            return null;
        }

        return savedAuth;
    }

    async authenticate(profileKey: string) {
        if (!this.savedFileInformation) {
            await this.login(profileKey);
            return;
        }

        if (
            profileKey !==
            this.savedFileInformation?.profileInformation.profileKey
        ) {
            await this.logout();
            await this.login(profileKey);
            return;
        }

        if (!this.isAccessTokenExpired(this.savedFileInformation.tokens)) {
            return;
        }

        try {
            await this.keycloak.refresh();
        } catch {
            await this.keycloak.logout(
                this.savedFileInformation.profileInformation.realm,
                this.savedFileInformation.tokens.refreshToken,
            );
            await this.login(profileKey);
        }
    }

    async login(profileKey: string) {
        const profileInfo = getInformationFromProfileKey(profileKey);

        try {
            const { verifier, challenge } = generatePKCE();

            const callback = waitForAuthorizationCode();

            const loginInfo: LoginProfileInformation = {
                ...profileInfo,
                profileKey,
            };

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

            chalk.blue('AccessToken:');
            console.log(tokens.access_token);
        } catch {}
    }

    async logout() {
        if (this.savedFileInformation) {
            await this.keycloak.logout(
                this.savedFileInformation.profileInformation.realm,
                this.savedFileInformation.tokens.refreshToken,
            );
        }

        this.tokenStore.clear();
    }

    private isAccessTokenExpired(tokensStored: AuthTokensStored) {
        return new Date() > new Date(tokensStored.tokenExpiresAt);
    }
}
