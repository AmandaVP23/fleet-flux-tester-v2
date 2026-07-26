import type { Command } from 'commander';
import { login } from './login';

export function registerAuthCommander(program: Command) {
    program.name('seeder').description('CLI to help test the FleetFlux API.');

    program
        .command('auth:login')
        .summary('Login')
        .description(
            'Get Bearer token for a given user (if profile not given defaults to superadmin)',
        )
        .option(
            '-p, --profile <profile>',
            'user profile (get from data/profile.json)',
            'superadmin',
        )
        .action((options) => {
            console.log('options', options);
            login(options.profile.trim());
        });

    return program;
}
