import open from 'open';
import { KeycloakClient } from './keycloakClient';
import { waitForAuthorizationCode } from './localServer';
import { TokenStore } from './tokenStore';
import { generateLoginUrl, generatePKCE } from './utils';

export class AuthService {
    private readonly keycloak: KeycloakClient;
    private readonly tokenStore: TokenStore;

    constructor() {
        this.keycloak = new KeycloakClient();
        this.tokenStore = new TokenStore();
    }

    async login() {
        const { verifier, challenge } = generatePKCE();

        const callback = waitForAuthorizationCode();

        const browserLoginUrl = generateLoginUrl(challenge);

        await open(browserLoginUrl.toString());

        const { code, stop: stopServer } = await callback;

        stopServer();

        const tokens = this.keycloak.exchangeCode(code, verifier);

        //         const callback = await waitForAuthorizationCode(8765);
        // open(browserUrl);
        // const { code } = await callback;
        // callback.stop();
        // await this.store.save(tokens);
    }
}
