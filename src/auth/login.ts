import chalk from 'chalk';
import profileData from '../data/profile.json';
import { AuthService } from './authService';

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
    console.log(loginInformation);

    const auth = new AuthService();

    await auth.login();

    console.log('Successfully logged in!');
}
