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
                expiresAt: Date.now() + keycloakTokens.expires_in * 1000,
                refreshToken: keycloakTokens.refresh_token,
                accessToken: keycloakTokens.access_token,
            },
        };

        fs.writeFile(filePath, JSON.stringify(information), 'utf-8', (err) => {
            if (err) {
                console.log(chalk.red('ERROR saving auth information in file'));
                console.log(err);
                return;
            }

            console.log('Auth information saved in file successfully');
        });
    }

    load(): AuthSavedInformation | null {
        let data: AuthSavedInformation | null = null;
        fs.readFile(filePath, 'utf-8', (err, fileData) => {
            if (err) {
                return;
            }

            data = JSON.parse(fileData) as AuthSavedInformation;
        });

        return data;
    }

    async clear() {
        fs.unlink(filePath, (err) => {
            if (err) throw err;
            console.log(`successfully deleted ${filePath}`);
        });
    }
}
