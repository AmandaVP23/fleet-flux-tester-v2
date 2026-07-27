import chalk from 'chalk';
import type { Command } from 'commander';
import { AuthService } from '../auth/authService';
import { login } from '../auth/login';

export function registerAuthCommander(program: Command) {
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
        // todo allow username/password/realm ?
        .action((options) => {
            login(options.profile.trim());
        });

    program
        .command('auth:logout')
        .summary('Logout')
        .description('End session for current user if exists')
        .action(async () => {
            const authService = new AuthService();

            await authService.logout();

            console.log(chalk.green('Success logout'));
        });

    return program;
}
