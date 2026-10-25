import type { Command } from 'commander';
import { InitialSeedCommandHandler } from '../initial_seed/InitialSeedCommandHandler';

const initialSeedHandler = new InitialSeedCommandHandler();

export function registerInitialSeedCommander(program: Command) {
    program
        .command('initial:seed')
        .summary('Initial seed')
        .description('Initial seed with data from initialData.json with SuperAdmin user')
        .action(() => {
            initialSeedHandler.seed();
        });

    return program;
}
