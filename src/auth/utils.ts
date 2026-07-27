import { createHash, randomBytes } from 'crypto';

export function generatePKCE() {
    const verifier = randomBytes(32).toString('base64url');

    const challenge = createHash('sha256').update(verifier).digest('base64url');

    return {
        verifier,
        challenge,
    };
}

export function generateLoginUrl(challenge: string): URL {
    // todo - recive realm
    // todo use keycloak url from .env
    const authUrl = new URL(
        'http://localhost:8081/realms/fleet-flux-admin/protocol/openid-connect/auth',
    );

    authUrl.searchParams.set('client_id', 'web');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile offline_access');
    authUrl.searchParams.set('redirect_uri', 'http://127.0.0.1:8765/callback');

    authUrl.searchParams.set('code_challenge', challenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    return authUrl;
}
