import chalk from 'chalk';
import profileData from '../data/profile.json';
import { AuthService } from './authService';

// merge this with AuthService.login?
export async function login(profile: string) {
    if (!(profile in profileData)) {
        console.log(chalk.red(`Error! Unknown profile ${profile}`));
        console.log();
        console.log(chalk.bold('Available profiles:'));
        Object.keys(profileData).forEach((profileKey) => {
            console.log(`- ${profileKey}`);
        });
        process.exit();
    }

    const loginInformation = profileData[profile as keyof typeof profileData];

    const auth = new AuthService();

    await auth.login(loginInformation);
}

export function getInfoFromProfile(profile: string) {
    if (!(profile in profileData)) {
        return null;
    }

    const loginInformation = profileData[profile as keyof typeof profileData];

    return loginInformation;
}
