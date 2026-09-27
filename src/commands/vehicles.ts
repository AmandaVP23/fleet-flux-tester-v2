import type { Command } from 'commander';
import { VehiclesCommandHandler } from '../vehicles/VehiclesCommandHandler';

const vehiclesHandler = new VehiclesCommandHandler();

export function registerVehiclesCommander(program: Command) {
    program
        .command('vehicles:list')
        .summary('List vehicles')
        .description('List vehicles paginated')
        .description('SuperAdmin should sent organizationId.')
        .option(
            '-d, --direction <asc|desc>',
            'results sort direction asc or desc - default: asc',
        )
        .option('-o, --organizationId <number>', 'Filter results by organization (Only SUPERADMIN)')
        .option('-b, --brandId <number>', 'Filter results by brand')
        .option('-p, --page <number>', 'Pagination page value (starts at 0)')
        .option('-s, --size <number>', 'Pagination page size value ')
        .option('--sb, --sortBy <string>', 'Sort by value')
        .action((options) => {
            const globalOptions = program.opts();
            vehiclesHandler.list(globalOptions.profile, {
                page: options.page ? Number(options.page) : null,
                size: options.size ? Number(options.size) : null,
                sortBy: options.sortBy || null,
                direction: options.direction || null,
                organizationId: options.organizationId || null,
                brandId: options.brandId || null,
            });
        });

    program
        .command('vehicles:create')
        .summary('Create new vehicle')
        .description('Create vehicle from vehiclesCreate.json')
        .action(() => {
            const globalOptions = program.opts();
            vehiclesHandler.create(globalOptions.profile);
        });

    return program;
}