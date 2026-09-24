import type { Command } from 'commander';
import { UsersCommandHandler } from '../users/UsersCommandHandler';

const usersHandler = new UsersCommandHandler();

export function registerUsersCommander(program: Command) {
    program
        .command('users:list')
        .summary('List users')
        .description('List users paginated')
        .description('SuperAdmin can filter by organizationId.')
        .option(
            '-d, --direction <asc|desc>',
            'results sort direction asc or desc - default: asc',
        )
        .option('-o, --organizationId <number>', 'Filter results by organization (Only SUPERADMIN)')
        .option('-p, --page <number>', 'Pagination page value (starts at 0)')
        .option('-s, --size <number>', 'Pagination page size value ')
        .option('--sb, --sortBy <string>', 'Sort by value')
        .action((options) => {
            const globalOptions = program.opts();
            usersHandler.list(globalOptions.profile, {
                page: options.page ? Number(options.page) : null,
                size: options.size ? Number(options.size) : null,
                sortBy: options.sortBy || null,
                direction: options.direction || null,
                organizationId: options.organizationId || null,
            });
        });

    program
        .command('users:create')
        .summary('Create new user')
        .description('Create users from usersCreate.json')
        .action(() => {
            const globalOptions = program.opts();
            usersHandler.create(globalOptions.profile);
        });

    return program;
}