import type { Command } from 'commander';
import { OrganizationsCommandHandler } from '../organizations/OrganizationsCommandHandler';

const organizationHandler = new OrganizationsCommandHandler();

export function registerOrganizationsCommander(program: Command) {
    program
        .command('organizations:list')
        .summary('List organizations')
        .description('List organizations paginated')
        .description('ONLY SUPERADMIN')
        .option(
            '-d, --direction <asc|desc>',
            'results sort direction asc or desc - default: asc',
        )
        .option('-f, --filter <ACTIVE|DELETED|ALL>', 'Filter results by status')
        .option('-p, --page <number>', 'Pagination page value (starts at 0)')
        .option('-s, --size <number>', 'Pagination page size value ')
        .option('--sb, --sortBy <string>', 'Sort by value')
        .action((options) => {
            const globalOptions = program.opts();
            organizationHandler.list(globalOptions.profile, {
                page: options.page ? Number(options.page) : null,
                size: options.size ? Number(options.size) : null,
                sortBy: options.sortBy || null,
                direction: options.direction || null,
                filter: options.filter || null,
            });
        });

    return program;
}

// http://localhost:8080/organizations?direction=asc&filter=ACTIVE&page=0&size=20&sortBy=name' \
