import chalk from 'chalk';
import profileData from '../data/profile.json';

export function getInformationFromProfileKey(profileKey: string) {
    if (!(profileKey in profileData)) {
        console.log(chalk.red(`Error! Unknown profile ${profileKey}`));
        console.log();
        console.log(chalk.bold('Available profiles:'));
        Object.keys(profileData).forEach((profileKey) => {
            console.log(`- ${profileKey}`);
        });
        process.exit();
    }

    const loginInformation =
        profileData[profileKey as keyof typeof profileData];
    return loginInformation;
}

export function getInfoFromProfile(profile: string) {
    if (!(profile in profileData)) {
        return null;
    }

    const loginInformation = profileData[profile as keyof typeof profileData];

    return loginInformation;
}
