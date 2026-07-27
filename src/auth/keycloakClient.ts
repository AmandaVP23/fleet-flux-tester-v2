export class KeycloakClient {
    async exchangeCode(code: string, verifier: string) {
        // POST /token
        // todo - use url from .env
        // todo - receive realm from parameters
        const res = await fetch(
            'http://localhost:8081/fleet-flux-admin/myrealm/protocol/openid-connect/token',
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

        const tokens = await res.json();

        return tokens;
    }

    async refresh(refreshToken: string) {
        // POST /token
    }
}
