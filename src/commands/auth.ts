import chalk from 'chalk';
import type { Command } from 'commander';
import { AuthService } from '../auth/authService';

export function registerAuthCommander(program: Command) {
    program
        .command('auth:login')
        .summary('Login')
        .description(
            'Get Bearer token for a given user (if profile not given defaults to superadmin)',
        )
        .action(async () => {
            const globalOptions = program.opts();
            const auth = new AuthService();

            await auth.login(globalOptions.profile.trim());
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
