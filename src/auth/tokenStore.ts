import fs from 'node:fs';
import chalk from 'chalk';
import type {
    AuthSavedInformation,
    KeycloakTokensResponse,
    LoginProfileInformation,
} from './types';

const filePath = './src/data/authCache.json';

export class TokenStore {
    async save(
        loginInformation: LoginProfileInformation,
        keycloakTokens: KeycloakTokensResponse,
    ) {
        const information: AuthSavedInformation = {
            profileInformation: loginInformation,
            tokens: {
                refreshExpiresAt:
                    Date.now() + keycloakTokens.refresh_expires_in * 1000,
                tokenExpiresAt: Date.now() + keycloakTokens.expires_in * 1000,
                refreshToken: keycloakTokens.refresh_token,
                accessToken: keycloakTokens.access_token,
            },
        };

        try {
            fs.writeFileSync(filePath, JSON.stringify(information), 'utf-8');
        } catch (err) {
            console.log(chalk.red('ERROR saving auth information in file'));
            console.log(err);
            return;
        }
    }

    load(): AuthSavedInformation | null {
        let data: AuthSavedInformation | null = null;
        try {
            const fileData = fs.readFileSync(filePath, 'utf-8');

            data = JSON.parse(fileData) as AuthSavedInformation;
        } catch {}

        return data;
    }

    async clear() {
        fs.unlink(filePath, (err) => {
            if (err) throw err;
            console.log(`successfully deleted ${filePath}`);
        });
    }
}
