import { createHash, randomBytes } from 'crypto';
import { KEYCLOAK_URL } from '../settings';
import type { LoginProfileInformation } from './types';

export function generatePKCE() {
    const verifier = randomBytes(32).toString('base64url');

    const challenge = createHash('sha256').update(verifier).digest('base64url');

    return {
        verifier,
        challenge,
    };
}

export function generateLoginUrl(
    loginInformation: LoginProfileInformation,
    challenge: string,
): URL {
    const authUrl = new URL(
        `${KEYCLOAK_URL}/realms/${loginInformation.realm}/protocol/openid-connect/auth`,
    );

    authUrl.searchParams.set('client_id', 'web');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile offline_access');
    authUrl.searchParams.set('redirect_uri', 'http://127.0.0.1:8765/callback');

    authUrl.searchParams.set('code_challenge', challenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('login_hint', loginInformation.email);

    return authUrl;
}
